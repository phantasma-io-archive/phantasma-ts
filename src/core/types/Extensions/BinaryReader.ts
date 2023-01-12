import BigInteger from "big-integer";
import { BinaryWriter, BinaryReader, Encoding } from "csharp-binary-stream";
import { ISignature, SignatureKind } from "../../interfaces";
import { byteArrayToHex } from "../../utils";
import { VMType } from "../../vm";
import { Timestamp } from "../Timestamp";

export class PBinaryReader extends BinaryReader {
  public read(numBytes: number): string {
    var res = byteArrayToHex(this.readBytes(numBytes)).substr(0, numBytes * 2);
    this.position += numBytes * 2;
    return res;
  }

  public readString(): string {
    var len = this.readVarInt();
    return this.readStringBytes(len);
  }

  public readStringBytes(numBytes: number) {
    var res = "";
    for (var i = 0; i < numBytes; ++i) {
      res += String.fromCharCode(this.readByte());
    }
    return res;
  }

  public readBigInteger(): BigInt {
    // TO DO: implement negative numbers
    var len = this.readVarInt();
    var res = 0;
    var stringBytes = this.read(len);
    [...(stringBytes.match(/.{1,2}/g) as any)]
      .reverse()
      .forEach((c) => (res = res * 256 + parseInt(c, 16)));

    let bigInt = BigInt(res);
    return bigInt;
  }

  public readBigIntAccurate() {
    var len = this.readVarInt();
    var res = BigInteger();
    var stringBytes = this.read(len);
    [...(stringBytes.match(/.{1,2}/g) as any)].reverse().forEach((c) => {
      res = res.times(256).plus(parseInt(c, 16));
    });
    return res.toString();
  }

  public readSignature() {
    let kind = this.readByte() as SignatureKind;
    let signature: ISignature = new ISignature();
    let curve;
    signature.kind = kind;
    switch (kind) {
      case SignatureKind.None:
        return null;

      case SignatureKind.Ed25519:
        let len = this.readVarInt();
        signature.signature = this.read(len);
        break;
      case SignatureKind.ECDSA:
        curve = this.readByte();
        signature.signature = this.readString();
        break;
      default:
        throw "read signature: " + kind;
    }

    return signature;
  }

  public readByteArray() {
    var res;
    var length = this.readVarInt();
    if (length == 0) return [];

    res = this.read(length);
    return res;
  }

  public readTimestamp(): Timestamp {
    //var len = this.readByte();
    let result = 0;
    let bytes = this.read(4);
    bytes
      .match(/.{1,2}/g)
      .reverse()
      .forEach((c) => (result = result * 256 + parseInt(c, 16)));

    let timestamp = new Timestamp(result);
    return timestamp;
  }

  public readVarInt(): number {
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

  public readVmObject() {
    const type = this.readByte();
    console.log("type", type);
    switch (type) {
      case VMType.String:
        return this.readString();
      case VMType.Number:
        return this.readBigIntAccurate();
      case VMType.Bool:
        return this.readByte() != 0;
      case VMType.Struct:
        const numFields = this.readVarInt();
        let res = {};
        for (let i = 0; i < numFields; ++i) {
          const key: any = this.readVmObject();
          console.log("  key", key);
          const value = this.readVmObject();
          console.log("  value", value);
          res[key] = value;
        }
        return res;
      case VMType.Enum:
        return this.readVarInt();
      case VMType.Object:
        const numBytes = this.readVarInt();
        return this.read(numBytes);
      default:
        return "unsupported type " + type;
    }
  }
}
