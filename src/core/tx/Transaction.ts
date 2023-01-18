import { eddsa } from "elliptic";
import { Decoder, ScriptBuilder } from "../vm";
import { hexStringToBytes, byteArrayToHex, getDifficulty } from "../utils";
import hexEncoding from "crypto-js/enc-hex";
import SHA256 from "crypto-js/sha256";
import { ISignature } from "../interfaces";
const curve = new eddsa("ed25519");

export class Transaction {
  script: string;
  nexusName: string;
  chainName: string;
  payload: string;
  expiration: Date;
  signatures: Array<ISignature>;
  hash: string;

  public static FromBytes(serializedData: string): Transaction {
    let transaction = new Transaction("", "", "", new Date(), "");
    return transaction.unserialize(serializedData);
  }

  constructor(
    nexusName: string,
    chainName: string,
    script: string,
    expiration: Date,
    payload: string
  ) {
    this.nexusName = nexusName;
    this.chainName = chainName;
    this.script = script;
    this.expiration = expiration;
    this.payload =
      payload == null || payload == "" ? "7068616e7461736d612d7473" : payload;
    this.signatures = [];
  }

  public sign(privateKey: string) {
    const signature = this.getSign(this.toString(false), privateKey);
    this.signatures.unshift({ signature, kind: 1 });
  }

  public toString(withSignature: boolean): string {
    /*const utc = Date.UTC(
      this.expiration.getUTCFullYear(),
      this.expiration.getUTCMonth(),
      this.expiration.getUTCDate(),
      this.expiration.getUTCHours(),
      this.expiration.getUTCMinutes(),
      this.expiration.getUTCSeconds()
    );
    let num = utc / 1000;

    let a = (num & 0xff000000) >> 24;
    let b = (num & 0x00ff0000) >> 16;
    let c = (num & 0x0000ff00) >> 8;
    let d = num & 0x000000ff;

    let expirationBytes = [d, c, b, a];*/

    let sb = new ScriptBuilder()
      .EmitVarString(this.nexusName)
      .EmitVarString(this.chainName)
      .EmitVarInt(this.script.length / 2)
      .AppendHexEncoded(this.script)
      .EmitTimestamp(this.expiration)
      .EmitVarInt(this.payload.length / 2)
      .AppendHexEncoded(this.payload);

    if (withSignature) {
      sb.EmitVarInt(this.signatures.length);
      this.signatures.forEach((sig) => {
        console.log("adding signature ", sig);
        if (sig.kind == 1) {
          sb.AppendByte(1); // Signature Type
          sb.EmitVarInt(sig.signature.length / 2);
          sb.AppendHexEncoded(sig.signature);
        } else if (sig.kind == 2) {
          sb.AppendByte(2); // ECDSA Signature
          sb.AppendByte(1); // Curve type secp256k1
          sb.EmitVarInt(sig.signature.length / 2);
          sb.AppendHexEncoded(sig.signature);
        }
      });
    }
    return sb.str;
  }

  public getHash() {
    let generatedHash = SHA256(hexEncoding.parse(this.toString(false)));
    this.hash = byteArrayToHex(
      hexStringToBytes(generatedHash.toString(hexEncoding)).reverse()
    );
    return this.hash;
  }

  public mineTransaction(difficulty: number) {
    if (difficulty < 0 || difficulty > 256) {
      console.log("Error adding difficulty");
      return;
    }

    let nonce = 0;
    let deepCopy = new Transaction(
      JSON.parse(JSON.stringify(this.nexusName)),
      JSON.parse(JSON.stringify(this.chainName)),
      JSON.parse(JSON.stringify(this.script)),
      this.expiration,
      JSON.parse(JSON.stringify(this.payload))
    );
    let payload = Buffer.alloc(4);

    while (true) {
      if (getDifficulty(deepCopy.getHash()) >= difficulty) {
        this.payload = deepCopy.payload;
        console.log(
          "It took " +
            nonce +
            " iterations to get a difficulty of >" +
            difficulty
        );
        return;
      }

      nonce++;

      payload[0] = (nonce >> 0) & 0xff;
      payload[1] = (nonce >> 8) & 0xff;
      payload[2] = (nonce >> 16) & 0xff;
      payload[3] = (nonce >> 24) & 0xff;

      deepCopy.payload = byteArrayToHex(payload);
    }
  }

  private getSign(msgHex: string, privateKey: string): string {
    const msgHashHex = Buffer.from(msgHex, "hex");
    const privateKeyBuffer = Buffer.from(privateKey, "hex");

    const sig = curve.sign(msgHashHex, privateKeyBuffer);

    return sig.toHex();
  }

  public unserialize(serializedData: string): Transaction {
    let dec = new Decoder(serializedData);
    let nexusName = dec.readString();
    let chainName = dec.readString();
    let scriptLength = dec.readVarInt();
    let script = dec.read(scriptLength);
    let date = new Date(dec.readTimestamp() * 1000);
    let payloadLength = dec.readVarInt();
    let payload = dec.read(payloadLength);

    let nTransaction = new Transaction(
      nexusName,
      chainName,
      script,
      date,
      payload
    );
    let signatureCount = dec.readVarInt();
    for (let i = 0; i < signatureCount; i++) {
      nTransaction.signatures.push(dec.readSignature());
    }
    return nTransaction;
  }
}
