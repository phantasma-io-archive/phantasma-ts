import { Type } from "typescript";
import { PBinaryReader, PBinaryWriter } from "./Extensions";
import { Timestamp } from "./Timestamp";
import { ISerializable } from "../interfaces";

export interface CustomReader {
  (reader: PBinaryReader): any;
}
export interface CustomWriter {
  (writer: PBinaryWriter, obj: any): void;
}
//function CustomWriter(writer: PBinaryWriter, obj: any): void;
//function CustomReader(reader: PBinaryReader): any;

export class CustomSerializer {
  readonly Read: CustomReader;
  readonly Write: CustomWriter;
  constructor(reader: CustomReader, writer: CustomWriter) {
    this.Read = reader;
    this.Write = writer;
  }
}

export class Serialization<T> {
  private static _customSerializers: Map<string, CustomSerializer>; //: { [key: string]: CustomSerializer };

  static RegisterType<T>(type: T, reader: CustomReader, writer: CustomWriter) {
    Serialization._customSerializers[typeof type] = new CustomSerializer(
      reader,
      writer
    );
  }

  static Serialize(obj: any): Uint8Array {
    if (!obj) {
      return new Uint8Array();
    }

    if (obj instanceof Uint8Array) {
      return obj;
    }

    let jsonString = JSON.stringify(obj);
    let jsonAsUint8 = new TextEncoder().encode(jsonString);
    return jsonAsUint8;
  }

  static SerializeObject(
    writer: PBinaryWriter,
    obj: object,
    type: Type | null
  ) {
    if (type == null || type == undefined) {
      type = typeof obj as unknown as Type;
      this.SerializeObject(writer, obj, type);
      return;
    }

    if (Serialization._customSerializers.has(typeof type)) {
      var serializer = Serialization._customSerializers[typeof type];
      serializer.Write(writer, obj);
      return;
    }

    /*if (typeof obj == "void") {
      return;
    }*/

    if (obj instanceof Boolean) {
      writer.writeByte(obj ? 1 : 0);
      return;
    } else if (obj instanceof Number) {
      writer.writeVarInt(obj as number);
      return;
    } else if (obj instanceof BigInt) {
      writer.writeBigInteger(obj);
    } else if (obj instanceof String) {
      writer.writeString(obj as string);
      return;
    } else if (obj instanceof Timestamp) {
      writer.writeVarInt(obj.value);
      return;
    } else if (obj instanceof Date) {
      writer.writeDateTime(obj);
      return;
    } else if (obj instanceof ISerializable) {
      obj.SerializeData(writer);
      return;
    } else if (Array.isArray(obj)) {
      writer.writeByte(obj.length);
      obj.forEach((entry) => {
        this.SerializeObject(writer, entry, typeof entry as unknown as Type);
      });
      return;
    } else if (obj instanceof Enumerator) {
      writer.writeByte(obj.item as unknown as number);
      return;
    }
  }

  static Unserialize<T>(bytesOrBytes: Uint8Array | PBinaryReader): T {
    let t = typeof bytesOrBytes as T as Type;

    if (bytesOrBytes instanceof PBinaryReader) {
      return Serialization.UnserializeObject(
        bytesOrBytes,
        typeof t as unknown as Type
      ) as T;
    }
    if (!bytesOrBytes || bytesOrBytes.length === 0) {
      return null as T;
    }
    //let type = Object.prototype.propertyIsEnumerable(T);
    let stream: PBinaryReader = new PBinaryReader(bytesOrBytes);
    return Serialization.UnserializeObject(stream, t) as T;
  }

  static UnserializeObject<T>(reader: PBinaryReader, type: Type): T {
    if (Serialization._customSerializers.has(typeof type)) {
      var serializer = Serialization._customSerializers[typeof type];
      return serializer.Read(reader);
    }

    if (type == null || type == undefined) {
      return null as T;
    }

    if (type instanceof Boolean) {
      return (reader.readByte() == 1) as unknown as T;
    } else if (type instanceof Number) {
      return reader.readVarInt() as unknown as T;
    } else if (type instanceof BigInt) {
      return reader.readBigInteger() as unknown as T;
    } else if (type instanceof String) {
      return reader.readString() as unknown as T;
    } else if (type instanceof Timestamp) {
      return new Timestamp(reader.readVarInt()) as unknown as T;
    } else if (type instanceof ISerializable) {
      let obj: ISerializable = Object.create(
        ISerializable
      ) as T as ISerializable;
      obj.UnserializeData(reader);
      return obj as T;
    } else if (Array.isArray(type)) {
      var len = reader.readByte();
      var arr = new Array(len);
      for (let i = 0; i < len; i++) {
        arr[i] = this.UnserializeObject(reader, type[i]);
      }
      return arr as unknown as T;
    } else if (type instanceof Enumerator) {
      return reader.readByte() as unknown as T;
    }
  }
}
