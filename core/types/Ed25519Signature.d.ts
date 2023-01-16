import { IKeyPair } from "../interfaces/IKeyPair";
import { Signature, SignatureKind } from "../interfaces/Signature";
import { Address } from "./Address";
import { PBinaryWriter, PBinaryReader } from "./Extensions";
export declare class Ed25519Signature implements Signature {
    bytes: Uint8Array;
    Kind: SignatureKind;
    constructor(bytes: Uint8Array);
    Verify(message: Uint8Array, address: Address): boolean;
    VerifyMultiple(message: Uint8Array, addresses: Address[]): boolean;
    SerializeData(writer: PBinaryWriter): void;
    UnserializeData(reader: PBinaryReader): void;
    ToByteArray(): Uint8Array;
    static Generate(keypair: IKeyPair, message: Uint8Array): Ed25519Signature;
}
//# sourceMappingURL=Ed25519Signature.d.ts.map