# phantasma-ts

A TypeScript SDK for the Phantasma blockchain.

## Installation

Use the package manager [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install phatasma-ts.

```bash
npm install phantasma-ts
```


## Importing

```javascript
const { phantasmaJS } = require('phantasma-ts')

```

## Standalone HTML Import
```html
<script src="https://cdn.jsdelivr.net/gh/phantasma-io/phantasma-ts/html/phantasma.js"></script>
```
```javascript
phantasma.phantasmaJS   // To use PhantasmaJS
phantasma.PhantasmaLink // To use PhantasmaLink
phantasma.EasyConnect   // To use EasyConnect, an easy to use PhantasmaLink wrapper
```

## Table Of Contents
The Phantasma TypeScript SDK transpiles into phantasmaJS, PhantasmaLink and EasyConnect.


1. [PhantasmaJS](#phantasmajs) - Allows you to interact with the Phantasma Blockchain
    - [Utility Functions](#PhantasmaJS-Utility-Functions)
    - [Script Builder](#Building-a-Script-with-Script-Builder)
        - [Interop Commands](#Interop-Functions)  
        - [Building Transaction](#Building-a-Transaction)  
        - [Deploying Smart Contract](#Deploying-a-Contract)
        - [RPC](#Using-RPC)

2. [PhantasmaLink](#phantasmalink) - Allows you to interact with Phantasma based wallets
    - [Functions](#functions)
    - [Examples](#Example-Code)

3. [EasyConnect](#easyconnect) - Easy plug and play solution for creating DApps
    - [Core Functions](#Core-Functions)
    - [Query Function](#Query-Function)
    - [Action Function](#Action-Function)
    - [Easy Script](#Easy-Script-Create)

4. [Misc]
    - [Vocab](#Vocab)

---
## PhantasmaJS
Use phantasmaJS to interact with the Phantasma blockchain directly.

### PhantasmaJS Utility Functions
Just some standard useful functions that you probably will end up using at some point.
```javascript
phantasmaJS.byteArrayToHex(arr: ArrayBuffer | ArrayLike<number>); //Turns a Byte Array into Serialized Hex
```

```javascript
phantasmaJS.getAddressFromWif(wif: string); //Get's Public Address from WIF (Wallet Import Format)
```

```javascript
phantasmaJS.getPrivateKeyFromWif(wif: string); //Get's Private Key from WIF (Wallet Import Format)
```

```javascript
phantasmaJS.hexToByteArray(hexBytes: string); //Turns Serialized Hex into Byte Array
```

```javascript
phantasmaJS.reverseHex(hex: string); //Reverse <-> esreveR Serialized Hex
```

```javascript
phantasmaJS.signData(msgHex: string, privateKey: string); //Signs some text with given Private Key
```

### Decoding a invokeScript result
```javascript
const decoder = new phantasmaJS.Decoder('0303FB0200');	// here this value its something you obtained for example as the result of a invokeScript
const value = decoder.readVmObject();

console.log(value); // will print 
```

### Building a Script with Script Builder

Building a script is the most important part of interacting with the Phantasma blockchain. Without a propper script, the Phantasma blockchain will not know what you are trying to do. 

These functions, ```.callContract``` and ```.callInterop```, are your bread and butter for creating new scripts.

``` .callContract(contractName: string, methodName: string, [arguments]: array)```

``` .callInterop(functionName: string, [arguments]: array)```


- You can find out all the diffrent ```.callInterop``` functions below.

- For ```.callContract```, you will have to look through the ABI's of all the diffrent smart contracts currently deployed on the Phantasma 'mainnet': [Link Here](https://explorer.phantasma.io/chain/main#tab_contracts)

#### Example:
```javascript
//Creating a new Script Builder Object
let sb = new phantasmaJS.ScriptBuilder();

//Here is an example of a Transactional Script
    sb
    .allowGas(fromAddress, sb.nullAddress, gasPrice, gasLimit)
    .callInterop("Runtime.TransferTokens", ['fromAddress', 'toAddress', 'KCAL', 10000000000]) //10000000000 = 1 KCAL
    .spendGas(fromAddress)
    .endScript();

--- OR ----

//Here is an example of a non Transactional Script

    sb
    .callContract('account', 'LookUpName', ['accountName'])
    .endScript();

```
#### Interop Functions:
Here are some Interop functions that are used to interact with the core functionality of the Phantasma blockchain. Use these inside your script to add extra functionality.
```javascript
sb.callInterop("Runtime.MintTokens", [from: string, target: string, tokenSymbol: string , amount: number]); //Used for Fungible Tokens
```

```javascript     
sb.callInterop("Runtime.TransferTokens", [from: string, to: string, tokenSymbol: string, amount: number]); //Used for Fungible Tokens
```
    
```javascript
sb.callInterop("Runtime.TransferBalance", [from: string, to: string, tokenSymbol: string]);
```

```javascript
sb.callInterop("Runtime.TransferToken", [from: string, to: string, tokenSymbol: string, tokenId: number]); //Used for Non Fungible Tokens
```

```javascript
sb.callInterop("Runtime.SendTokens", [destinationChain: string, from: string, to: string, tokenSymbol: string, amount: number); //Used for Fungible Tokens
```

```javascript
sb.callInterop("Runtime.SendToken", [destinationChain: string, from: string, to: string, tokenSymbol: string, tokenId: number]); //Used for Non Fungible Tokens
```

```javascript
sb.callInterop("Runtime.DeployContract", [from: string, contractName: string, pvm: hexString, abi: hexString]);
```

### Building a Transaction
To build a transaction you will first need to build a script.

Note, building a Transaction is for transactional scripts only. Non transactional scripts should use the RPC function ```RPC.invokeRawScript(chainInput: string, scriptData: string)```
```javascript

async function sendTransaction() {
        let privateKey = 'yourPrivateKey'; //In Hex Format

        let fromAddress = 'yourPublicWalletAddress';
        let toAddress = 'addressYourSendingTo';

        //Creating a new Script Builder Object
        let sb = new phantasmaJS.ScriptBuilder();
        let gasPrice = 10000; 
        let gasLimit = 21000;

        //Creating RPC Connection **(Needs To Be Updated)
        let RPC = new phantasmaJS.PhantasmaAPI('http://testnet.phantasma.io:5101/rpc', 'https://ghostdevs.com/getpeers.json', 'mainnet');

        //Making a Script
        let script = sb
            .allowGas(fromAddress, sb.nullAddress, gasPrice, gasLimit)
            .callInterop("Runtime.TransferTokens", [fromAddress, toAddress, 'KCAL', 10000000000]) //10000000000 = 1 KCAL
            .spendGas(fromAddress)
            .endScript();

        //Used to set expiration date
        let expiration = 5; //This is in miniutes
        let getTime = new Date();
        let date = new Date(getTime.getTime() + expiration * 60000);

        let payload = '7068616e7461736d612d7473' //Says 'Phantasma-ts' in hex

        //Creating New Transaction Object
        let transaction = new phantasmaJS.Transaction(
            'testnet',  //Nexus Name - if you're using mainnet change it to mainnet
            'main',     //Chain
            script,     //In string format
            expiration, //Date Object
            payload     //Extra Info to attach to Transaction in Serialized Hex
        );

        //Sign's Transaction with Private Key
        await transaction.sign(privateKey);

        //Send Transaction
        let txHash = await RPC.sendRawTransaction(transaction.toString(true));

        //Return Transaction Hash
        return txHash;
    }

```

### Staking SOUL
This is an example how to stake SOUL
```javascript

async function stakeSOUL() {
        let privateKey = 'yourPrivateKey'; //In Hex Format

        let fromAddress = 'yourPublicWalletAddress'; // Phantasma Public Address

        //Creating a new Script Builder Object
        let sb = new phantasmaJS.ScriptBuilder();
        let gasPrice = 10000; 
        let gasLimit = 21000;
        let amount =  String(100 * 10**8); // 100 the amount - 10**8 it's to get the decimals to the desired amount
        // Soul has 8 decimals places.

        //Creating RPC Connection **(Needs To Be Updated)
        let RPC = new phantasmaJS.PhantasmaAPI('http://testnet.phantasma.io:5101/rpc', 'https://ghostdevs.com/getpeers.json', 'testnet');

        //Making a Script
        let script = sb
            .allowGas(fromAddress, sb.nullAddress, gasPrice, gasLimit)
            .callContract("stake", "stake", [fromAddress, amount]) 
            .spendGas(fromAddress)
            .endScript();

        //Used to set expiration date
        let expiration = 5; //This is in miniutes
        let getTime = new Date();
        let date = new Date(getTime.getTime() + expiration * 60000);

        let payload = '7068616e7461736d612d7473' //Says 'Phantasma-ts' in hex

        //Creating New Transaction Object
        let transaction = new phantasmaJS.Transaction(
            'testnet',  //Nexus Name - if you're using mainnet change it to mainnet
            'main',     //Chain
            script,     //In string format
            expiration, //Date Object
            payload     //Extra Info to attach to Transaction in Serialized Hex
        );

        //Sign's Transaction with Private Key
        await transaction.sign(privateKey);

        let transactionSigned = transaction.toString(true);

        //Send Transaction
        let txHash = await RPC.sendRawTransaction(transactionSigned);

        //Return Transaction Hash
        return txHash;
    }

```

### Deploying a Contract
```javascript
async function deployContract() {
    
    //Wallet Stuff
    let privateKey = 'privateKey'; //In Hex Format
    let fromAddress = 'publicAddress';

    //Contract Stuff
    let pvm = 'PVM HEX String';
    let abi = 'ABI HEX String';
    let gasPrice = 10000; 
    let gasLimit = 21000;
    let contractName = 'ContractName' //Whatever you want

    //Creating a new Script Builder Object
    let sb = new phantasmaJS.ScriptBuilder();

    //New RPC and Peers Needed
    //Creating RPC Connection, use ('http://testnet.phantasma.io:5101/rpc', 'https://ghostdevs.com/getpeers.json', 'testnet') for testing
    let RPC = new phantasmaJS.PhantasmaAPI('http://phantasma.io:5101/rpc', 'https://ghostdevs.com/getpeers.json', 'mainnet');

    //Making a Script
    let script = sb
        .allowGas(fromAddress, sb.nullAddress, gasPrice, gasLimit)
        .callInterop("Runtime.DeployContract", [fromAddress, contractName, pvm, abi])
        .spendGas(fromAddress)
        .endScript();

    //Used to set expiration date
    let expiration = 5; //This is in miniutes
    let getTime = new Date();
    let date = new Date((getTime.getTime() + expiration * 60000));
    
    //Setting Temp Payload
    let payload = "MyApp";

    //Creating New Transaction Object
    let transaction = new phantasmaJS.Transaction(
        'testnet',  //Nexus Name
        'main',     //Chain
        script,     //In string format
        expiration, //Date Object
        payload     //Extra Info to attach to Transaction in Serialized Hex
    );

    //Deploying Contract Requires POW -- Use a value of 5 to increase the hash difficulty by at least 5
    transaction.mineTransaction(5);

    //Signs Transaction with your private key
    transaction.sign(privateKey);

    let transactionSigned = transaction.toString(true);

    //Sends Transaction
    let txHash = await RPC.sendRawTransaction(transactionSigned);

    //Returns Transaction Hash
    return txHash;
}

```

### Scanning the blockchain for incoming transactions
```javascript
const { phantasmaJS } = require('phantasma-ts')

let RPC = new phantasmaJS.PhantasmaAPI('seed.ghostdevs.com:7077/rpc', 'https://ghostdevs.com/getpeers.json', 'mainnet');

// Store the current height of the chain
let currentHeight = 1;

let chainName = 'main';

function onTransactionReceived(address, symbol, amount) {
}

// Function that periodically checks the height of the chain and fetches the latest block if the height has increased
async function checkForNewBlocks() {
  // Get the current height of the chain
  let newHeight = await RPC.getBlockHeight(chainName);

  // Check if the height has increased
  if (newHeight > currentHeight) {
    // Fetch the latest block
    let latestBlock = await RPC.getBlockByHeight(chainName, newHeight);
	
	// Check all transactions in this block
	for (i = 0; i < latestBlock.txs.length; i++)
    {
		let tx = latestBlock.txs[i];

		// Check all events in this transaction
		for (j = 0; j < tx.events.length; j++)
	    {
			let evt = tx.events[j];
			if (evt.kind == 'TokenReceive') {
				var data = phantasmaJS.getTokenEventData(evt.data);
				onTransactionReceived(evt.address, data.symbol, data.value);
			}
	    }
    }

    // Update the current height of the chain
    currentHeight = newHeight;
  }

  // Repeat this process after a delay
  setTimeout(checkForNewBlocks, 1000);
}

// Start checking for new blocks
checkForNewBlocks();
```


### Using RPC 
```javascript
let RPC = new phantasmaJS.PhantasmaAPI('seed.ghostdevs.com:7077/rpc', 'https://ghostdevs.com/getpeers.json', 'mainnet');
```
#### Utillities:
- ``` RPC.JSONRPC(method: string, params: Array<any>); ``` <- Used to make any Phantasma RPC call
- ``` RPC.updateRpc()```
- ``` RPC.setRpcHost(rpcHost: string)```
- ``` RPC.setRpcByName(rpcName: string)```
- ``` RPC.setNexus(nexus: string)```
- ``` RPC.convertDecimals(amount: number, decimals: number)```
#### All RPC Function Calls:
```javascript
await RPC.getAccount(account: string); //Returns the account name and balance of given address.
```

```javascript
await RPC.lookUpName(name: string); //Returns the address that owns a given name.
```

```javascript
await RPC.getBlockHeight(chainInput: string); //Returns the height of a chain.
```

```javascript
await RPC.getBlockTransactionCountByHash(blockHash: string); //Returns the number of transactions of given block hash or error if given hash is invalid or is not found.
```

```javascript
await RPC.getBlockByHash(blockHash: string); //Returns information about a block by hash.
```

```javascript
await RPC.getRawBlockByHash(blockHash: string); //Returns a serialized string, containing information about a block by hash.
```

```javascript
await RPC.getBlockByHeight(chainInput: string, height: number); //Returns information about a block by height and chain.
```

```javascript
await RPC.getRawBlockByHeight(chainInput: string, height: number); //Returns a serialized string, in hex format, containing information about a block by height and chain.
```

```javascript
await RPC.getTransactionByBlockHashAndIndex(blockHash: string, index: number); //Returns the information about a transaction requested by a block hash and transaction index.
```

```javascript
await RPC.getAddressTransactions(account: string, page: number, pageSize: number); //Returns last X transactions of given address.
```

```javascript
await RPC.getAddressTransactionCount(account: string, chainInput: string); //Get number of transactions in a specific address and chain.
```

```javascript
await RPC.sendRawTransaction(txData: string); //Allows to broadcast a signed operation on the network, but it&apos;s required to build it manually.
```

```javascript
await RPC.invokeRawScript(chainInput: string, scriptData: string); //Allows to invoke script based on network state, without state changes.
```

```javascript
await RPC.getTransaction(hashText: string); //Returns information about a transaction by hash.
```

```javascript
await RPC.cancelTransaction(hashText: string); //Removes a pending transaction from the mempool.
```

```javascript
await RPC.getChains(); //Returns an array of all chains deployed in Phantasma.
```

```javascript
await RPC.getNexus(); //Returns info about the nexus.
```

```javascript
await RPC.getOrganization(ID: string); //Returns info about an organization.
```

```javascript
await RPC.getLeaderboard(name: string); //Returns content of a Phantasma leaderboard.
```

```javascript
await RPC.getTokens(); //Returns an array of tokens deployed in Phantasma.
```

```javascript
await RPC.getToken(symbol: string); //Returns info about a specific token deployed in Phantasma.
```

```javascript
await RPC.getTokenData(symbol: string, IDtext: string); //Returns data of a non-fungible token, in hexadecimal format.
```

```javascript
await RPC.getTokenBalance(account: string, tokenSymbol: string, chainInput: string); //Returns the balance for a specific token and chain, given an address.
```

```javascript
await RPC.getAuctionsCount(chainAddressOrName: string, symbol: string); //Returns the number of active auctions.
```

```javascript
await RPC.getAuctions(chainAddressOrName: string, symbol: string, page: number, pageSize: number); //Returns the auctions available in the market.
```

```javascript
await RPC.getAuction(chainAddressOrName: string, symbol: string, IDtext: string); //Returns the auction for a specific token.
```

```javascript
await RPC.getArchive(hashText: string)getArchive(hashText: string); //Returns info about a specific archive.
```

```javascript
await RPC.writeArchive(hashText: string, blockIndex: number, blockContent: string); //Writes the contents of an incomplete archive.
```

```javascript
await RPC.getABI(chainAddressOrName: string, contractName: string); //Returns the ABI interface of specific contract.
```

```javascript
await RPC.getPeers(); //Returns list of known peers.
```

```javascript
await RPC.relaySend(receiptHex: string); //Writes a message to the relay network.
```

```javascript
await RPC.relayReceive(account: string); //Receives messages from the relay network.
```

```javascript
await RPC.getEvents(account: string); //Reads pending messages from the relay network.
```

```javascript
await RPC.getPlatforms(); //Returns an array of available interop platforms. 
```

```javascript
await RPC.getValidators(); //Returns an array of available validators.
```

```javascript
await RPC.settleSwap(sourcePlatform: string, destPlatform: string, hashText: string); //Tries to settle a pending swap for a specific hash.
```

```javascript
await RPC.getSwapsForAddressOld(account: string); //Returns platform swaps for a specific address.
```

```javascript
await RPC.getSwapsForAddress(account: string, platform: string); //Returns platform swaps for a specific address. 
```

```javascript
await RPC.getNFT(symbol: string, nftId: string); //Returns info of a nft.
```


## PhantasmaLink
PhantasmaLink is a core connecting piece that allows you to interact with Phantasma based Wallets. PhantasmaLink is a building block to help you connect with wallets, however if you are more interested in using a more simple plug and play product, please see [EasyConnect](#easyconnect) **<- Super Useful**


Since phantasmaLink is a Class we are going to initiate a new phantasmaLink object.
```javascript
let dappID = "Dapp Name";   //This is just the name you want to give the connection
let consoleLogging = true;  //This is if you want console logging for Debugging Purposes [Default is set to true]

let link = new PhantasmaLink(dappID, consoleLogging); 
```
#### Vocab
- ``` Callback - Function that gets called on after a success``` 
- ``` onErrorCallback - Function that gets called on after a failure```
- ``` Script - A set of instructions for that PhantasmaChain to decode that lies inside of a transaction object``` See [ScriptBuilder](#building-a-script-with-script-builder)
- ``` Nexus - The chain on Phantasma that is being used: Either 'mainnet' or 'testnet'```
- ``` Payload - Extra data attached to a transaction object```
- ``` ProviderHint - Tells PhantasmaLink which wallet you intend to connect with```

### Functions:
```javascript
link.login(onLoginCallback, onErrorCallback, providerHint);  //Provider Hint can be 'ecto' or 'poltergeist'
```

```javascript
link.invokeScript(script, callback);  //Allows you to do a ReadOnly script operation on the Phantasma Blockchain (Sends results as an Argument to Callback Function)
```

```javascript
link.signTx(nexus, script, payload, callback, onErrorCallback);  //Signs a Transaction via Wallet (payload can be Null) (Sends results as an Argument to Callback Function)
```

```javascript
link.signTxPow(nexus, script, payload, proofOfWork, callback, onErrorCallback);  //Signs a Transaction via Wallet with ProofOfWork Attached (Used for Contract Deployment)

//ProofOfWork Enum
enum ProofOfWork {
    None = 0,
    Minimal = 5,
    Moderate = 15,
    Hard = 19,
    Heavy = 24,
    Extreme = 30
}
```

```javascript
link.getPeer(callback, onErrorCallback); //Get's the peer list for the currently connected network
```

```javascript
link.signData(data, callback, onErrorCallback);  //Allows you to sign some data via your Wallet (Sends results as an Argument to Callback Function)
```

```javascript
link.toggleMessageLogging();  //Toggles Console Message Logging 
```

```javascript
link.dappID();  //Returns DappID
```

```javascript
link.sendLinkRequest(request, callback);  //Used internally and sends wallet instructions through socket, you probably won't use it unless you know what your doing
```

```javascript
link.createSocket();  //Used internally to connect to wallet, you probably won't use it unless you know what your doing
link.retry();         //Used internally to retry socket connection, you probably won't use it unless you know what your doing
```

```javascript
link.disconnect(message); //Disconnects From Socket (You can add a reason with the Message Argument)
```


### Example Code
Here is some example code to initate a wallet connection.
```javascript
let link = new PhantasmaLink("Dapp"); //"Dapp" is just whatever name you want to give your application 

//Use this code snippet to connect to a phantasma wallet 
link.login(function (success) {
            //Console Logging for Debugging Purposes
            if (success) {
                console.log('Connected to account ' + this.account.address + ' via ' + this.wallet);
            } else {
                console.log('Connection Failed');
            };
        }, (data) => {console.log(data)}, 'ecto'); //Swap out ecto for 'poltergeist' if wanting to connect to Poltergeist Wallet
```


## EasyConnect
EasyConnect is a plug and play wrapper for PhantasmaLink that makes creating a DApp simple and easy.

Since EasyConnect is a Class we are going to initiate a new EasyConnect object.
```javascript
//Optional Arguments [ requiredVersion: number, platform: string, providerHint: string]
let link = new EasyConnect(); //Has Optional Arguments input as Array
```

### Core Functions

```javascript
link.connect(onSuccess, onFail); //Has two optional callback functions, one for Success and one for Failure
```

```javascript
link.disconnect(_message: string); //Allows you to disconnect from the wallet with a desired message
```

```javascript
link.signTransaction(script: string, payload: string, onSuccess, onFail); //Used to send a transaction to Wallet
```

```javascript
link.signData(data:any, onSuccess, onFail); //Allows you to sign data with a wallet keypair
```

```javascript
link.setConfig(_provider: string); //Allows you to set wallet provider, 'auto', 'ecto', 'poltergeist' (Default is already set to 'auto')
```

```javascript
//Allows Async aswell
link.query(_type: string, _arguments: Array<string>, _callback); //Allows you to query connected wallet/account information (arguments and callback are optional)
```

```javascript
//Allows Async aswell
link.action(_type: string, _arguments: Array<string>, _callback); //Allows you to send a specified action quickly
```

```javascript
//Allows Async aswell
link.script.buildScript(_type: string, _arguments: Array<string>, _callback); //Allows you to quickly create a script with only arguments
// Script Types
// 'interact', [contractName, methodName, [arguments]]
// 'invoke', [contractName, methodName, [arguments]]
// 'interop', [interopName, [arguments]]
```

```javascript
link.invokeScript(script: string, _callback); //Allows you to query data from smart contracts on Phantasma (Non Transactional)
```

```javascript
link.deployContract(script: string, payload:string, proofOfWork, onSuccess, onFail) //Allows you to deploy a contract script

//Proof of Work Enum
export enum ProofOfWork {
    None = 0,
    Minimal = 5,
    Moderate = 15,
    Hard = 19,
    Heavy = 24,
    Extreme = 30
}
```

### Query Function
The Query function is an async function that also allows you to use callbacks. You can use it is a promise, or in a chain!

```javascript
await link.query('account'); //Retrieves all connected wallet account information
```

```javascript
await link.query('name'); //Retrieves registered name associated with connect wallet
```

```javascript
await link.query('balances'); //Shows complete token balance accociated with connected wallet
```

```javascript
await link.query('walletAddress'); //Shows connected wallet address
```

```javascript
await link.query('avatar'); //Shows connected wallet avatar
```

### Action Function
The Action function is an async function that also allows you to use callbacks. You can use it is a promise, or in a chain!

```javascript
await link.action('sendFT', [fromAddress:string, toAddress:string, tokenSymbol:string, amount:number]); //Send Fungible Token
```

```javascript
await link.action('sendNFT', [fromAddress:string, toAddress:string, tokenSymbol:string, tokenID:number]); //Send Non Fungible Token
```

### Easy Script Create
(WIP)
Allows you to generate scripts quickly.

```javascript
async buildScript(_type: string, _options: Array<any>);
// Script Types
// 'interact', [contractName, methodName, [arguments]]
// 'invoke', [contractName, methodName, [arguments]]
// 'interop', [interopName, [arguments]]
```

