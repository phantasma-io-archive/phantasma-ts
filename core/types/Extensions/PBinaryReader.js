"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PBinaryReader = void 0;
var big_integer_1 = __importDefault(require("big-integer"));
var csharp_binary_stream_1 = require("csharp-binary-stream");
var interfaces_1 = require("../../interfaces");
var utils_1 = require("../../utils");
var vm_1 = require("../../vm");
var Timestamp_1 = require("../Timestamp");
var PBinaryReader = /** @class */ (function () {
    function PBinaryReader(arg1) {
        this.reader = new csharp_binary_stream_1.BinaryReader(arg1);
    }
    Object.defineProperty(PBinaryReader.prototype, "length", {
        get: function () {
            return this.reader.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBinaryReader.prototype, "position", {
        get: function () {
            return this.reader.position;
        },
        set: function (value) {
            this.reader.position = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBinaryReader.prototype, "isEndOfStream", {
        get: function () {
            return this.reader.isEndOfStream;
        },
        enumerable: false,
        configurable: true
    });
    PBinaryReader.prototype.readBoolean = function () {
        return this.reader.readBoolean();
    };
    PBinaryReader.prototype.readByte = function () {
        return this.reader.readByte();
    };
    PBinaryReader.prototype.readBytes = function (bytesToRead) {
        return this.reader.readBytes(bytesToRead);
    };
    PBinaryReader.prototype.readSignedByte = function () {
        return this.reader.readSignedByte();
    };
    PBinaryReader.prototype.readShort = function () {
        return this.reader.readShort();
    };
    PBinaryReader.prototype.readUnsignedShort = function () {
        return this.reader.readUnsignedShort();
    };
    PBinaryReader.prototype.readInt = function () {
        return this.reader.readInt();
    };
    PBinaryReader.prototype.readUnsignedInt = function () {
        return this.reader.readUnsignedInt();
    };
    PBinaryReader.prototype.readLongString = function () {
        return this.reader.readLongString();
    };
    PBinaryReader.prototype.readLong = function () {
        return this.reader.readLong();
    };
    PBinaryReader.prototype.readUnsignedLongString = function () {
        return this.reader.readUnsignedLongString();
    };
    PBinaryReader.prototype.readUnsignedLong = function () {
        return this.reader.readUnsignedLong();
    };
    PBinaryReader.prototype.readFloat = function () {
        return this.reader.readFloat();
    };
    PBinaryReader.prototype.readDouble = function () {
        return this.reader.readDouble();
    };
    PBinaryReader.prototype.readChar = function (encoding) {
        return this.reader.readChar(encoding);
    };
    PBinaryReader.prototype.readChars = function (charactersToRead, encoding) {
        return this.reader.readChars(charactersToRead, encoding);
    };
    PBinaryReader.prototype.readCharBytes = function (bytesToRead, encoding) {
        return this.reader.readCharBytes(bytesToRead, encoding);
    };
    PBinaryReader.prototype.read = function (numBytes) {
        var res = (0, utils_1.byteArrayToHex)(this.readBytes(numBytes)).substr(0, numBytes * 2);
        this.position += numBytes * 2;
        return res;
    };
    PBinaryReader.prototype.readString = function () {
        var len = this.readVarInt();
        return this.readStringBytes(len);
    };
    PBinaryReader.prototype.readStringBytes = function (numBytes) {
        var res = "";
        for (var i = 0; i < numBytes; ++i) {
            res += String.fromCharCode(this.readByte());
        }
        return res;
    };
    PBinaryReader.prototype.readBigInteger = function () {
        // TO DO: implement negative numbers
        var len = this.readVarInt();
        var res = 0;
        var stringBytes = this.read(len);
        __spreadArray([], __read(stringBytes.match(/.{1,2}/g)), false).reverse()
            .forEach(function (c) { return (res = res * 256 + parseInt(c, 16)); });
        var bigInt = BigInt(res);
        return bigInt;
    };
    PBinaryReader.prototype.readBigIntAccurate = function () {
        var len = this.readVarInt();
        var res = (0, big_integer_1.default)();
        var stringBytes = this.read(len);
        __spreadArray([], __read(stringBytes.match(/.{1,2}/g)), false).reverse().forEach(function (c) {
            res = res.times(256).plus(parseInt(c, 16));
        });
        return res.toString();
    };
    PBinaryReader.prototype.readSignature = function () {
        var kind = this.readByte();
        var signature = new interfaces_1.ISignature();
        var curve;
        signature.kind = kind;
        switch (kind) {
            case interfaces_1.SignatureKind.None:
                return null;
            case interfaces_1.SignatureKind.Ed25519:
                var len = this.readVarInt();
                signature.signature = this.read(len);
                break;
            case interfaces_1.SignatureKind.ECDSA:
                curve = this.readByte();
                signature.signature = this.readString();
                break;
            default:
                throw "read signature: " + kind;
        }
        return signature;
    };
    PBinaryReader.prototype.readByteArray = function () {
        var res;
        var length = this.readVarInt();
        if (length == 0)
            return [];
        res = this.read(length);
        return res;
    };
    PBinaryReader.prototype.readTimestamp = function () {
        //var len = this.readByte();
        var result = 0;
        var bytes = this.read(4);
        bytes
            .match(/.{1,2}/g)
            .reverse()
            .forEach(function (c) { return (result = result * 256 + parseInt(c, 16)); });
        var timestamp = new Timestamp_1.Timestamp(result);
        return timestamp;
    };
    PBinaryReader.prototype.readVarInt = function () {
        var len = this.readByte();
        var res = 0;
        if (len === 0xfd) {
            __spreadArray([], __read(this.read(2).match(/.{1,2}/g)), false).reverse()
                .forEach(function (c) { return (res = res * 256 + parseInt(c, 16)); });
            return res;
        }
        else if (len === 0xfe) {
            __spreadArray([], __read(this.read(4).match(/.{1,2}/g)), false).reverse()
                .forEach(function (c) { return (res = res * 256 + parseInt(c, 16)); });
            return res;
        }
        else if (len === 0xff) {
            __spreadArray([], __read(this.read(8).match(/.{1,2}/g)), false).reverse()
                .forEach(function (c) { return (res = res * 256 + parseInt(c, 16)); });
            return res;
        }
        return len;
    };
    PBinaryReader.prototype.readVmObject = function () {
        var type = this.readByte();
        console.log("type", type);
        switch (type) {
            case vm_1.VMType.String:
                return this.readString();
            case vm_1.VMType.Number:
                return this.readBigIntAccurate();
            case vm_1.VMType.Bool:
                return this.readByte() != 0;
            case vm_1.VMType.Struct:
                var numFields = this.readVarInt();
                var res = {};
                for (var i = 0; i < numFields; ++i) {
                    var key = this.readVmObject();
                    console.log("  key", key);
                    var value = this.readVmObject();
                    console.log("  value", value);
                    res[key] = value;
                }
                return res;
            case vm_1.VMType.Enum:
                return this.readVarInt();
            case vm_1.VMType.Object:
                var numBytes = this.readVarInt();
                return this.read(numBytes);
            default:
                return "unsupported type " + type;
        }
    };
    return PBinaryReader;
}());
exports.PBinaryReader = PBinaryReader;
