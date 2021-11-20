"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    Transaction.prototype.getHash = function () {
        var generatedHash = (0, sha256_1.default)(enc_hex_1.default.parse(this.toString(false)));
        return (0, utils_1.byteArrayToHex)((0, utils_1.hexStringToBytes)(generatedHash.toString(enc_hex_1.default)).reverse());
    };
    Transaction.prototype.mineTransaction = function (difficulty) {
        return __awaiter(this, void 0, void 0, function () {
            var nonce, deepCopy, payload;
            return __generator(this, function (_a) {
                if (difficulty < 0 || difficulty > 256) {
                    console.log("Error adding difficulty");
                    return [2 /*return*/];
                }
                nonce = 0;
                deepCopy = new Transaction(JSON.parse(JSON.stringify(this.nexusName)), JSON.parse(JSON.stringify(this.chainName)), JSON.parse(JSON.stringify(this.script)), new Date(this.expiration), JSON.parse(JSON.stringify(this.payload)));
                payload = Buffer.alloc(4);
                while (true) {
                    if ((0, utils_1.getDifficulty)(deepCopy.toString(false)) >= difficulty) {
                        this.payload = deepCopy.payload;
                        console.log('It took ' + nonce + ' iterations to get a difficulty of ' + difficulty);
                        return [2 /*return*/];
                    }
                    nonce++;
                    payload[0] = ((nonce >> 0) & 0xFF);
                    payload[1] = ((nonce >> 8) & 0xFF);
                    payload[2] = ((nonce >> 16) & 0xFF);
                    payload[3] = ((nonce >> 24) & 0xFF);
                    deepCopy.payload = (0, utils_1.byteArrayToHex)(payload);
                }
                return [2 /*return*/];
            });
        });
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
