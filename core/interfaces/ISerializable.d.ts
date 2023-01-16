import { PBinaryReader, PBinaryWriter } from "../types/Extensions";
export declare abstract class ISerializable {
    abstract SerializeData(writer: PBinaryWriter): any;
    abstract UnserializeData(reader: PBinaryReader): any;
}
//# sourceMappingURL=ISerializable.d.ts.map