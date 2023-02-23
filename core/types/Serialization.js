"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serialization = exports.CustomSerializer = void 0;
var Extensions_1 = require("./Extensions");
var Timestamp_1 = require("./Timestamp");
var utils_1 = require("../utils");
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
    Serialization.SerializeEnum = function (obj) {
        if (!obj) {
            return new Uint8Array();
        }
        if (obj instanceof Uint8Array) {
            return obj;
        }
        var writer = new Extensions_1.PBinaryWriter();
        writer.writeEnum(obj);
        return writer.toUint8Array();
    };
    Serialization.Serialize = function (obj) {
        if (!obj) {
            return new Uint8Array();
        }
        if (obj instanceof Uint8Array) {
            return obj;
        }
        //let jsonString = JSON.stringify(obj);
        var writer = new Extensions_1.PBinaryWriter();
        this.SerializeObject(writer, obj, typeof obj);
        //let jsonAsUint8 = new TextEncoder().encode(jsonString);
        return writer.toUint8Array();
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
        var structType = Object.getPrototypeOf(obj).constructor.name;
        var result = Object.apply(structType);
        var localType = Object.apply(typeof type);
        //console.log(localType);
        if (obj instanceof Boolean || typeof obj == "boolean") {
            writer.writeByte(obj ? 1 : 0);
            return;
        }
        else if (obj instanceof Number || typeof obj == "number") {
            writer.writeByte((0, utils_1.stringToUint8Array)(obj.toString()).length);
            writer.writeVarInt(obj);
            return;
        }
        else if (obj instanceof BigInt || typeof obj == "bigint") {
            writer.writeBigInteger(obj);
        }
        else if (obj instanceof String || typeof obj == "string") {
            writer.writeString(obj);
            return;
        }
        else if (obj instanceof Timestamp_1.Timestamp) {
            writer.writeTimestamp(obj);
            return;
        }
        else if (obj instanceof Date) {
            writer.writeDateTime(obj);
            return;
        }
        else if (typeof obj.UnserializeData === "function" &&
            typeof obj.SerializeData === "function") {
            obj.SerializeData(writer);
            return;
        }
        else if (Array.isArray(obj)) {
            writer.writeVarInt(obj.length);
            obj.forEach(function (entry) {
                _this.SerializeObject(writer, entry, typeof entry);
            });
            return;
        }
        else if (Object.getPrototypeOf(type) == "enum") {
            writer.writeByte(obj);
            return;
        }
        else if (obj instanceof Uint8Array) {
            writer.writeByteArray(Array.from(obj));
        }
        else {
            // TODO: Add support for other types
            // Get the keys of the object
            var fields = Object.keys(obj);
            fields.forEach(function (field) {
                var value = obj[field];
                _this.SerializeObject(writer, value, typeof value);
            });
        }
    };
    Serialization.Unserialize = function (bytesOrBytes, type) {
        if (bytesOrBytes instanceof Extensions_1.PBinaryReader) {
            return Serialization.UnserializeObject(bytesOrBytes, type);
        }
        if (!bytesOrBytes || bytesOrBytes.length === 0) {
            return null;
        }
        //let type = Object.prototype.propertyIsEnumerable(T);
        var stream = new Extensions_1.PBinaryReader(bytesOrBytes);
        return Serialization.UnserializeObject(stream, type);
    };
    Serialization.UnserializeObject = function (reader, type) {
        if (Serialization._customSerializers.has(typeof type)) {
            var serializer = Serialization._customSerializers[typeof type];
            return serializer.Read(reader);
        }
        if (type == null || type == undefined) {
            return null;
        }
        var localType; //: typeof type;
        if (type.name != undefined) {
            var className = type.name;
            localType = Object.apply(className);
        }
        else {
            localType = new type();
        }
        if (localType instanceof Boolean || typeof localType == "boolean") {
            return (reader.readByte() == 1);
        }
        else if (localType instanceof Number || typeof localType == "number") {
            return reader.readVarInt();
        }
        else if (localType instanceof BigInt || typeof localType == "bigint") {
            return reader.readBigInteger();
        }
        else if (localType instanceof String || typeof localType == "string") {
            return reader.readVarString();
        }
        else if (localType instanceof Timestamp_1.Timestamp) {
            return new Timestamp_1.Timestamp(reader.readVarInt());
        }
        else if (typeof localType.UnserializeData === "function" &&
            typeof localType.SerializeData === "function") {
            var obj = localType;
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
        else if (Object.getPrototypeOf(type) == "enum") {
            return reader.readByte();
        }
        else {
            var fields = Object.keys(localType);
            /*console.log(fields);
            fields.forEach((field) => {
              localType[field] = this.UnserializeObject(
                reader,
                typeof localType[field]
              );
            });
            return localType as T;*/
        }
    };
    Serialization._customSerializers = new Map(); //: { [key: string]: CustomSerializer };
    return Serialization;
}());
exports.Serialization = Serialization;
