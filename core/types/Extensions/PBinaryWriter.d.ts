/// <reference types="node" />
import { Encoding } from "csharp-binary-stream";
import { Signature } from "../../interfaces";
import { Timestamp } from "../Timestamp";
type byte = number;
export declare class PBinaryWriter {
    private writer;
    _buffer: Buffer;
    _position: number;
    _length: number;
    constructor(arg1?: undefined | Buffer | Uint8Array | null);
    get length(): number;
    get position(): number;
    set position(value: number);
    writeBoolean(value: boolean): void;
    writeByte(value: number): void;
    writeSameByte(value: number, repeats: number): void;
    writeSignedByte(value: number): void;
    writeShort(value: number): void;
    writeUnsignedShort(value: number): void;
    writeInt(value: number): void;
    writeUnsignedInt(value: number): void;
    writeLong(value: string | number): void;
    writeUnsignedLong(value: string | number): void;
    writeFloat(value: number): void;
    writeDouble(value: number): void;
    writeChar(character: string | number, encoding: Encoding): void;
    writeChars(characters: string | number[], encoding: Encoding): void;
    clear(): void;
    toArray(): number[];
    toUint8Array(): Uint8Array;
    appendByte(value: number): this;
    appendBytes(bytes: byte[]): void;
    writeEnum(value: number): this;
    writeBytes(bytes: byte[]): this;
    writeVarInt(value: number): this;
    writeTimestamp(obj: Timestamp): this;
    writeDateTime(obj: Date): this;
    rawString(value: string): any[];
    writeByteArray(bytes: number[] | Uint8Array): this;
    writeString(text: string): this;
    emitUInt32(value: number): this;
    writeBigInteger(value: BigInt): this;
    writeBigIntegerString(value: string): this;
    writeSignature(signature: Signature): this;
}
export {};
//# sourceMappingURL=PBinaryWriter.d.ts.map