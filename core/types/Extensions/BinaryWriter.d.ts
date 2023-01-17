/// <reference types="node" />
import { BinaryWriter } from "csharp-binary-stream";
import { Timestamp } from "../Timestamp";
type byte = number;
export declare class PBinaryWriter extends BinaryWriter {
    static FromBuffer(buffer: Buffer): PBinaryWriter;
    static FromUint8Array(uint8Array: Uint8Array): PBinaryWriter;
    constructor();
    constructor(Uint8Array: Uint8Array);
    constructor(Buffer: Buffer);
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