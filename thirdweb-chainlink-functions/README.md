# Chainlink Functions using thirdweb
An example use case for Chainlink Functions - call a Chess API to retrieve the ratings of two chess players & calculate the new ELO rating based on who wins the subsequent match.

This repository is a simplified and modified version of the official [Chainlink Functions Starter Kit](https://github.com/smartcontractkit/functions-hardhat-starter-kit).

## Using this repo
Prerequisites:
- Git
- Hardhat
- Cast

To create a copy of this template, run the command from your terminal:

```Bash
npx thirdweb create --template thirdweb-chainlink-functions
```

## Deploying the Consumer contract

- Run the command:

```Bash
npx thirdweb deploy
```
- Select the `FunctionsConsumer` contract
- Copy and paste as the contract parameter the oracle address corresponding to the network you are deploying to
- Click __Deploy Now__ and verify the transaction

## Create & Fund a Subscription
Chainlink Functions uses the subscription method to manage and fund consumer contracts to enable them to make requests to the Chainlink Decentralized Oracle Network (DON)

To create a subscription, import the `FunctionsBillingRegistry` contract, corresponding to the network you are working on, to your Dashboard using the search bar. 

Call the __write__ function `createSubscription` and copy the subscription Id from the event in the events tab

Add your consumer contract as a consumer by calling the function `addConsumer` on the Billing Registry by filling in your consumer contract address and subscription Id. 

## Funding your Subscription

Import the `LinkToken` contract to your Dashboard and select the `transferAndCall` function. For the `data` parameter, you will need to ABI encode your subscription Id. To do this run the following command in your terminal:

```Bash
cast abi-encode "f(uint256)" "<your-subscription-id>"
```

Copy the result and use as the `data` parameter. Paste the Billing Registry address as the `address` parameter. The `amount` parameter is measured in JUELS so 5 LINK will have an input of 5000000000000000000.

## Making a Request

Select the function `executeRequest` and use the following values as parameters:

- Source: copy the code from inside `scripts/functions.js`
- Secrets: We are not using secrets (where you could use secrets e.g. encrypted API Keys) - `0x`
- Location: `0` denotes Inline, `1` denotes Remote. Use a value of `0`
- Args: `["0", "1"]` - the first param (either `0` or `1`) specified whether to calculate player 1 or 2's rating, the second param specifies whether they won or lost the subsequent match `0` = lose, `1` = win.

Execute the transaction, making sure to set a manual gas limit in your browser wallet (a value of 500000 should do it!)

## Reading the results

Call the __read__ function `latestResponse` to read the updated ELO rating.

This value can now be used in, for example, updating dynamic NFT metadata to have the NFT represent the player's current rating. By combining with Chainlink Automation, this process becomes seamless and automatic when a player completes a match. 

## Useful Addresses

  mainnet:
    linkToken: "0x514910771af9ca656af840dff83e8264ecf986ca",

  polygon:
    linkToken: "0xb0897686c545045afc77cf20ec7a532e3120e0f1",

  mumbai:
    linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
    linkEthPriceFeed: "0x12162c3E810393dEC01362aBf156D7ecf6159528"
    functionsOracleProxy: "0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4"
    functionsBillingRegistryProxy: "0xEe9Bf52E5Ea228404bB54BCFbbDa8c21131b9039"
    functionsPublicKey:
      "a30264e813edc9927f73e036b7885ee25445b836979cb00ef112bc644bd16de2db866fa74648438b34f52bb196ffa386992e94e0a3dc6913cee52e2e98f1619c"

  sepolia: 
    linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789"
    linkEthPriceFeed: "0x42585eD362B3f1BCa95c640FdFf35Ef899212734"
    functionsOracleProxy: "0x649a2C205BE7A3d5e99206CEEFF30c794f0E31EC"
    functionsBillingRegistryProxy: "0x3c79f56407DCB9dc9b852D139a317246f43750Cc"
    functionsPublicKey:
      "a30264e813edc9927f73e036b7885ee25445b836979cb00ef112bc644bd16de2db866fa74648438b34f52bb196ffa386992e94e0a3dc6913cee52e2e98f1619c"