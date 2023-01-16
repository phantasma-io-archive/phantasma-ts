import { Type } from "typescript";
import { PBinaryReader, PBinaryWriter } from "./Extensions";
export interface CustomReader {
    (reader: PBinaryReader): any;
}
export interface CustomWriter {
    (writer: PBinaryWriter, obj: any): void;
}
export declare class CustomSerializer {
    readonly Read: CustomReader;
    readonly Write: CustomWriter;
    constructor(reader: CustomReader, writer: CustomWriter);
}
export declare class Serialization<T> {
    private static _customSerializers;
    static RegisterType<T>(type: T, reader: CustomReader, writer: CustomWriter): void;
    static Serialize(obj: any): Uint8Array;
    static SerializeObject(writer: PBinaryWriter, obj: object, type: Type | null): void;
    static Unserialize<T>(bytesOrBytes: Uint8Array | PBinaryReader): T;
    static UnserializeObject<T>(reader: PBinaryReader, type: Type): T;
}
//# sourceMappingURL=Serialization.d.ts.map