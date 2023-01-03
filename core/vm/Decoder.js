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
exports.Decoder = void 0;
var big_integer_1 = __importDefault(require("big-integer"));
var tx_1 = require("../tx");
var VMType_1 = require("./VMType");
var Decoder = /** @class */ (function () {
    function Decoder(str) {
        this.str = str;
    }
    Decoder.prototype.isEnd = function () {
        return this.str.length == 0;
    };
    Decoder.prototype.readCharPair = function () {
        var res = this.str.substr(0, 2);
        this.str = this.str.slice(2);
        return res;
    };
    Decoder.prototype.readByte = function () {
        return parseInt(this.readCharPair(), 16);
    };
    Decoder.prototype.read = function (numBytes) {
        var res = this.str.substr(0, numBytes * 2);
        this.str = this.str.slice(numBytes * 2);
        return res;
    };
    Decoder.prototype.readString = function () {
        var len = this.readVarInt();
        return this.readStringBytes(len);
    };
    Decoder.prototype.readStringBytes = function (numBytes) {
        var res = "";
        for (var i = 0; i < numBytes; ++i) {
            res += String.fromCharCode(this.readByte());
        }
        return res;
    };
    Decoder.prototype.readByteArray = function () {
        var res;
        var length = this.readVarInt();
        if (length == 0)
            return [];
        res = this.read(length);
        return res;
    };
    Decoder.prototype.readSignature = function () {
        var kind = this.readByte();
        var signature = new tx_1.ISignature();
        var curve;
        signature.kind = kind;
        switch (kind) {
            case tx_1.SignatureKind.None: return null;
            case tx_1.SignatureKind.Ed25519:
                var len = this.readVarInt();
                signature.signature = this.read(len);
                break;
            case tx_1.SignatureKind.ECDSA:
                curve = this.readByte();
                signature.signature = this.readString();
                break;
            default:
                throw "read signature: " + kind;
        }
        return signature;
    };
    Decoder.prototype.readTimestamp = function () {
        //var len = this.readByte();
        var result = 0;
        var bytes = this.read(4);
        bytes.match(/.{1,2}/g)
            .reverse()
            .forEach(function (c) { return (result = result * 256 + parseInt(c, 16)); });
        return result;
    };
    Decoder.prototype.readVarInt = function () {
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
    Decoder.prototype.readBigInt = function () {
        // TO DO: implement negative numbers
        var len = this.readVarInt();
        var res = 0;
        var stringBytes = this.read(len);
        __spreadArray([], __read(stringBytes.match(/.{1,2}/g)), false).reverse()
            .forEach(function (c) { return (res = res * 256 + parseInt(c, 16)); });
        return res;
    };
    Decoder.prototype.readBigIntAccurate = function () {
        var len = this.readVarInt();
        var res = (0, big_integer_1.default)();
        var stringBytes = this.read(len);
        __spreadArray([], __read(stringBytes.match(/.{1,2}/g)), false).reverse().forEach(function (c) {
            res = res.times(256).plus(parseInt(c, 16));
        });
        return res.toString();
    };
    Decoder.prototype.readVmObject = function () {
        var type = this.readByte();
        console.log('type', type);
        switch (type) {
            case VMType_1.VMType.String:
                return this.readString();
            case VMType_1.VMType.Number:
                return this.readBigIntAccurate();
            case VMType_1.VMType.Bool:
                return this.readByte() != 0;
            case VMType_1.VMType.Struct:
                var numFields = this.readVarInt();
                var res = {};
                for (var i = 0; i < numFields; ++i) {
                    var key = this.readVmObject();
                    console.log('  key', key);
                    var value = this.readVmObject();
                    console.log('  value', value);
                    res[key] = value;
                }
                return res;
            case VMType_1.VMType.Enum:
                return this.readVarInt();
            case VMType_1.VMType.Object:
                var numBytes = this.readVarInt();
                return this.read(numBytes);
            default:
                return "unsupported type " + type;
        }
    };
    return Decoder;
}());
exports.Decoder = Decoder;
