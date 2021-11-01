/* eslint-disable */

const fetch = require("cross-fetch");

export interface Balance {
  chain: string;
  amount: string;
  symbol: string;
  decimals: number;
  ids?: Array<string>;
}

export interface Interop {
  local: string;
  external: string;
}

export interface Platform {
  platform: string;
  chain: string;
  fuel: string;
  tokens: Array<string>;
  interop: Array<Interop>;
}

export interface Governance {
  name: string;
  value: string;
}

export interface Organization {
  id: string;
  name: string;
  members: Array<string>;
}

export interface Nexus {
  name: string; //Name of the nexus
  platforms: Array<Platform>; //List of platforms
  tokens: Array<Token>; //List of tokens
  chains: Array<Chain>; //List of chains
  governance: Array<Governance>; //List of governance values
  organizations: Array<string>; //List of organizations
}

export interface Stake {
  amount: string; //Amount of staked SOUL
  time: number; //Time of last stake
  unclaimed: string; //Amount of claimable KCAL
}

export interface Account {
  address: string;
  name: string;
  stakes: Stake; //Info about staking if available
  stake: string;
  unclaimed: string;
  relay: string; //Amount of available KCAL for relay channel
  validator: string; //Validator role
  balances: Array<Balance>;
  txs: Array<string>;
}

export interface LeaderboardRow {
  address: string;
  value: string;
}

export interface Leaderboard {
  name: string;
  rows: Array<LeaderboardRow>;
}

export interface Dapp {
  name: string;
  address: string;
  chain: string;
}

export interface Chain {
  name: string;
  address: string;
  parent: string; //Name of parent chain
  height: number; //Current chain height
  organization: string; //Chain organization
  contracts: Array<string>; //Contracts deployed in the chain
  dapps: Array<string>; //Dapps deployed in the chain
}

export interface Event {
  address: string;
  contract: string;
  kind: string;
  data: string; //Data in hexadecimal format, content depends on the event kind
}

export interface Oracle {
  url: string; //URL that was read by the oracle
  content: string; //Byte array content read by the oracle, encoded as hex string
}

export interface TransactionData {
  hash: string; //Hash of the transaction
  chainAddress: string; //Transaction chain address
  timestamp: number; //Block time
  blockHeight: number; //Block height at which the transaction was accepted
  blockHash: string; //Hash of the block
  script: string; //Script content of the transaction, in hexadecimal format
  payload: string; //Payload content of the transaction, in hexadecimal format
  events: Array<Event>; //List of events that triggered in the transaction
  result: string; //Result of the transaction, if any. Serialized, in hexadecimal format
  fee: string; //Fee of the transaction, in KCAL, fixed point
}

export interface AccountTransactions {
  address: string;
  txs: Array<TransactionData>; //List of transactions
}

export interface Paginated<T> {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  result: T;
}

export interface Block {
  hash: string;
  previousHash: string; //Hash of previous block
  timestamp: number;
  height: number;
  chainAddress: string; //Address of chain where the block belongs
  protocol: number; //Network protocol version
  txs: Array<TransactionData>; //List of transactions in block
  validatorAddress: string; //Address of validator who minted the block
  reward: string; //Amount of KCAL rewarded by this fees in this block
  events: Array<Event>; //Block events
  oracles: Array<Oracle>; //Block oracles
}

export interface Token {
  symbol: string; //Ticker symbol for the token
  name: string;
  decimals: number; //Amount of decimals when converting from fixed point format to decimal format
  currentSupply: string; //Amount of minted tokens
  maxSupply: string; //Max amount of tokens that can be minted
  platform: string; //Platform of token
  external?: { hash: string; platform: string }[];
  hash: string; //Hash of token
  flags: string;
}

export interface TokenData {
  ID: string; //ID of token
  chainName: string; //Chain where currently is stored
  ownerAddress: string; //Address who currently owns the token
  ram: string; //Writable data of token, hex encoded
  rom: string; //Read-only data of token, hex encoded
  forSale: boolean; //True if is being sold in market
}

export interface SendRawTx {
  hash: string; //Transaction hash
  error: string; //Error message if transaction did not succeed
}

export interface Auction {
  creatorAddress: string; //Address of auction creator
  chainAddress: string; //Address of auction chain
  startDate: number;
  endDate: number;
  baseSymbol: string;
  quoteSymbol: string;
  tokenId: string;
  price: string;
  rom: string;
  ram: string;
}

export interface Script {
  events: Array<Event>; //List of events that triggered in the transaction
  result: string;
  results: Array<string>; //Results of the transaction, if any. Serialized, in hexadecimal format
  oracles: Array<Oracle>; //List of oracle reads that were triggered in the transaction
}

export interface Archive {
  hash: string; //Archive hash
  size: number; //Size of archive in bytes
  flags: string; //Archive flags
  key: string; //Encryption key
  blockCount: number; //Number of blocks
  metadata: Array<string>; //Metadata
}

export interface ABIParameter {
  name: string; //Name of method
  type: string;
}

export interface ABIMethod {
  name: string; //Name of method
  returnType: string;
  parameters: Array<ABIParameter>; //Type of parameters
}

export interface ABIContract {
  name: string; //Name of contract
  methods: Array<ABIMethod>; //List of methods
}

export interface Channel {
  creatorAddress: string; //Creator of channel
  targetAddress: string; //Target of channel
  name: string; //Name of channel
  chain: string; //Chain of channel
  creationTime: number; //Creation time
  symbol: string; //Token symbol
  fee: string; //Fee of messages
  balance: string; //Estimated balance
  active: boolean; //Channel status
  index: number; //Message index
}

export interface Receipt {
  nexus: string; //Name of nexus
  channel: string; //Name of channel
  index: string; //Index of message
  timestamp: number; //Date of message
  sender: string; //Sender address
  receiver: string; //Receiver address
  script: string; //Script of message, in hex
}

export interface Peer {
  url: string; //URL of peer
  version: string; //Software version of peer
  flags: string; //Features supported by peer
  fee: string; //Minimum fee required by node
  pow: number; //Minimum proof of work required by node
}

export interface Validator {
  address: string; //Address of validator
  type: string; //Either primary or secondary
}

export interface Swap {
  sourcePlatform: string;
  sourceChain: string;
  sourceHash: string;
  sourceAddress: string;
  destinationPlatform: string;
  destinationChain: string;
  destinationHash: string;
  destinationAddress: string;
  symbol: string;
  value: string;
}

export interface KeyValue {
  Key: string;
  Value: string;
}

export interface NFT {
  ID: string;
  series: string;
  mint: string;
  chainName: string;
  ownerAddress: string;
  creatorAddress: string;
  ram: string;
  rom: string;
  infusion: KeyValue[];
  properties: KeyValue[];
}

export class PhantasmaAPI {
  host: string;
  rpcName: string;
  nexus: string;
  availableHosts: any[];

  pingAsync(host: string): Promise<number> {
    return new Promise((resolve, reject) => {
      var started = new Date().getTime();
      var http = new XMLHttpRequest();

      http.open("GET", host + "/rpc", true);
      http.timeout = 4500;
      http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          var ended = new Date().getTime();
          var milliseconds = ended - started;
          resolve(milliseconds);
        }

        http.ontimeout = function () {
          resolve(100000);
        };
        http.onerror = function () {
          resolve(100000);
        };
      };
      try {
        http.send(null);
      } catch (exception) {
        // this is expected
        reject();
      }
    });
  }

  constructor(defHost: string, peersUrlJson: string) {
    this.rpcName = "Auto";
    this.nexus = "mainnet";
    this.host = defHost;
    this.availableHosts = [];

    fetch(peersUrlJson + "?_=" + new Date().getTime()).then(async (res) => {
      const data = await res.json();
      for (var i = 0; i < data.length; i++) {
        //console.log("Checking RPC: ", data[i]);
        try {
          const msecs = await this.pingAsync(data[i].url);
          data[i].info = data[i].location + " • " + msecs + " ms";
          data[i].msecs = msecs;
          //console.log(data[i].location + " • " + msecs + " ms • " + data[i].url + "/rpc");
          this.availableHosts.push(data[i]);
        } catch (err) {
          //console.log("Error with RPC: " + data[i]);
        }
      }
      this.availableHosts.sort((a, b) => a.msecs - b.msecs);
      this.updateRpc();
    });
  }

  async JSONRPC(method: string, params: Array<any>): Promise<any> {
    let res = await fetch(this.host, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: method,
        params: params,
        id: "1",
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    let resJson = await res.json();
    //console.log("method", method, resJson);
    if (resJson.error) {
      if (resJson.error.message) return { error: resJson.error.message };
      return { error: resJson.error };
    }
    return await resJson.result;
  }

  setRpcHost(rpcHost: string) {
    this.host = rpcHost;
  }

  setRpcByName(rpcName: string) {
    this.rpcName = rpcName;
    if (this.nexus === "mainnet") this.updateRpc();
  }

  setNexus(nexus: string) {
    this.nexus = nexus.toLowerCase();
  }

  updateRpc() {
    if (this.nexus === "mainnet" && this.availableHosts.length > 0) {
      console.log("%cUpdate RPC with name " + this.rpcName, "font-size: 20px");
      if (this.rpcName == "Auto") {
        this.host = this.availableHosts[0].url + "/rpc";
      } else {
        const rpc = this.availableHosts.find((h) => h.location == this.rpcName);
        if (rpc) this.host = rpc.url + "/rpc";
        else this.host = this.availableHosts[0].url + "/rpc";
      }
      console.log("%cSet RPC api to " + this.host, "font-size: 20px");
    }
  }

  convertDecimals(amount: number, decimals: number): number {
    let mult = Math.pow(10, decimals);
    return amount / mult;
  }

  //Returns the account name and balance of given address.
  async getAccount(account: string): Promise<Account> {
    let params: Array<any> = [account];
    return (await this.JSONRPC("getAccount", params)) as Account;
  }

  //Returns the address that owns a given name.
  async lookUpName(name: string): Promise<string> {
    let params: Array<any> = [name];
    return (await this.JSONRPC("lookUpName", params)) as string;
  }

  //Returns the height of a chain.
  async getBlockHeight(chainInput: string): Promise<number> {
    let params: Array<any> = [chainInput];
    return (await this.JSONRPC("getBlockHeight", params)) as number;
  }

  //Returns the number of transactions of given block hash or error if given hash is invalid or is not found.
  async getBlockTransactionCountByHash(blockHash: string): Promise<number> {
    let params: Array<any> = [blockHash];
    return (await this.JSONRPC(
      "getBlockTransactionCountByHash",
      params
    )) as number;
  }

  //Returns information about a block by hash.
  async getBlockByHash(blockHash: string): Promise<Block> {
    let params: Array<any> = [blockHash];
    return (await this.JSONRPC("getBlockByHash", params)) as Block;
  }

  //Returns a serialized string, containing information about a block by hash.
  async getRawBlockByHash(blockHash: string): Promise<string> {
    let params: Array<any> = [blockHash];
    return (await this.JSONRPC("getRawBlockByHash", params)) as string;
  }

  //Returns information about a block by height and chain.
  async getBlockByHeight(chainInput: string, height: number): Promise<Block> {
    let params: Array<any> = [chainInput, height];
    return (await this.JSONRPC("getBlockByHeight", params)) as Block;
  }

  //Returns a serialized string, in hex format, containing information about a block by height and chain.
  async getRawBlockByHeight(
    chainInput: string,
    height: number
  ): Promise<string> {
    let params: Array<any> = [chainInput, height];
    return (await this.JSONRPC("getRawBlockByHeight", params)) as string;
  }

  //Returns the information about a transaction requested by a block hash and transaction index.
  async getTransactionByBlockHashAndIndex(
    blockHash: string,
    index: number
  ): Promise<TransactionData> {
    let params: Array<any> = [blockHash, index];
    return (await this.JSONRPC(
      "getTransactionByBlockHashAndIndex",
      params
    )) as TransactionData;
  }

  //Returns last X transactions of given address.
  async getAddressTransactions(
    account: string,
    page: number,
    pageSize: number
  ): Promise<Paginated<AccountTransactions>> {
    let params: Array<any> = [account, page, pageSize];
    return (await this.JSONRPC("getAddressTransactions", params)) as Paginated<
      AccountTransactions
    >;
  }

  //Get number of transactions in a specific address and chain
  async getAddressTransactionCount(
    account: string,
    chainInput: string
  ): Promise<number> {
    let params: Array<any> = [account, chainInput];
    return (await this.JSONRPC("getAddressTransactionCount", params)) as number;
  }

  //Allows to broadcast a signed operation on the network, but it&apos;s required to build it manually.
  async sendRawTransaction(txData: string): Promise<string> {
    let params: Array<any> = [txData];
    return (await this.JSONRPC("sendRawTransaction", params)) as string;
  }

  //Allows to invoke script based on network state, without state changes.
  async invokeRawScript(
    chainInput: string,
    scriptData: string
  ): Promise<Script> {
    let params: Array<any> = [chainInput, scriptData];
    return (await this.JSONRPC("invokeRawScript", params)) as Script;
  }

  //Returns information about a transaction by hash.
  async getTransaction(hashText: string): Promise<TransactionData> {
    let params: Array<any> = [hashText];
    return (await this.JSONRPC("getTransaction", params)) as TransactionData;
  }

  //Removes a pending transaction from the mempool.
  async cancelTransaction(hashText: string): Promise<string> {
    let params: Array<any> = [hashText];
    return (await this.JSONRPC("cancelTransaction", params)) as string;
  }

  //Returns an array of all chains deployed in Phantasma.
  async getChains(): Promise<Chain> {
    let params: Array<any> = [];
    return (await this.JSONRPC("getChains", params)) as Chain;
  }

  //Returns info about the nexus.
  async getNexus(): Promise<Nexus> {
    let params: Array<any> = [];
    return (await this.JSONRPC("getNexus", params)) as Nexus;
  }

  //Returns info about an organization.
  async getOrganization(ID: string): Promise<Organization> {
    let params: Array<any> = [ID];
    return (await this.JSONRPC("getOrganization", params)) as Organization;
  }

  //Returns content of a Phantasma leaderboard.
  async getLeaderboard(name: string): Promise<Leaderboard> {
    let params: Array<any> = [name];
    return (await this.JSONRPC("getLeaderboard", params)) as Leaderboard;
  }

  //Returns an array of tokens deployed in Phantasma.
  async getTokens(): Promise<Token[]> {
    let params: Array<any> = [];
    return (await this.JSONRPC("getTokens", params)) as Token[];
  }

  //Returns info about a specific token deployed in Phantasma.
  async getToken(symbol: string): Promise<Token> {
    let params: Array<any> = [symbol];
    return (await this.JSONRPC("getToken", params)) as Token;
  }

  //Returns data of a non-fungible token, in hexadecimal format.
  async getTokenData(symbol: string, IDtext: string): Promise<TokenData> {
    let params: Array<any> = [symbol, IDtext];
    return (await this.JSONRPC("getTokenData", params)) as TokenData;
  }

  //Returns the balance for a specific token and chain, given an address.
  async getTokenBalance(
    account: string,
    tokenSymbol: string,
    chainInput: string
  ): Promise<Balance> {
    let params: Array<any> = [account, tokenSymbol, chainInput];
    return (await this.JSONRPC("getTokenBalance", params)) as Balance;
  }

  //Returns the number of active auctions.
  async getAuctionsCount(
    chainAddressOrName: string,
    symbol: string
  ): Promise<number> {
    let params: Array<any> = [chainAddressOrName, symbol];
    return (await this.JSONRPC("getAuctionsCount", params)) as number;
  }

  //Returns the auctions available in the market.
  async getAuctions(
    chainAddressOrName: string,
    symbol: string,
    page: number,
    pageSize: number
  ): Promise<Auction> {
    let params: Array<any> = [chainAddressOrName, symbol, page, pageSize];
    return (await this.JSONRPC("getAuctions", params)) as Auction;
  }

  //Returns the auction for a specific token.
  async getAuction(
    chainAddressOrName: string,
    symbol: string,
    IDtext: string
  ): Promise<Auction> {
    let params: Array<any> = [chainAddressOrName, symbol, IDtext];
    return (await this.JSONRPC("getAuction", params)) as Auction;
  }

  //Returns info about a specific archive.
  async getArchive(hashText: string): Promise<Archive> {
    let params: Array<any> = [hashText];
    return (await this.JSONRPC("getArchive", params)) as Archive;
  }

  //Writes the contents of an incomplete archive.
  async writeArchive(
    hashText: string,
    blockIndex: number,
    blockContent: string
  ): Promise<boolean> {
    let params: Array<any> = [hashText, blockIndex, blockContent];
    return (await this.JSONRPC("writeArchive", params)) as boolean;
  }

  //Returns the ABI interface of specific contract.
  async getABI(
    chainAddressOrName: string,
    contractName: string
  ): Promise<ABIContract> {
    let params: Array<any> = [chainAddressOrName, contractName];
    return (await this.JSONRPC("getABI", params)) as ABIContract;
  }

  //Returns list of known peers.
  async getPeers(): Promise<Peer> {
    let params: Array<any> = [];
    return (await this.JSONRPC("getPeers", params)) as Peer;
  }

  //Writes a message to the relay network.
  async relaySend(receiptHex: string): Promise<boolean> {
    let params: Array<any> = [receiptHex];
    return (await this.JSONRPC("relaySend", params)) as boolean;
  }

  //Receives messages from the relay network.
  async relayReceive(account: string): Promise<Receipt> {
    let params: Array<any> = [account];
    return (await this.JSONRPC("relayReceive", params)) as Receipt;
  }

  //Reads pending messages from the relay network.
  async getEvents(account: string): Promise<Event> {
    let params: Array<any> = [account];
    return (await this.JSONRPC("getEvents", params)) as Event;
  }

  //Returns an array of available interop platforms.
  async getPlatforms(): Promise<Platform[]> {
    let params: Array<any> = [];
    return (await this.JSONRPC("getPlatforms", params)) as Platform[];
  }

  //Returns an array of available validators.
  async getValidators(): Promise<Validator> {
    let params: Array<any> = [];
    return (await this.JSONRPC("getValidators", params)) as Validator;
  }

  //Tries to settle a pending swap for a specific hash.
  async settleSwap(
    sourcePlatform: string,
    destPlatform: string,
    hashText: string
  ): Promise<string> {
    let params: Array<any> = [sourcePlatform, destPlatform, hashText];
    return (await this.JSONRPC("settleSwap", params)) as string;
  }

  //Returns platform swaps for a specific address.
  async getSwapsForAddressOld(account: string): Promise<Swap[]> {
    let params: Array<any> = [account];
    return (await this.JSONRPC("getSwapsForAddress", params)) as Swap[];
  }

  //Returns platform swaps for a specific address.
  async getSwapsForAddress(account: string, platform: string): Promise<Swap[]> {
    let params: Array<any> = [account, platform, false];
    return (await this.JSONRPC("getSwapsForAddress", params)) as Swap[];
  }


  //Returns info of a nft.
  async getNFT(symbol: string, nftId: string): Promise<NFT> {
    let params: Array<any> = [symbol, nftId, true];
    return (await this.JSONRPC("getNFT", params)) as NFT;
  }
}
