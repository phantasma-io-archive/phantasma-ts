import { BinaryReader, BinaryWriter } from "csharp-binary-stream";
import { PBinaryReader, PBinaryWriter } from "../types/Extensions";

export interface ISerializable {
  SerializeData(writer: PBinaryWriter);
  UnserializeData(reader: PBinaryReader);
}
