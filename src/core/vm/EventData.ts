import bigInt from "big-integer";
import { VMType } from "./VMType";

export enum EventKind {
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
  Custom = 64,
}

export enum TypeAuction {
  Fixed = 0,
  Classic = 1,
  Reserve = 2,
  Dutch = 3,
}

export class Decoder {

  str: string;

  constructor(str: string) {
    this.str = str;
  }

  isEnd() {
    return this.str.length == 0;
  }

  readCharPair() {
    var res = this.str.substr(0, 2);
    this.str = this.str.slice(2);
    return res;
  }

  readByte() {
    return parseInt(this.readCharPair(), 16);
  }

  read(numBytes: number): string {
    var res = this.str.substr(0, numBytes * 2);
    this.str = this.str.slice(numBytes * 2);
    return res;
  }

  readString(): string {
    var len = this.readVarInt();
    return this.readStringBytes(len);
  }

  readStringBytes(numBytes: number) {
    var res = "";
    for (var i = 0; i < numBytes; ++i) {
      res += String.fromCharCode(this.readByte());
    }
    return res;
  }

  readVarInt() {
    var len = this.readByte();
    var res = 0;
    if (len === 0xfd) {
      [...(this.read(2).match(/.{1,2}/g) as any)]
        .reverse()
        .forEach((c) => (res = res * 256 + parseInt(c, 16)));
      return res;
    } else if (len === 0xfe) {
      [...(this.read(4).match(/.{1,2}/g) as any)]
        .reverse()
        .forEach((c) => (res = res * 256 + parseInt(c, 16)));
      return res;
    } else if (len === 0xff) {
      [...(this.read(8).match(/.{1,2}/g) as any)]
        .reverse()
        .forEach((c) => (res = res * 256 + parseInt(c, 16)));
      return res;
    }
    return len;
  }

  readBigInt() {
    // TO DO: implement negative numbers
    var len = this.readVarInt();
    var res = 0;
    var stringBytes = this.read(len);
    [...(stringBytes.match(/.{1,2}/g) as any)]
      .reverse()
      .forEach((c) => (res = res * 256 + parseInt(c, 16)));
    return res;
  }

  readBigIntAccurate() {
    var len = this.readVarInt();
    var res = bigInt();
    var stringBytes = this.read(len);
    [...(stringBytes.match(/.{1,2}/g) as any)].reverse().forEach((c) => {
      res = res.times(256).plus(parseInt(c, 16));
    });
    return res.toString();
  }

  readVmObject() {
    const type = this.readByte();
    console.log('type', type)
    switch (type) {
      case VMType.String:
        return this.readString();
      case VMType.Number:
        return this.readBigIntAccurate();
      case VMType.Bool:
        return this.readByte() != 0
      case VMType.Struct:
        const numFields = this.readVarInt();
        let res = {}
        for (let i = 0; i < numFields; ++i) {
          const key: any = this.readVmObject()
          console.log('  key', key)
          const value = this.readVmObject()
          console.log('  value', value)
          res[key] = value
        }
        return res
      case VMType.Enum:
        return this.readVarInt()
      case VMType.Object:
        const numBytes = this.readVarInt();
        return this.read(numBytes)
      default:
        return "unsupported type " + type;
    }
  }
}

export function decodeVMObject(str: string) {
  var dec = new Decoder(str);
  return dec.readVmObject();
}

export function getTokenEventData(str: string) {
  var dec = new Decoder(str);

  return {
    symbol: dec.readString(),
    value: dec.readBigIntAccurate(),
    chainName: dec.readString(),
  };
}

export function getChainValueEventData(str: string) {
  var dec = new Decoder(str);
  return {
    name: dec.readString,
    value: dec.readBigInt(),
  };
}

export function getTransactionSettleEventData(str: string) {
  var dec = new Decoder(str);
  return {
    hash: dec.read(dec.readByte()),
    platform: dec.readString(),
    chain: dec.readString(),
  };
  // public readonly Hash Hash;
}

export function getGasEventData(str: string) {
  var dec = new Decoder(str);
  return {
    address: dec.read(dec.readByte()),
    price: dec.readBigInt(),
    amount: dec.readBigInt(),
    endAmount: dec.isEnd() ? 0 : dec.readBigInt()
  };
}

export function getInfusionEventData(str: string) {
  var dec = new Decoder(str);
  return {
    baseSymbol: dec.readString(),
    TokenID: dec.readBigIntAccurate(),
    InfusedSymbol: dec.readString(),
    InfusedValue: dec.readBigIntAccurate(),
    ChainName: dec.readString(),
  };
}

export function getMarketEventData(str: string) {
  var dec = new Decoder(str);
  return {
    baseSymbol: dec.readString(),
    quoteSymbol: dec.readString(),
    id: dec.readBigIntAccurate(),
    amount: dec.readBigInt(),
  };
}

export function getString(str: string) {
  return new Decoder(str).readString();
}