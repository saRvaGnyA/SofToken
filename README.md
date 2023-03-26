# 🗄️ SofToken

![Cream and Pink Classic Circular Fashion Fashion Logo](https://user-images.githubusercontent.com/24823649/227786509-61cd808d-2667-4637-a737-64efe207e711.png)

## Secure & Efficient solution for Open Source Software Licenses.
SofToken is a blockchain-based application that allows users to Mint a NFT for their software. Other users have a option to subscribe to the minted NFT and use it to build their own software. Different types of restrictions can be applied to the usage of a software before it is minted.

[Demo Video](https://youtu.be/Y7W1sl1kC9A)

## ⚒️ Working of SofToken


![image](https://user-images.githubusercontent.com/90528630/227774600-76e0ca14-1cc6-4e79-a5ae-be979421c0e6.png)


- User creates his/her profile. The details are stored on IPFS & Polybase.
- User can Follow other people.
- User can mint NFT for his software having a option on which type of NFT he/she wants to mint.
- 3 ways to Mint NFT :-

    - ![image](https://user-images.githubusercontent.com/90528630/227760594-4ecbd8d5-dd14-4b2d-a8fd-388e6fdc3eaa.png)

    - proprierty executable : 
        - Only the executable file of the software minted (NFT A) is shared with User 2
        - User 2 cannot mint his own NFT B using NFT software A.
     
    - Reusable & Modifiable (without Royalty):
        - Code files are shared with the user
        - User can mint his own NFT B using the software as a dependent NFT A.
        - None of the total amount User 2 receives from his subscribers is given to User 1.

    - Reusable & Modifiable (With Royalty):
        - Code files are shared with the user
        - User can mint his own NFT B using the software as a dependent NFT A.
        - 10% of the total amount User 2 receives from his subscribers is given to User 1 as royalty fee.
- User can Filter out NFT Softwares based on Price, Ratings etc.
- User can give his own rating to the software.
- Live Price of the NFT is determined by the Ratings it gets.
    - The rating is passed through Aggregator function which calculates the price of the NFT off the chain. (No gas consumed)
- User can subscribe to the NFT software. After subscription, user can download ZIP files for the software.
- Once subscribed user can :-
    - chat with the owner of the NFT software.
    - Group chat with other subscribers to the same NFT software.
    - Notifications are sent to the user on receiving messages.



## ✨Features
- Live Chart Demographics of top NFT softwares.
- Dymanic Price changes in NFT based on Ratings.
- Mint NFT in 3 ways.
- Live 1-1 and Group chat with people.
- IPFS and Polybase Storage.
- Filter NFT's based on needs
- Notification sent to users.
- Download ZIP file of software.

## ⚙️ Tech Stack
- NextJS - Frontend
- Solidity - Smart Contract
- Scroll - Deployment of Contract.
- Polygon zkEVM - Deployment of Contract.
- Polybase - Storing User and NFT details.
- Push Protocol 
    - Push Chat for 1-1 Chat
    - Push Group Chat
    - Push Notifications
- [Chainlink Functions](https://github.com/Jigsaw-23122002/Chainlink-Functions-for-ETH-Scaling) - Implementing Aggregator function off the chain
- IPFS - Storing ZIP files of software, User Profile, Cover Images.
- ThirdWeb


## 🗒️Smart Contracts

### Smart Contract: `SofToken.sol`

Deployment Network - Scroll Alpha Testnet

Contract Address: 0x60Bf1723BA636b47F7F7765247DbCdA7eC3E52e2

BlockScout Scroll Alpha Testnet link: [Link](https://blockscout.scroll.io/address/0x60Bf1723BA636b47F7F7765247DbCdA7eC3E52e2)


### Smart Contract: `functionsConsumer.sol` - aggregator

Deployment Network: Polygon zkEVM

Contract Address: 0x744b61418D77d4C4AA953cD36403D353F7Cd947e

Block explorer Polygon zkEVM link:  [Link](https://testnet-zkevm.polygonscan.com/address/0x744b61418D77d4C4AA953cD36403D353F7Cd947e)

## 🔍 Future Scope
- Implement TheGraph for fetching the live rates of the NFT's.
- Mobile Application for chart demographics.
- Categorizing NFT softwares into different domains.
- Integrate Push Notifications with TheGraph subgraph.


## 👩‍💻 Team members

- **Sarvagnya Putohit**
- **Harsh Nag**
- **Ananya Bangera**
- **Chaitya Vora**
- **Smit Sekhadia**
