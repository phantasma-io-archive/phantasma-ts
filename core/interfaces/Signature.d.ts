import { Address, PBinaryReader, PBinaryWriter } from "../types";
import { ISerializable } from "./ISerializable";
export declare enum SignatureKind {
    None = 0,
    Ed25519 = 1,
    ECDSA = 2
}
export declare class ISignature {
    signature: string;
    kind: number;
}
export declare abstract class Signature implements ISerializable {
    abstract Bytes: Uint8Array;
    abstract Kind: SignatureKind;
    abstract SerializeData(writer: PBinaryWriter): void;
    abstract UnserializeData(reader: PBinaryReader): void;
    abstract VerifyMultiple(message: Uint8Array, addresses: Address[]): boolean;
    Verify(message: Uint8Array, address: Address): boolean;
    ToByteArray(): Uint8Array;
}
//# sourceMappingURL=Signature.d.ts.map