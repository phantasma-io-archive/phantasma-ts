import { BinaryReader, BinaryWriter } from "csharp-binary-stream";
import { PBinaryReader, PBinaryWriter } from "../types/Extensions";

export abstract class ISerializable {
  abstract SerializeData(writer: PBinaryWriter);
  abstract UnserializeData(reader: PBinaryReader);
}
