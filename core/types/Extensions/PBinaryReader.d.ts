/// <reference types="node" />
import { BinaryReader, Encoding } from "csharp-binary-stream";
import { Signature } from "../../interfaces";
import { Timestamp } from "../Timestamp";
export declare class PBinaryReader {
    reader: BinaryReader;
    get length(): number;
    get position(): number;
    set position(value: number);
    get isEndOfStream(): boolean;
    readBoolean(): boolean;
    readByte(): number;
    readBytes(bytesToRead: number): number[];
    readSignedByte(): number;
    readShort(): number;
    readUnsignedShort(): number;
    readInt(): number;
    readUnsignedInt(): number;
    readLongString(): string;
    readLong(): number;
    readUnsignedLongString(): string;
    readUnsignedLong(): number;
    readFloat(): number;
    readDouble(): number;
    readChar(encoding: Encoding): string;
    readChars(charactersToRead: number, encoding: Encoding): string;
    readCharBytes(bytesToRead: number, encoding: Encoding): string;
    constructor(arg1: Buffer | Uint8Array);
    read(numBytes: number): string;
    readString(): string;
    readStringBytes(numBytes: number): string;
    readBigInteger(): BigInt;
    readBigIntAccurate(): string;
    readSignatureV2(): Signature;
    readSignature(): Signature;
    readByteArray(): any;
    readTimestamp(): Timestamp;
    readVarInt(): number;
    readVmObject(): {};
}
//# sourceMappingURL=PBinaryReader.d.ts.map