import { IKeyPair } from "../interfaces/IKeyPair";
import { Signature, SignatureKind } from "../interfaces/Signature";
import { Address } from "./Address";
import { eddsa } from "elliptic";
import { stringToUint8Array, uint8ArrayToString } from "../utils";
import { BinaryReader, BinaryWriter, Encoding } from "csharp-binary-stream";
import { PBinaryWriter, PBinaryReader } from "./Extensions";

const ed25519 = new eddsa("ed25519");

export class Ed25519Signature implements Signature {
  public bytes: Uint8Array;
  public Kind: SignatureKind = SignatureKind.Ed25519;

  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
  }

  Verify(message: Uint8Array, address: Address): boolean {
    return this.VerifyMultiple(message, [address]);
  }

  public VerifyMultiple(message: Uint8Array, addresses: Address[]): boolean {
    for (const address of addresses) {
      if (!address.IsUser) {
        continue;
      }
      const pubKey = address.ToByteArray().slice(2);
      if (
        ed25519.verify(
          uint8ArrayToString(this.bytes),
          uint8ArrayToString(message),
          uint8ArrayToString(pubKey)
        )
      ) {
        return true;
      }
    }
    return false;
  }

  public SerializeData(writer: PBinaryWriter) {
    writer.writeString(uint8ArrayToString(this.bytes));
  }

  public UnserializeData(reader: PBinaryReader) {
    this.bytes = stringToUint8Array(reader.readString());
  }

  ToByteArray(): Uint8Array {
    const stream = new Uint8Array(64);
    const writer = new PBinaryWriter(stream);
    this.SerializeData(writer);
    return new Uint8Array(stream);
  }

  public static Generate(
    keypair: IKeyPair,
    message: Uint8Array
  ): Ed25519Signature {
    //const msgHashHex = Buffer.from(message, "hex");
    const msgHashHex = uint8ArrayToString(message);
    //const privateKeyBuffer = Buffer.from( keypair.PrivateKey, "hex");
    const privateKeyBuffer = uint8ArrayToString(keypair.PrivateKey);

    const sign = ed25519.sign(msgHashHex, privateKeyBuffer);
    return new Ed25519Signature(sign.toBytes());
  }
}
