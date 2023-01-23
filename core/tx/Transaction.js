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
var types_1 = require("../types");
var utils_2 = require("./utils");
var curve = new elliptic_1.eddsa("ed25519");
var Transaction = /** @class */ (function () {
    function Transaction(nexusName, chainName, script, expiration, payload) {
        this.nexusName = nexusName;
        this.chainName = chainName;
        this.script = script;
        this.expiration = expiration;
        this.payload =
            payload == null || payload == "" ? "7068616e7461736d612d7473" : payload;
        this.signatures = [];
    }
    Transaction.FromBytes = function (serializedData) {
        var transaction = new Transaction("", "", "", new Date(), "");
        return transaction.unserialize(serializedData);
    };
    Transaction.prototype.sign = function (privateKey) {
        var _keys = types_1.PhantasmaKeys.fromWIF((0, utils_2.getWifFromPrivateKey)(privateKey));
        var msg = this.ToByteAray(false);
        var sig = _keys.Sign(msg);
        var sigs = [];
        if (this.signatures != null && this.signatures.length > 0) {
            sigs = this.signatures;
        }
        sigs.push(sig);
        this.signatures = sigs;
        //const signature = this.getSign(this.toString(false), privateKey);
        //this.signatures.unshift({ signature, kind: 1 });
    };
    Transaction.prototype.signWithKeys = function (keys) {
        var msg = this.ToByteAray(false);
        var sig = keys.Sign(msg);
        var sigs = [];
        if (this.signatures != null && this.signatures.length > 0) {
            sigs = this.signatures;
        }
        sigs.push(sig);
        this.signatures = sigs;
    };
    Transaction.prototype.ToByteAray = function (withSignature) {
        var writer = new types_1.PBinaryWriter();
        writer.writeString(this.nexusName);
        writer.writeString(this.chainName);
        writer.writeByteArray((0, utils_1.stringToUint8Array)(this.script));
        writer.writeDateTime(this.expiration);
        writer.writeByteArray((0, utils_1.stringToUint8Array)(this.payload));
        if (withSignature) {
            writer.writeVarInt(this.signatures.length);
            this.signatures.forEach(function (sig) {
                writer.writeSignature(sig);
                //writer.writeByte(sig.kind);
                //writer.writeByteArray(stringToUint8Array(sig.signature));
            });
        }
        return writer.toUint8Array();
    };
    Transaction.prototype.UnserializeData = function (reader) {
        this.nexusName = reader.readString();
        this.chainName = reader.readString();
        this.script = (0, utils_1.uint8ArrayToHex)(reader.readByteArray());
        this.expiration = new Date(reader.readTimestamp().value);
        this.payload = (0, utils_1.uint8ArrayToHex)(reader.readByteArray());
        var sigCount = reader.readVarInt();
        for (var i = 0; i < sigCount; i++) {
            var sig = reader.readSignature();
            this.signatures.push(sig);
        }
    };
    Transaction.prototype.SerializeData = function (writer) {
        writer.writeString(this.nexusName);
        writer.writeString(this.chainName);
        writer.writeByteArray((0, utils_1.stringToUint8Array)(this.script));
        writer.writeDateTime(this.expiration);
        writer.writeByteArray((0, utils_1.stringToUint8Array)(this.payload));
        writer.writeVarInt(this.signatures.length);
        this.signatures.forEach(function (sig) {
            writer.writeSignature(sig);
        });
    };
    Transaction.prototype.toString = function (withSignature) {
        /*const utc = Date.UTC(
          this.expiration.getUTCFullYear(),
          this.expiration.getUTCMonth(),
          this.expiration.getUTCDate(),
          this.expiration.getUTCHours(),
          this.expiration.getUTCMinutes(),
          this.expiration.getUTCSeconds()
        );
        let num = utc / 1000;
    
        let a = (num & 0xff000000) >> 24;
        let b = (num & 0x00ff0000) >> 16;
        let c = (num & 0x0000ff00) >> 8;
        let d = num & 0x000000ff;
    
        let expirationBytes = [d, c, b, a];*/
        var sb = new vm_1.ScriptBuilder()
            .EmitVarString(this.nexusName)
            .EmitVarString(this.chainName)
            .EmitVarInt(this.script.length / 2)
            .AppendHexEncoded(this.script)
            .EmitTimestamp(this.expiration)
            .EmitVarInt(this.payload.length / 2)
            .AppendHexEncoded(this.payload);
        if (withSignature) {
            sb.EmitVarInt(this.signatures.length);
            this.signatures.forEach(function (sig) {
                console.log("adding signature ", sig);
                if (sig.Kind == 1) {
                    sb.AppendByte(1); // Signature Type
                    sb.EmitVarInt(sig.Bytes.length / 2);
                    sb.AppendHexEncoded((0, utils_1.uint8ArrayToHex)(sig.Bytes));
                }
                else if (sig.Kind == 2) {
                    sb.AppendByte(2); // ECDSA Signature
                    sb.AppendByte(1); // Curve type secp256k1
                    sb.EmitVarInt(sig.Bytes.length / 2);
                    sb.AppendHexEncoded((0, utils_1.uint8ArrayToHex)(sig.Bytes));
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
        var deepCopy = new Transaction(JSON.parse(JSON.stringify(this.nexusName)), JSON.parse(JSON.stringify(this.chainName)), JSON.parse(JSON.stringify(this.script)), this.expiration, JSON.parse(JSON.stringify(this.payload)));
        var payload = Buffer.alloc(4);
        while (true) {
            if ((0, utils_1.getDifficulty)(deepCopy.getHash()) >= difficulty) {
                this.payload = deepCopy.payload;
                console.log("It took " +
                    nonce +
                    " iterations to get a difficulty of >" +
                    difficulty);
                return;
            }
            nonce++;
            payload[0] = (nonce >> 0) & 0xff;
            payload[1] = (nonce >> 8) & 0xff;
            payload[2] = (nonce >> 16) & 0xff;
            payload[3] = (nonce >> 24) & 0xff;
            deepCopy.payload = (0, utils_1.byteArrayToHex)(payload);
        }
    };
    Transaction.prototype.getSign = function (msgHex, privateKey) {
        var msgHashHex = Buffer.from(msgHex, "hex");
        var privateKeyBuffer = Buffer.from(privateKey, "hex");
        var sig = curve.sign(msgHashHex, privateKeyBuffer);
        return sig.toHex();
    };
    Transaction.prototype.unserialize = function (serializedData) {
        var dec = new vm_1.Decoder(serializedData);
        var nexusName = dec.readString();
        var chainName = dec.readString();
        var scriptLength = dec.readVarInt();
        var script = dec.read(scriptLength);
        var date = new Date(dec.readTimestamp() * 1000);
        var payloadLength = dec.readVarInt();
        var payload = dec.read(payloadLength);
        var nTransaction = new Transaction(nexusName, chainName, script, date, payload);
        var signatureCount = dec.readVarInt();
        /*for (let i = 0; i < signatureCount; i++) {
          nTransaction.signatures.push(dec.readSignature());
        }*/
        return nTransaction;
    };
    return Transaction;
}());
exports.Transaction = Transaction;
