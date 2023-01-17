/// <reference types="node" />
import { BinaryWriter } from "csharp-binary-stream";
import { Timestamp } from "../Timestamp";
type byte = number;
export declare class Example extends BinaryWriter {
    constructor(arg1?: undefined | Buffer | Uint8Array | null);
    appendByte(value: number): this;
}
export declare class PBinaryWriter extends BinaryWriter {
    constructor(arg1?: undefined | Buffer | Uint8Array | null);
    appendByte(value: number): this;
    appendBytes(bytes: byte[]): void;
    writeBytes(bytes: byte[]): this;
    writeVarInt(value: number): this;
    writeTimestamp(obj: Timestamp): this;
    writeDateTime(obj: Date): this;
    rawString(value: string): any[];
    writeByteArray(bytes: number[]): this;
    writeString(text: string): this;
    emitUInt32(value: number): this;
    writeBigInteger(value: BigInt): this;
    writeBigIntegerString(value: string): this;
}
export {};
//# sourceMappingURL=BinaryWriter.d.ts.map