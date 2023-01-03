"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getString = exports.getMarketEventData = exports.getInfusionEventData = exports.getGasEventData = exports.getTransactionSettleEventData = exports.getChainValueEventData = exports.getTokenEventData = exports.decodeVMObject = exports.TypeAuction = exports.EventKind = void 0;
var Decoder_1 = require("./Decoder");
var EventKind;
(function (EventKind) {
    EventKind[EventKind["Unknown"] = 0] = "Unknown";
    EventKind[EventKind["ChainCreate"] = 1] = "ChainCreate";
    EventKind[EventKind["TokenCreate"] = 2] = "TokenCreate";
    EventKind[EventKind["TokenSend"] = 3] = "TokenSend";
    EventKind[EventKind["TokenReceive"] = 4] = "TokenReceive";
    EventKind[EventKind["TokenMint"] = 5] = "TokenMint";
    EventKind[EventKind["TokenBurn"] = 6] = "TokenBurn";
    EventKind[EventKind["TokenStake"] = 7] = "TokenStake";
    EventKind[EventKind["TokenClaim"] = 8] = "TokenClaim";
    EventKind[EventKind["AddressRegister"] = 9] = "AddressRegister";
    EventKind[EventKind["AddressLink"] = 10] = "AddressLink";
    EventKind[EventKind["AddressUnlink"] = 11] = "AddressUnlink";
    EventKind[EventKind["OrganizationCreate"] = 12] = "OrganizationCreate";
    EventKind[EventKind["OrganizationAdd"] = 13] = "OrganizationAdd";
    EventKind[EventKind["OrganizationRemove"] = 14] = "OrganizationRemove";
    EventKind[EventKind["GasEscrow"] = 15] = "GasEscrow";
    EventKind[EventKind["GasPayment"] = 16] = "GasPayment";
    EventKind[EventKind["AddressUnregister"] = 17] = "AddressUnregister";
    EventKind[EventKind["OrderCreated"] = 18] = "OrderCreated";
    EventKind[EventKind["OrderCancelled"] = 19] = "OrderCancelled";
    EventKind[EventKind["OrderFilled"] = 20] = "OrderFilled";
    EventKind[EventKind["OrderClosed"] = 21] = "OrderClosed";
    EventKind[EventKind["FeedCreate"] = 22] = "FeedCreate";
    EventKind[EventKind["FeedUpdate"] = 23] = "FeedUpdate";
    EventKind[EventKind["FileCreate"] = 24] = "FileCreate";
    EventKind[EventKind["FileDelete"] = 25] = "FileDelete";
    EventKind[EventKind["ValidatorPropose"] = 26] = "ValidatorPropose";
    EventKind[EventKind["ValidatorElect"] = 27] = "ValidatorElect";
    EventKind[EventKind["ValidatorRemove"] = 28] = "ValidatorRemove";
    EventKind[EventKind["ValidatorSwitch"] = 29] = "ValidatorSwitch";
    EventKind[EventKind["PackedNFT"] = 30] = "PackedNFT";
    EventKind[EventKind["ValueCreate"] = 31] = "ValueCreate";
    EventKind[EventKind["ValueUpdate"] = 32] = "ValueUpdate";
    EventKind[EventKind["PollCreated"] = 33] = "PollCreated";
    EventKind[EventKind["PollClosed"] = 34] = "PollClosed";
    EventKind[EventKind["PollVote"] = 35] = "PollVote";
    EventKind[EventKind["ChannelCreate"] = 36] = "ChannelCreate";
    EventKind[EventKind["ChannelRefill"] = 37] = "ChannelRefill";
    EventKind[EventKind["ChannelSettle"] = 38] = "ChannelSettle";
    EventKind[EventKind["LeaderboardCreate"] = 39] = "LeaderboardCreate";
    EventKind[EventKind["LeaderboardInsert"] = 40] = "LeaderboardInsert";
    EventKind[EventKind["LeaderboardReset"] = 41] = "LeaderboardReset";
    EventKind[EventKind["PlatformCreate"] = 42] = "PlatformCreate";
    EventKind[EventKind["ChainSwap"] = 43] = "ChainSwap";
    EventKind[EventKind["ContractRegister"] = 44] = "ContractRegister";
    EventKind[EventKind["ContractDeploy"] = 45] = "ContractDeploy";
    EventKind[EventKind["AddressMigration"] = 46] = "AddressMigration";
    EventKind[EventKind["ContractUpgrade"] = 47] = "ContractUpgrade";
    EventKind[EventKind["Log"] = 48] = "Log";
    EventKind[EventKind["Inflation"] = 49] = "Inflation";
    EventKind[EventKind["OrderBid"] = 59] = "OrderBid";
    EventKind[EventKind["MasterClaim"] = 61] = "MasterClaim";
    EventKind[EventKind["Custom"] = 64] = "Custom";
})(EventKind = exports.EventKind || (exports.EventKind = {}));
var TypeAuction;
(function (TypeAuction) {
    TypeAuction[TypeAuction["Fixed"] = 0] = "Fixed";
    TypeAuction[TypeAuction["Classic"] = 1] = "Classic";
    TypeAuction[TypeAuction["Reserve"] = 2] = "Reserve";
    TypeAuction[TypeAuction["Dutch"] = 3] = "Dutch";
})(TypeAuction = exports.TypeAuction || (exports.TypeAuction = {}));
function decodeVMObject(str) {
    var dec = new Decoder_1.Decoder(str);
    return dec.readVmObject();
}
exports.decodeVMObject = decodeVMObject;
function getTokenEventData(str) {
    var dec = new Decoder_1.Decoder(str);
    return {
        symbol: dec.readString(),
        value: dec.readBigIntAccurate(),
        chainName: dec.readString(),
    };
}
exports.getTokenEventData = getTokenEventData;
function getChainValueEventData(str) {
    var dec = new Decoder_1.Decoder(str);
    return {
        name: dec.readString,
        value: dec.readBigInt(),
    };
}
exports.getChainValueEventData = getChainValueEventData;
function getTransactionSettleEventData(str) {
    var dec = new Decoder_1.Decoder(str);
    return {
        hash: dec.read(dec.readByte()),
        platform: dec.readString(),
        chain: dec.readString(),
    };
    // public readonly Hash Hash;
}
exports.getTransactionSettleEventData = getTransactionSettleEventData;
function getGasEventData(str) {
    var dec = new Decoder_1.Decoder(str);
    return {
        address: dec.read(dec.readByte()),
        price: dec.readBigInt(),
        amount: dec.readBigInt(),
        endAmount: dec.isEnd() ? 0 : dec.readBigInt()
    };
}
exports.getGasEventData = getGasEventData;
function getInfusionEventData(str) {
    var dec = new Decoder_1.Decoder(str);
    return {
        baseSymbol: dec.readString(),
        TokenID: dec.readBigIntAccurate(),
        InfusedSymbol: dec.readString(),
        InfusedValue: dec.readBigIntAccurate(),
        ChainName: dec.readString(),
    };
}
exports.getInfusionEventData = getInfusionEventData;
function getMarketEventData(str) {
    var dec = new Decoder_1.Decoder(str);
    return {
        baseSymbol: dec.readString(),
        quoteSymbol: dec.readString(),
        id: dec.readBigIntAccurate(),
        amount: dec.readBigInt(),
    };
}
exports.getMarketEventData = getMarketEventData;
function getString(str) {
    return new Decoder_1.Decoder(str).readString();
}
exports.getString = getString;
