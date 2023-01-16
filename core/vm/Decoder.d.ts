import { ISignature } from "../interfaces";
export declare class Decoder {
    str: string;
    constructor(str: string);
    isEnd(): boolean;
    readCharPair(): string;
    readByte(): number;
    read(numBytes: number): string;
    readString(): string;
    readStringBytes(numBytes: number): string;
    readByteArray(): any;
    readSignature(): ISignature;
    readTimestamp(): number;
    readVarInt(): number;
    readBigInt(): number;
    readBigIntAccurate(): string;
    readVmObject(): any;
}
//# sourceMappingURL=Decoder.d.ts.map