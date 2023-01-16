"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serialization = exports.CustomSerializer = void 0;
var Extensions_1 = require("./Extensions");
var Timestamp_1 = require("./Timestamp");
var interfaces_1 = require("../interfaces");
//function CustomWriter(writer: PBinaryWriter, obj: any): void;
//function CustomReader(reader: PBinaryReader): any;
var CustomSerializer = /** @class */ (function () {
    function CustomSerializer(reader, writer) {
        this.Read = reader;
        this.Write = writer;
    }
    return CustomSerializer;
}());
exports.CustomSerializer = CustomSerializer;
var Serialization = /** @class */ (function () {
    function Serialization() {
    }
    Serialization.RegisterType = function (type, reader, writer) {
        Serialization._customSerializers[typeof type] = new CustomSerializer(reader, writer);
    };
    Serialization.Serialize = function (obj) {
        if (!obj) {
            return new Uint8Array();
        }
        if (obj instanceof Uint8Array) {
            return obj;
        }
        var jsonString = JSON.stringify(obj);
        var jsonAsUint8 = new TextEncoder().encode(jsonString);
        return jsonAsUint8;
    };
    Serialization.SerializeObject = function (writer, obj, type) {
        var _this = this;
        if (type == null || type == undefined) {
            type = typeof obj;
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
        }
        else if (obj instanceof Number) {
            writer.writeVarInt(obj);
            return;
        }
        else if (obj instanceof BigInt) {
            writer.writeBigInteger(obj);
        }
        else if (obj instanceof String) {
            writer.writeString(obj);
            return;
        }
        else if (obj instanceof Timestamp_1.Timestamp) {
            writer.writeVarInt(obj.value);
            return;
        }
        else if (obj instanceof Date) {
            writer.writeDateTime(obj);
            return;
        }
        else if (obj instanceof interfaces_1.ISerializable) {
            obj.SerializeData(writer);
            return;
        }
        else if (Array.isArray(obj)) {
            writer.writeByte(obj.length);
            obj.forEach(function (entry) {
                _this.SerializeObject(writer, entry, typeof entry);
            });
            return;
        }
        else if (obj instanceof Enumerator) {
            writer.writeByte(obj.item);
            return;
        }
    };
    Serialization.Unserialize = function (bytesOrBytes) {
        var t = typeof bytesOrBytes;
        if (bytesOrBytes instanceof Extensions_1.PBinaryReader) {
            return Serialization.UnserializeObject(bytesOrBytes, typeof t);
        }
        if (!bytesOrBytes || bytesOrBytes.length === 0) {
            return null;
        }
        //let type = Object.prototype.propertyIsEnumerable(T);
        var stream = new Extensions_1.PBinaryReader(bytesOrBytes);
        return Serialization.UnserializeObject(stream, t);
    };
    Serialization.UnserializeObject = function (reader, type) {
        if (Serialization._customSerializers.has(typeof type)) {
            var serializer = Serialization._customSerializers[typeof type];
            return serializer.Read(reader);
        }
        if (type == null || type == undefined) {
            return null;
        }
        if (type instanceof Boolean) {
            return (reader.readByte() == 1);
        }
        else if (type instanceof Number) {
            return reader.readVarInt();
        }
        else if (type instanceof BigInt) {
            return reader.readBigInteger();
        }
        else if (type instanceof String) {
            return reader.readString();
        }
        else if (type instanceof Timestamp_1.Timestamp) {
            return new Timestamp_1.Timestamp(reader.readVarInt());
        }
        else if (type instanceof interfaces_1.ISerializable) {
            var obj = Object.create(interfaces_1.ISerializable);
            obj.UnserializeData(reader);
            return obj;
        }
        else if (Array.isArray(type)) {
            var len = reader.readByte();
            var arr = new Array(len);
            for (var i = 0; i < len; i++) {
                arr[i] = this.UnserializeObject(reader, type[i]);
            }
            return arr;
        }
        else if (type instanceof Enumerator) {
            return reader.readByte();
        }
    };
    return Serialization;
}());
exports.Serialization = Serialization;
