import { TokenSeriesMode } from "../interfaces";
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
    name: string;
    protocol: string;
    platforms: Array<Platform>;
    tokens: Array<Token>;
    chains: Array<Chain>;
    governance: Array<Governance>;
    organizations: Array<string>;
}
export interface Stake {
    amount: string;
    time: number;
    unclaimed: string;
}
export interface Storage {
    available: number;
    used: number;
    avatar: string;
    archives: Array<Archive>;
}
export interface Account {
    address: string;
    name: string;
    stakes: Stake;
    stake: string;
    unclaimed: string;
    relay: string;
    validator: string;
    storage: Storage;
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
    parent: string;
    height: number;
    organization: string;
    contracts: Array<string>;
    dapps: Array<string>;
}
export interface Event {
    address: string;
    contract: string;
    kind: string;
    data: string;
}
export interface Oracle {
    url: string;
    content: string;
}
export interface SignatureResult {
    Kind: string;
    Data: string;
}
export interface TransactionData {
    hash: string;
    chainAddress: string;
    timestamp: number;
    blockHeight: number;
    blockHash: string;
    script: string;
    payload: string;
    events: Array<Event>;
    result: string;
    fee: string;
    state: string;
    signatures: Array<SignatureResult>;
    sender: string;
    gasPayer: string;
    gasTarget: string;
    gasPrice: string;
    gasLimit: string;
    expiration: number;
}
export interface AccountTransactions {
    address: string;
    txs: Array<TransactionData>;
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
    previousHash: string;
    timestamp: number;
    height: number;
    chainAddress: string;
    protocol: number;
    txs: Array<TransactionData>;
    validatorAddress: string;
    reward: string;
    events: Array<Event>;
    oracles: Array<Oracle>;
}
export interface TokenExternal {
    platform: string;
    hash: string;
}
export interface TokenPrice {
    Timestamp: number;
    Open: string;
    High: string;
    Low: string;
    Close: string;
}
export interface Token {
    symbol: string;
    name: string;
    decimals: number;
    currentSupply: string;
    maxSupply: string;
    burnedSupply: string;
    address: string;
    owner: string;
    flags: string;
    script: string;
    series: Array<TokenSeries>;
    external?: Array<TokenExternal>;
    price?: Array<TokenPrice>;
}
export interface TokenSeries {
    seriesID: number;
    currentSupply: string;
    maxSupply: string;
    burnedSupply: string;
    mode: TokenSeriesMode;
    script: string;
    methods: Array<ABIMethod>;
}
export interface TokenData {
    ID: string;
    series: string;
    mint: string;
    chainName: string;
    ownerAddress: string;
    creatorAddress: string;
    ram: string;
    rom: string;
    status: string;
    forSale: boolean;
}
export interface SendRawTx {
    hash: string;
    error: string;
}
export interface Auction {
    creatorAddress: string;
    chainAddress: string;
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
    events: Array<Event>;
    result: string;
    results: Array<string>;
    oracles: Array<Oracle>;
}
export interface Archive {
    name: string;
    hash: string;
    time: number;
    size: number;
    encryption: string;
    blockCount: number;
    missingBlocks: Array<number>;
    owners: Array<string>;
}
export interface ABIParameter {
    name: string;
    type: string;
}
export interface ABIMethod {
    name: string;
    returnType: string;
    parameters: Array<ABIParameter>;
}
export interface ABIContract {
    name: string;
    methods: Array<ABIMethod>;
}
export interface Channel {
    creatorAddress: string;
    targetAddress: string;
    name: string;
    chain: string;
    creationTime: number;
    symbol: string;
    fee: string;
    balance: string;
    active: boolean;
    index: number;
}
export interface Receipt {
    nexus: string;
    channel: string;
    index: string;
    timestamp: number;
    sender: string;
    receiver: string;
    script: string;
}
export interface Peer {
    url: string;
    version: string;
    flags: string;
    fee: string;
    pow: number;
}
export interface Validator {
    address: string;
    type: string;
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
export declare class PhantasmaAPI {
    host: string;
    rpcName: string;
    nexus: string;
    availableHosts: any[];
    pingAsync(host: string): Promise<number>;
    constructor(defHost: string, peersUrlJson: string, nexus: string);
    JSONRPC(method: string, params: Array<any>): Promise<any>;
    setRpcHost(rpcHost: string): void;
    setRpcByName(rpcName: string): void;
    setNexus(nexus: string): void;
    updateRpc(): void;
    convertDecimals(amount: number, decimals: number): number;
    getAccount(account: string): Promise<Account>;
    lookUpName(name: string): Promise<string>;
    getBlockHeight(chainInput: string): Promise<number>;
    getBlockTransactionCountByHash(blockHash: string): Promise<number>;
    getBlockByHash(blockHash: string): Promise<Block>;
    getRawBlockByHash(blockHash: string): Promise<string>;
    getBlockByHeight(chainInput: string, height: number): Promise<Block>;
    getRawBlockByHeight(chainInput: string, height: number): Promise<string>;
    getTransactionByBlockHashAndIndex(blockHash: string, index: number): Promise<TransactionData>;
    getAddressTransactions(account: string, page: number, pageSize: number): Promise<Paginated<AccountTransactions>>;
    getAddressTransactionCount(account: string, chainInput: string): Promise<number>;
    sendRawTransaction(txData: string): Promise<string>;
    invokeRawScript(chainInput: string, scriptData: string): Promise<Script>;
    getTransaction(hashText: string): Promise<TransactionData>;
    cancelTransaction(hashText: string): Promise<string>;
    getChains(): Promise<Chain>;
    getNexus(): Promise<Nexus>;
    getOrganization(ID: string): Promise<Organization>;
    getOrganizationByName(name: string): Promise<Organization>;
    getOrganizations(extended?: boolean): Promise<Organization[]>;
    getLeaderboard(name: string): Promise<Leaderboard>;
    getTokens(): Promise<Token[]>;
    getToken(symbol: string): Promise<Token>;
    getTokenData(symbol: string, IDtext: string): Promise<TokenData>;
    getTokenBalance(account: string, tokenSymbol: string, chainInput: string): Promise<Balance>;
    getAuctionsCount(chainAddressOrName: string, symbol: string): Promise<number>;
    getAuctions(chainAddressOrName: string, symbol: string, page: number, pageSize: number): Promise<Auction>;
    getAuction(chainAddressOrName: string, symbol: string, IDtext: string): Promise<Auction>;
    getArchive(hashText: string): Promise<Archive>;
    writeArchive(hashText: string, blockIndex: number, blockContent: string): Promise<boolean>;
    getABI(chainAddressOrName: string, contractName: string): Promise<ABIContract>;
    getPeers(): Promise<Peer>;
    relaySend(receiptHex: string): Promise<boolean>;
    relayReceive(account: string): Promise<Receipt>;
    getEvents(account: string): Promise<Event>;
    getPlatforms(): Promise<Platform[]>;
    getValidators(): Promise<Validator>;
    settleSwap(sourcePlatform: string, destPlatform: string, hashText: string): Promise<string>;
    getSwapsForAddressOld(account: string): Promise<Swap[]>;
    getSwapsForAddress(account: string, platform: string): Promise<Swap[]>;
    getNFT(symbol: string, nftId: string): Promise<NFT>;
}
//# sourceMappingURL=phantasma.d.ts.map