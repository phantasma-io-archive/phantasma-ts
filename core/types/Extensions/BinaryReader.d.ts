import { BinaryReader } from "csharp-binary-stream";
import { ISignature } from "../../interfaces";
import { Timestamp } from "../Timestamp";
export declare class PBinaryReader extends BinaryReader {
    read(numBytes: number): string;
    readString(): string;
    readStringBytes(numBytes: number): string;
    readBigInteger(): BigInt;
    readBigIntAccurate(): string;
    readSignature(): ISignature;
    readByteArray(): any;
    readTimestamp(): Timestamp;
    readVarInt(): number;
    readVmObject(): {};
}
//# sourceMappingURL=BinaryReader.d.ts.map