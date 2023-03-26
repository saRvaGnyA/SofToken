// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "/node_modules/openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "/node_modules/openzeppelin/contracts/access/Ownable.sol";
import "/node_modules/openzeppelin/contracts/security/Pausable.sol";
import "/node_modules/openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "/node_modules/openzeppelin/contracts/utils/Strings.sol";

contract Web3Builders is ERC1155, Ownable, Pausable, ERC1155Supply {
    uint256 public total_tokens = 0;
    uint256 private min_token_value = 0.01 ether;
    uint256 private permitted_number_of_tokens = 1;

    mapping(uint256 => address) private token_to_creator_address;
    mapping(address => uint256[]) private address_to_created_token;
    mapping(string => uint256) private cid_to_token;
    mapping(uint256 => string) public token_to_cid;
    mapping(address => uint256[]) private address_to_subscribed_token;
    // mapping(address => mapping(uint256 => uint256)) private user_token_database;
    mapping(address => mapping(uint256 => mapping(uint256 => uint256)))
        private user_token_database;
    //0th index for whether he has minted nft or not
    //1st index for whether he has voted or not
    mapping(uint256 => uint256[]) votes_and_ratings;
    // 0th index for upvotes
    //1st index for downvotes
    //2nd index for rating
    mapping(uint256 => uint256[]) dependent_database;
    mapping(uint256 => uint256) total_cost_per_token;
    mapping(uint256 => uint256) total_owners_per_nft;

    constructor()
        ERC1155(
            "ipfs://bafybeihpjhkeuiq3k6nqa3fkgeigeri7iebtrsuyuey5y6vy36n345xmbi/"
        )
    {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function getCID(uint256 tok_id) public view returns (string memory) {
        return token_to_cid[tok_id];
    }

    function mint_nft(
        string memory cid,
        string[] memory dependent_cid
    ) public payable returns (uint256) {
        _mint(msg.sender, total_tokens, permitted_number_of_tokens, "");

        token_to_creator_address[total_tokens] = msg.sender;
        address_to_created_token[msg.sender].push(total_tokens);
        cid_to_token[cid] = total_tokens;
        token_to_cid[total_tokens] = cid;
        // user_token_database[msg.sender][total_tokens] = 1;
        user_token_database[msg.sender][total_tokens][0] = 1;
        user_token_database[msg.sender][total_tokens][1] = 0; //0 means he hasn't voted yet
        votes_and_ratings[total_tokens] = [0, 0, 0]; //initially everything is zero
        total_owners_per_nft[total_tokens] = 1;

        for (uint256 i = 0; i < dependent_cid.length; i++) {
            uint256 token_id = cid_to_token[dependent_cid[i]];
            dependent_database[total_tokens].push(token_id);
        }

        total_cost_per_token[total_tokens] =
            total_cost_per_token[total_tokens] +
            msg.value;
        total_tokens++;
        return total_tokens - 1;
    }

    function subscribe(uint256 token_id, uint256 cost_of_token) public payable {
        require(
            user_token_database[msg.sender][token_id][0] == 0,
            "User have already subscribed to this codebase."
        );
        require(
            msg.value == cost_of_token,
            "Incorrect amount of ether is sent."
        );

        _mint(msg.sender, token_id, permitted_number_of_tokens, "");
        address_to_subscribed_token[msg.sender].push(token_id);
        // user_token_database[msg.sender][token_id] = 1;
        user_token_database[msg.sender][token_id][0] = 1;
        user_token_database[msg.sender][token_id][1] = 0;
        total_cost_per_token[token_id] =
            total_cost_per_token[token_id] +
            msg.value;
        total_owners_per_nft[token_id] = total_owners_per_nft[token_id] + 1;
    }

    function getCreatedTokensIds() public view returns (uint256[] memory) {
        return address_to_created_token[msg.sender];
    }

    function getSubscribedTokenIds() public view returns (uint256[] memory) {
        return address_to_subscribed_token[msg.sender];
    }

    function getTotalTokens() public view returns (uint256) {
        return total_tokens;
    }

    //allows voting for given nft
    function vote(uint256 token_id, uint256 vote_type) public {
        //0 for upvote
        require(
            user_token_database[msg.sender][token_id][1] == 0,
            "Sorry,you can't vote"
        );
        if (vote_type == 0) {
            votes_and_ratings[token_id][0] = votes_and_ratings[token_id][0] + 1;
        }
        //1 for downvote
        else {
            votes_and_ratings[token_id][1] = votes_and_ratings[token_id][1] + 1;
        }
        user_token_database[msg.sender][token_id][1] == 1;
    }

    //calculates rating of given nft
    function calculateRating(uint256 token_id) public returns (uint256) {
        uint256 upvotes = votes_and_ratings[token_id][0];
        uint256 downvotes = votes_and_ratings[token_id][1];
        uint256 total_votes = upvotes + downvotes;
        return (upvotes * 100) / total_votes;
    }

    //calculates current value of given nft
    function calculateTokenValue(uint256 token_id) public returns (uint256) {
        uint256 rating = calculateRating(token_id);
        total_cost_per_token[token_id] =
            total_cost_per_token[token_id] *
            rating;

        return (total_cost_per_token[token_id] /
            total_owners_per_nft[token_id]);
    }

    function getVotesAndRating(
        uint256 token_id
    ) public view returns (uint256[] memory) {
        return votes_and_ratings[token_id];
    }

    function withdraw(uint256 token_id) external {
        require(
            token_to_creator_address[token_id] == msg.sender,
            "You are not the owner of this NFT."
        );

        uint256 number_of_dependent_owners = dependent_database[token_id]
            .length;
        if (number_of_dependent_owners == 0) {
            uint256 cost_to_owner = total_cost_per_token[token_id];
            payable(msg.sender).transfer(cost_to_owner);
        } else {
            uint256 total_cost_to_be_split = total_cost_per_token[token_id] /
                10;
            uint256 cost_to_owner = total_cost_per_token[token_id] -
                total_cost_to_be_split;
            uint256 individual_cost = total_cost_to_be_split /
                number_of_dependent_owners;

            for (uint256 i = 0; i < number_of_dependent_owners; i++) {
                address dependent_owner = token_to_creator_address[
                    dependent_database[token_id][i]
                ];
                payable(dependent_owner).transfer(individual_cost);
            }
            payable(msg.sender).transfer(cost_to_owner);
            total_owners_per_nft[token_id] = total_owners_per_nft[token_id] - 1;
        }
    }

    function uri(
        uint256 _id
    ) public view virtual override returns (string memory) {
        require(exists(_id), "URI: nonexistent token");
        return
            string(
                abi.encodePacked(super.uri(_id), Strings.toString(_id), ".json")
            );
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
