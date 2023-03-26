@public
collection User {
  id: string;
  publicKey: PublicKey;
  username: string;
  name: string; 
  bio: string; 
  profilePic: string;
  coverPic: string;
  timestamp: string;
  nfts: NFT[];

  constructor (id: string, timestamp: string, username: string, name: string, bio: string, coverPic: string, profilePic: string) {
    this.id = id;
    this.timestamp = timestamp;
    this.name = name;
    this.bio = bio;
    this.coverPic = coverPic;
    this.profilePic = profilePic;
    this.username = username;
    this.nfts = [];
    this.publicKey = ctx.publicKey;
  }

  function updateDetails(name: string, bio: string, profilePic: string, coverPic: string) {
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.name = name;
    this.bio = bio;
    if(profilePic != '') {
      this.profilePic = profilePic;
    }
    if(coverPic != '') {
      this.coverPic = coverPic;
    }
  }

  function addNFT(nft: NFT) {
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.nfts.push(nft);
  }
}

@public
collection Follows {
  owner: PublicKey;
  id: string;
  follower_id: string;
  following_id: string;

  constructor(follower_id: string, following_id: string) {
    this.follower_id = follower_id;
    this.following_id = following_id;
    this.id = this.follower_id + '-' + this.following_id;
    this.owner = ctx.publicKey;
  }

   function del() {
    if (this.owner != ctx.publicKey) {
      throw error('You are not the follower');
    }
    selfdestruct();
  }
}

@public 
collection NFT {
  id: string;
  minter: User;
  name: string;
  description: string;
  timestamp: string;
  base_price: number;
  clause_type: string;
  dependency: NFT[];

  constructor(id: string, name: string, description: string, timestamp: string, base_price: number, clause_type: string, dependency: NFT[], minter: User) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.timestamp = timestamp;
    this.base_price = base_price;
    this.clause_type = clause_type;
    this.dependency = dependency;
    this.minter = minter;
  }
}
