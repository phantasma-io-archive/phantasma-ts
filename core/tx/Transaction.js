"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
var elliptic_1 = require("elliptic");
var vm_1 = require("../vm");
var curve = new elliptic_1.eddsa("ed25519");
var Transaction = /** @class */ (function () {
    function Transaction(nexusName, chainName, script, expiration, payload) {
        this.nexusName = nexusName;
        this.chainName = chainName;
        this.script = script;
        this.expiration = expiration;
        this.payload = payload == null || payload == "" ? "7068616e7461736d612d7473" : payload;
        this.signatures = [];
    }
    Transaction.prototype.sign = function (privateKey) {
        var signature = this.getSign(this.toString(false), privateKey);
        this.signatures.unshift({ signature: signature, kind: 1 });
    };
    Transaction.prototype.toString = function (withSignature) {
        var utc = Date.UTC(this.expiration.getUTCFullYear(), this.expiration.getUTCMonth(), this.expiration.getUTCDate(), this.expiration.getUTCHours(), this.expiration.getUTCMinutes(), this.expiration.getUTCSeconds());
        var num = utc / 1000;
        var a = (num & 0xff000000) >> 24;
        var b = (num & 0x00ff0000) >> 16;
        var c = (num & 0x0000ff00) >> 8;
        var d = num & 0x000000ff;
        var expirationBytes = [d, c, b, a];
        var sb = new vm_1.ScriptBuilder()
            .emitVarString(this.nexusName)
            .emitVarString(this.chainName)
            .emitVarInt(this.script.length / 2)
            .appendHexEncoded(this.script)
            .emitBytes(expirationBytes)
            .emitVarInt(this.payload.length / 2)
            .appendHexEncoded(this.payload);
        if (withSignature) {
            sb.emitVarInt(this.signatures.length);
            this.signatures.forEach(function (sig) {
                //console.log("adding signature ", sig);
                if (sig.kind == 1) {
                    sb.appendByte(1); // Signature Type
                    sb.emitVarInt(sig.signature.length / 2);
                    sb.appendHexEncoded(sig.signature);
                }
                else if (sig.kind == 2) {
                    sb.appendByte(2); // ECDSA Signature
                    sb.appendByte(1); // Curve type secp256k1
                    sb.emitVarInt(sig.signature.length / 2);
                    sb.appendHexEncoded(sig.signature);
                }
            });
        }
        return sb.str;
    };
    //public addPOW(targetDifficulty: Number){
    //}
    Transaction.prototype.getSign = function (msgHex, privateKey) {
        var msgHashHex = Buffer.from(msgHex, "hex");
        var privateKeyBuffer = Buffer.from(privateKey, "hex");
        var sig = curve.sign(msgHashHex, privateKeyBuffer);
        return sig.toHex();
    };
    return Transaction;
}());
exports.Transaction = Transaction;
