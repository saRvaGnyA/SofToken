// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract sofToken is
    ERC1155,
    Ownable,
    Pausable,
    ERC1155Burnable,
    ERC1155Supply
{
    // deccalring varialbes section
    struct softlicense {
        uint256 cid; //ipfs cid
        uint256 tokenId; //unique token id
        uint256 price; // the price for the license
        uint256[] dependentId; //array conatins the cid that this licence is dependent upon
        uint256 quantity; //the amount of NFT license that need to be minted
        bool isFirstNFT;
        bool mintedSucessfully;
    }
    struct User {
        address userAddress; //address of the user
        uint256[] NFTsBought; // array of tokenid of the NFT this user has brought
        uint256[] NFTsSold; //array of tokenid of NFT this user has sold
        uint256[] NFTsMinted; //array of tokenid of NFT's this user has minted
        uint256 countNFTsOwned; //count of NFT that this user owns
    }
    mapping(address => softlicense) userLicinseMap; //mapping of useraddress to the liceinse struct
    mapping( address => User) userMap;  
    uint256 idcount=0;  //to maintain the token id number when a NFT is minted

    // construtor
    constructor() ERC1155("") {}

    // Functions of the contract
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

// function to mint NFTs
    function mint(
        address account,
        uint256 id,
        uint256 quantity,
        bytes memory data,
        address userAddress
    ) public payable {
        require(
            msg.value >= userLicinseMap[userAddress].quantity*quantity,
            "insufficient funds to mint NFT of your software"
        );  //if account funds are more than the amount of NFT then only he will be able to mint
        _mint(msg.sender, idcount, quantity, data);
        
        userLicinseMap[userAddress].mintedSucessfully=true;
        
        

    }

    // dependentLicense param contains the token ids that this nft is dependent on
    function dependentNFT(uint256[] memory dependentLiciense, address userAddress) public{
        for(uint256 i=0;i<dependentLiciense.length;i++){
            userLicinseMap[userAddress].dependentId.push(dependentLiciense[i]);
        }
    }

// operations to perform if NFT is minted successfully
    function NFTMinted(address userAddress) public {
        if( userLicinseMap[userAddress].dependentId.length==0){
            userLicinseMap[userAddress].isFirstNFT=true;
        }
        if(userLicinseMap[userAddress].mintedSucessfully==true){
            userMap[userAddress].NFTsBought.push(idcount);
            idcount++;
        }
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
