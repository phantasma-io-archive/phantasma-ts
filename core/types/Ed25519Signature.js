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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ed25519Signature = void 0;
var Signature_1 = require("../interfaces/Signature");
var elliptic_1 = require("elliptic");
var utils_1 = require("../utils");
var Extensions_1 = require("./Extensions");
var ed25519 = new elliptic_1.eddsa("ed25519");
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
        writer.writeString((0, utils_1.uint8ArrayToString)(this.Bytes));
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
        //const msgHashHex = Buffer.from(message, "hex");
        var msgHashHex = (0, utils_1.uint8ArrayToString)(message);
        //const privateKeyBuffer = Buffer.from( keypair.PrivateKey, "hex");
        var privateKeyBuffer = (0, utils_1.uint8ArrayToString)(keypair.PrivateKey);
        var sign = ed25519.sign(msgHashHex, privateKeyBuffer);
        return new Ed25519Signature(sign.toBytes());
    };
    return Ed25519Signature;
}());
exports.Ed25519Signature = Ed25519Signature;
