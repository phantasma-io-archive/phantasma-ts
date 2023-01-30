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
    static SerializeEnum(obj: any): Uint8Array;
    static Serialize(obj: any): Uint8Array;
    static SerializeObject(writer: PBinaryWriter, obj: any, type: any | null): void;
    static Unserialize<T>(bytesOrBytes: Uint8Array | PBinaryReader, type?: any): T;
    static UnserializeObject<T extends any>(reader: PBinaryReader, type: any): T;
}
//# sourceMappingURL=Serialization.d.ts.map