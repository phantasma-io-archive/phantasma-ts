import { ISerializable, Signature } from "../interfaces";
import { PBinaryReader, PBinaryWriter, PhantasmaKeys } from "../types";
export declare class Transaction implements ISerializable {
    script: string;
    nexusName: string;
    chainName: string;
    payload: string;
    expiration: Date;
    signatures: Array<Signature>;
    hash: string;
    static FromBytes(serializedData: string): Transaction;
    constructor(nexusName: string, chainName: string, script: string, expiration: Date, payload: string);
    sign(wif: string): void;
    signWithPrivateKey(privateKey: string): void;
    signWithKeys(keys: PhantasmaKeys): void;
    ToByteAray(withSignature: boolean): Uint8Array;
    UnserializeData(reader: PBinaryReader): void;
    SerializeData(writer: PBinaryWriter): void;
    toString(withSignature: boolean): string;
    getHash(): string;
    mineTransaction(difficulty: number): void;
    private getSign;
    unserialize(serializedData: string): Transaction;
}
//# sourceMappingURL=Transaction.d.ts.map