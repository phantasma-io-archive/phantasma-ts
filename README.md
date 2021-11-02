# phantasma-ts

A TypeScript SDK for the Phantasma blockchain.

## Installation

Use the package manager [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install phatasma-ts.

```bash
npm install https://github.com/phantasma-io/phantasma-ts.git
```

---

## Importing

```javascript
import { hostConfiguration, phantasmaSDK, backBone } from 'phantasma-ts';

--- OR ----

const { hostConfiguration, phatnasmaSDK, backBone } = require('phantasma-ts');
```

---
## Usage

To use the Phantasma TypeScript SDK, create a new instance of phantasmaSDK.
```javascript
const phantasma = new phantasmaSDK();
```
If you want to customize the config for the phantasmaSDK, create a new 'hostConfiguration' object and pass it through as an argument. 
```javascript 
//Create a new Host Config
let hostConfig = new hostConfiguration('mainnet', 'main', 'https://seed.ghostdevs.com:7077/rpc', 'https://ghostdevs.com/getpeers.json');

//Initiate phantasmaSDK
const phantasma = new phantasmaSDK(hostConfig);
```
### Host Configuration Options
Here you can see some of the options that you can use when constructing the hostConfig. Please check the Vocabulary section if you don't know what a word means (Example: 'nexus', or 'chain').
```javascript
class hostConfiguration {
    
    nexus: string     // 'mainnet', 'simnet', 'testnet'
    chain: string     // 'main' or any other future chains
    rpc: string       // URL for RPC Node
    peerList: string  // URL for List of Peers in JSON Format

}
```

---
## PhantasmaJS
The Phantasma TypeScript SDK relies heavily on PhantasmaJS as a backbone for the framework. If you want to access PhantasmaJS directly, you can do that by using the 'backBone' namespace.

### Using RPC 
```javascript
let RPC = new backBone.PhantasmaAPI('seed.ghostdevs.com:7077/rpc', 'https://ghostdevs.com/getpeers.json', 'mainnet');
```
#### Utillities
- ``` RPC.JSONRPC(method: string, params: Array<any>); ``` <- Used to make any Phantasma RPC call
- ``` RPC.updateRpc()```
- ``` RPC.setRpcHost(rpcHost: string)```
- ``` RPC.setRpcByName(rpcName: string)```
- ``` RPC.setNexus(nexus: string)```
- ``` RPC.convertDecimals(amount: number, decimals: number)```
#### All RPC Functions
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
