import { eddsa } from "elliptic";
import { ScriptBuilder } from "../vm";
import { hexStringToBytes, byteArrayToHex, getDifficulty } from "../utils";
import hexEncoding from "crypto-js/enc-hex";
import SHA256 from "crypto-js/sha256";
const curve = new eddsa("ed25519");

interface ISignature {
  signature: string;
  kind: number;
}

export class Transaction {
  script: string;
  nexusName: string;
  chainName: string;
  sender: string;
  gasPayer: string;
  gasTarget: string;
  gasPrice: string;
  gasLimit: string;
  version: number;
  payload: string;
  expiration: Date;
  signatures: Array<ISignature>;
  hash: string;

  constructor(
    nexusName: string,
    chainName: string,
    script: string,
    sender: string,
    gasPayer: string,
    gasTarget: string,
    gasPrice: string,
    gasLimit: string,
    version: number,
    expiration: Date,
    payload: string
  ) {
    this.nexusName = nexusName;
    this.chainName = chainName;
    this.script = script;
    this.sender = sender;
    this.gasPayer = gasPayer;
    this.gasTarget = gasTarget;
    this.gasPrice = gasPrice;
    this.gasLimit = gasLimit;
    this.version = version;
    this.expiration = expiration;
    this.payload = payload == null || payload == "" ? "7068616e7461736d612d7473" : payload;
    this.signatures = [];
  }

  public sign(privateKey: string) {
    const signature = this.getSign(this.toString(false), privateKey);
    this.signatures.unshift({ signature, kind: 1 });
  }

  public toString(withSignature: boolean): string {
    const utc = Date.UTC(
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

    let expirationBytes = [d, c, b, a];

    let sb = new ScriptBuilder()
      .emitVarString(this.nexusName)
      .emitVarString(this.chainName)
      .emitVarInt(this.version)  // ng      
      .emitVarInt(this.script.length / 2)
      .appendHexEncoded(this.script)
      .emitAddress(this.sender)
      .emitAddress(this.gasPayer)
      // .emitAddress(this.gasTarget)
      .emitByteArray(new Array(34).fill(0))
      .emitBigInteger(this.gasPrice)
      .emitBigInteger(this.gasLimit)
      .emitBytes(expirationBytes)
      .emitVarInt(this.payload.length / 2)
      .appendHexEncoded(this.payload);

    if (withSignature) {
      sb.emitVarInt(this.signatures.length);
      this.signatures.forEach((sig) => {
        console.log("adding signature ", sig);
        if (sig.kind == 1) {
          sb.appendByte(1); // Signature Type
          sb.emitVarInt(sig.signature.length / 2);
          sb.appendHexEncoded(sig.signature);
        } else if (sig.kind == 2) {
          sb.appendByte(2); // ECDSA Signature
          sb.appendByte(1); // Curve type secp256k1
          sb.emitVarInt(sig.signature.length / 2);
          sb.appendHexEncoded(sig.signature);
        }}
      });
    }
    return sb.str;
  }

  public getHash() {
    let generatedHash = SHA256(hexEncoding.parse(this.toString(false)))
    this.hash = byteArrayToHex(hexStringToBytes(generatedHash.toString(hexEncoding)).reverse());
    return this.hash;
  }

  public mineTransaction(difficulty: number) {
    if(difficulty < 0 || difficulty > 256){
      console.log("Error adding difficulty");
      return;
    }
    
    let nonce = 0;
    let deepCopy = new Transaction(
      JSON.parse(JSON.stringify(this.nexusName)),
      JSON.parse(JSON.stringify(this.chainName)),
      JSON.parse(JSON.stringify(this.script)),
      JSON.parse(JSON.stringify(this.sender)),
      JSON.parse(JSON.stringify(this.gasPayer)),
      JSON.parse(JSON.stringify(this.gasTarget)),
      JSON.parse(JSON.stringify(this.gasPrice)),
      JSON.parse(JSON.stringify(this.gasLimit)),
      JSON.parse(JSON.stringify(this.version)),
      this.expiration,
      JSON.parse(JSON.stringify(this.payload)),
  );
    let payload = Buffer.alloc(4)


    while (true) {
      if (getDifficulty(deepCopy.getHash()) >= difficulty) {
        this.payload = deepCopy.payload;
        console.log('It took ' + nonce +' iterations to get a difficulty of >' + difficulty)
        return;
      }

      nonce++;

      payload[0] = ((nonce >> 0) & 0xFF);
      payload[1] = ((nonce >> 8) & 0xFF);
      payload[2] = ((nonce >> 16) & 0xFF);
      payload[3] = ((nonce >> 24) & 0xFF);

      deepCopy.payload = byteArrayToHex(payload);
    }
  }

  private getSign(msgHex: string, privateKey: string): string {
    const msgHashHex = Buffer.from(msgHex, "hex");
    const privateKeyBuffer = Buffer.from(privateKey, "hex");

    const sig = curve.sign(msgHashHex, privateKeyBuffer);

    return sig.toHex();
  }
}
