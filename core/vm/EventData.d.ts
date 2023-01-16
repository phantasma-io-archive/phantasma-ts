export declare enum EventKind {
    Unknown = 0,
    ChainCreate = 1,
    TokenCreate = 2,
    TokenSend = 3,
    TokenReceive = 4,
    TokenMint = 5,
    TokenBurn = 6,
    TokenStake = 7,
    TokenClaim = 8,
    AddressRegister = 9,
    AddressLink = 10,
    AddressUnlink = 11,
    OrganizationCreate = 12,
    OrganizationAdd = 13,
    OrganizationRemove = 14,
    GasEscrow = 15,
    GasPayment = 16,
    AddressUnregister = 17,
    OrderCreated = 18,
    OrderCancelled = 19,
    OrderFilled = 20,
    OrderClosed = 21,
    FeedCreate = 22,
    FeedUpdate = 23,
    FileCreate = 24,
    FileDelete = 25,
    ValidatorPropose = 26,
    ValidatorElect = 27,
    ValidatorRemove = 28,
    ValidatorSwitch = 29,
    PackedNFT = 30,
    ValueCreate = 31,
    ValueUpdate = 32,
    PollCreated = 33,
    PollClosed = 34,
    PollVote = 35,
    ChannelCreate = 36,
    ChannelRefill = 37,
    ChannelSettle = 38,
    LeaderboardCreate = 39,
    LeaderboardInsert = 40,
    LeaderboardReset = 41,
    PlatformCreate = 42,
    ChainSwap = 43,
    ContractRegister = 44,
    ContractDeploy = 45,
    AddressMigration = 46,
    ContractUpgrade = 47,
    Log = 48,
    Inflation = 49,
    OrderBid = 59,
    MasterClaim = 61,
    Custom = 64
}
export declare enum TypeAuction {
    Fixed = 0,
    Classic = 1,
    Reserve = 2,
    Dutch = 3
}
export declare function decodeVMObject(str: string): any;
export declare function getTokenEventData(str: string): {
    symbol: string;
    value: string;
    chainName: string;
};
export declare function getChainValueEventData(str: string): {
    name: () => string;
    value: number;
};
export declare function getTransactionSettleEventData(str: string): {
    hash: string;
    platform: string;
    chain: string;
};
export declare function getGasEventData(str: string): {
    address: string;
    price: number;
    amount: number;
    endAmount: number;
};
export declare function getInfusionEventData(str: string): {
    baseSymbol: string;
    TokenID: string;
    InfusedSymbol: string;
    InfusedValue: string;
    ChainName: string;
};
export declare function getMarketEventData(str: string): {
    baseSymbol: string;
    quoteSymbol: string;
    id: string;
    amount: number;
};
export declare function getString(str: string): string;
//# sourceMappingURL=EventData.d.ts.map