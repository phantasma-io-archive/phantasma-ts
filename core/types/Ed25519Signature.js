"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ed25519Signature = void 0;
var Signature_1 = require("../interfaces/Signature");
var elliptic_1 = __importDefault(require("elliptic"));
var utils_1 = require("../utils");
var Extensions_1 = require("./Extensions");
var eddsa = elliptic_1.default.eddsa;
var ed25519 = new eddsa("ed25519");
var Ed25519Signature = /** @class */ (function () {
    function Ed25519Signature(bytes) {
        this.Kind = Signature_1.SignatureKind.Ed25519;
        this.Bytes = bytes;
    }
    Ed25519Signature.prototype.Verify = function (message, address) {
        return this.VerifyMultiple(message, [address]);
    };
    Ed25519Signature.prototype.VerifyMultiple = function (message, addresses) {
        var e_1, _a;
        try {
            for (var addresses_1 = __values(addresses), addresses_1_1 = addresses_1.next(); !addresses_1_1.done; addresses_1_1 = addresses_1.next()) {
                var address = addresses_1_1.value;
                if (!address.IsUser) {
                    continue;
                }
                var pubKey = address.ToByteArray().slice(2);
                if (ed25519.verify((0, utils_1.uint8ArrayToString)(this.Bytes), (0, utils_1.uint8ArrayToString)(message), (0, utils_1.uint8ArrayToString)(pubKey))) {
                    return true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (addresses_1_1 && !addresses_1_1.done && (_a = addresses_1.return)) _a.call(addresses_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
    Ed25519Signature.prototype.SerializeData = function (writer) {
        //writer.writeString(uint8ArrayToString(this.Bytes));
        writer.writeByteArray(this.Bytes);
    };
    Ed25519Signature.prototype.UnserializeData = function (reader) {
        this.Bytes = (0, utils_1.stringToUint8Array)(reader.readString());
    };
    Ed25519Signature.prototype.ToByteArray = function () {
        var stream = new Uint8Array(64);
        var writer = new Extensions_1.PBinaryWriter(stream);
        this.SerializeData(writer);
        return new Uint8Array(stream);
    };
    Ed25519Signature.Generate = function (keypair, message) {
        var msgHashHex = Buffer.from((0, utils_1.uint8ArrayToHex)(message), "hex");
        //const msgHashHex = uint8ArrayToString(message);
        var privateKeyBuffer = Buffer.from((0, utils_1.uint8ArrayToHex)(keypair.PrivateKey), "hex");
        //const privateKeyBuffer = uint8ArrayToString(keypair.PrivateKey);
        var sign = ed25519.sign(msgHashHex, privateKeyBuffer);
        return new Ed25519Signature(sign.toBytes());
    };
    return Ed25519Signature;
}());
exports.Ed25519Signature = Ed25519Signature;
