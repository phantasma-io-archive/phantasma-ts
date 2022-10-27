"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
var elliptic_1 = require("elliptic");
var vm_1 = require("../vm");
var utils_1 = require("../utils");
var enc_hex_1 = __importDefault(require("crypto-js/enc-hex"));
var sha256_1 = __importDefault(require("crypto-js/sha256"));
var curve = new elliptic_1.eddsa("ed25519");
var Transaction = /** @class */ (function () {
    function Transaction(nexusName, chainName, script, sender, gasPayer, gasTarget, gasPrice, gasLimit, version, expiration, payload) {
        this.nexusName = nexusName;
        this.chainName = chainName;
        this.script = script;
        this.sender = sender;
        this.gasPayer = gasPayer;
        this.gasTarget = gasTarget;
        this.gasPrice = gasPrice;
        this.gasLimit = gasLimit;
        this.version = version;
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
                console.log("adding signature ", sig);
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
    Transaction.prototype.getHash = function () {
        var generatedHash = (0, sha256_1.default)(enc_hex_1.default.parse(this.toString(false)));
        this.hash = (0, utils_1.byteArrayToHex)((0, utils_1.hexStringToBytes)(generatedHash.toString(enc_hex_1.default)).reverse());
        return this.hash;
    };
    Transaction.prototype.mineTransaction = function (difficulty) {
        if (difficulty < 0 || difficulty > 256) {
            console.log("Error adding difficulty");
            return;
        }
        var nonce = 0;
        var deepCopy = new Transaction(JSON.parse(JSON.stringify(this.nexusName)), JSON.parse(JSON.stringify(this.chainName)), JSON.parse(JSON.stringify(this.version)), JSON.parse(JSON.stringify(this.script)), JSON.parse(JSON.stringify(this.sender)), JSON.parse(JSON.stringify(this.gasPayer)), JSON.parse(JSON.stringify(this.gasTarget)), JSON.parse(JSON.stringify(this.gasPrice)), JSON.parse(JSON.stringify(this.gasLimit)), this.expiration, JSON.parse(JSON.stringify(this.payload)));
        var payload = Buffer.alloc(4);
        while (true) {
            if ((0, utils_1.getDifficulty)(deepCopy.getHash()) >= difficulty) {
                this.payload = deepCopy.payload;
                console.log('It took ' + nonce + ' iterations to get a difficulty of >' + difficulty);
                return;
            }
            nonce++;
            payload[0] = ((nonce >> 0) & 0xFF);
            payload[1] = ((nonce >> 8) & 0xFF);
            payload[2] = ((nonce >> 16) & 0xFF);
            payload[3] = ((nonce >> 24) & 0xFF);
            deepCopy.payload = (0, utils_1.byteArrayToHex)(payload);
        }
    };
    Transaction.prototype.getSign = function (msgHex, privateKey) {
        var msgHashHex = Buffer.from(msgHex, "hex");
        var privateKeyBuffer = Buffer.from(privateKey, "hex");
        var sig = curve.sign(msgHashHex, privateKeyBuffer);
        return sig.toHex();
    };
    return Transaction;
}());
exports.Transaction = Transaction;
