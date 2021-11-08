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

---
## PhantasmaJS
The Phantasma TypeScript SDK transpiles into phantasmaJS. Use phantasmaJS to interact with the Phantasma blockchain directly.

### Utility Functions
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

### Building a Script with Script Builder

Building a script is the most important part of interacting with the Phantasma blockchain. Without a propper script, the Phantasma blockchain will not know what you are trying to do. 

These functions, ```.callContract``` and ```.callInterop```, are your bread and butter for creating new scripts.

``` .callContract(contractName: string, methodName: string, [arguments]: array)```

``` .callInterop(functionName: string, [arguments]: array)```


- You can find out all the diffrent ```.callInterop``` functions below.

- For ```.callContract```, you will have to look through the ABI's of all the diffrent smart contracts currently deployed on the Phantasma 'mainnet': [Link Here]('https://explorer.phantasma.io/chain/main#tab_contracts')

#### Example:
```javascript
//Creating a new Script Builder Object
let sb = new phantasmaJS.ScriptBuilder();

//Here is an example of a Transactional Script
    sb
    .callContract('gas', 'AllowGas', ['fromAddress', sb.nullAddress, '100000', '900'])
    .callInterop("Runtime.TransferTokens", ['fromAddress', 'toAddress', 'KCAL', 10000000000]) //10000000000 = 1 KCAL
    .callContract('gas', 'SpendGas', ['fromAddress'])
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
sb.callInterop("Runtime.MintTokens", [from: string, target: string, tokenSymbol: string , amount: number]);
```

```javascript     
sb.callInterop("Runtime.TransferTokens", [from: string, to: string, tokenSymbol: string, amount: number]);
```
    
```javascript
sb.callInterop("Runtime.TransferBalance", [from: string, to: string, tokenSymbol: string]);
```

```javascript
sb.callInterop("Runtime.TransferToken", [from: string, to: string, tokenSymbol: string, tokenId: number]);
```

```javascript
sb.callInterop("Runtime.SendTokens", [destinationChain: string, from: string, to: string, tokenSymbol: string, amount: number);
```

```javascript
sb.callInterop("Runtime.SendToken", [destinationChain: string, from: string, to: string, tokenSymbol: string, tokenId: number]);
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

        //Creating RPC Connection
        let RPC = new phantasmaJS.PhantasmaAPI('https://seed.ghostdevs.com:7077/rpc', 'https://ghostdevs.com/getpeers.json', 'mainnet');

        //Making a Script
        sb
            .callContract('gas', 'AllowGas', [fromAddress, sb.nullAddress, '100000', '900'])
            .callInterop("Runtime.TransferTokens", [fromAddress, toAddress, 'KCAL', 10000000000]) //10000000000 = 1 KCAL
            .callContract('gas', 'SpendGas', [fromAddress])
            .endScript();

        //Gives us a string version of the Script
        let script = sb.str;

        //Used to set expiration date
        let expiration = 5; //This is in miniutes
        let getTime = new Date();
        let date = new Date(getTime.getTime() + expiration * 60000);

        let payload = '7068616e7461736d612d7473' //Says 'Phantasma-ts' in hex

        //Creating New Transaction Object
        let transaction = new phantasmaJS.Transaction(
            'mainnet', //Nexus Name
            'main',    //Chain
            script,    //In string format
            date,      //Expiration Date
            payload);  //Extra Info to attach to Transaction in Serialized Hex

        //Sign's Transaction with Private Key
        await transaction.sign(privateKey);

        //Send Transaction
        let txHash = await RPC.sendRawTransaction(transaction.toString(true));

        //Return Transaction Hash
        return txHash;
    }

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