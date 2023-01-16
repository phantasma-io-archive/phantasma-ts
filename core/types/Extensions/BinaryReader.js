"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var PBinaryReader = /** @class */ (function (_super) {
    __extends(PBinaryReader, _super);
    function PBinaryReader(buffer) {
        var _this = this;
        if (Buffer.isBuffer(arguments[0])) {
            _this = _super.call(this, arguments[0]) || this;
        }
        else if (Uint8Array.prototype.isPrototypeOf(arguments[0])) {
            _this = _super.call(this, arguments[0]) || this;
        }
        return _this;
    }
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
}(csharp_binary_stream_1.BinaryReader));
exports.PBinaryReader = PBinaryReader;
