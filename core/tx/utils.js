"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyData = exports.signData = exports.getWifFromPrivateKey = exports.generateNewWif = exports.generateNewSeedWords = exports.generateNewSeed = exports.getPublicKeyFromPrivateKey = exports.getAddressFromWif = exports.getPrivateKeyFromWif = void 0;
var wif_1 = __importDefault(require("wif"));
var elliptic_1 = __importDefault(require("elliptic"));
var bs58_1 = __importDefault(require("bs58"));
var bip39 = __importStar(require("bip39"));
var crypto_1 = __importDefault(require("crypto"));
var eddsa = elliptic_1.default.eddsa;
var curve = new eddsa("ed25519");
function ab2hexstring(arr) {
    var e_1, _a;
    if (typeof arr !== "object") {
        throw new Error("ab2hexstring expects an array.Input was ".concat(arr));
    }
    var result = "";
    var intArray = new Uint8Array(arr);
    try {
        for (var intArray_1 = __values(intArray), intArray_1_1 = intArray_1.next(); !intArray_1_1.done; intArray_1_1 = intArray_1.next()) {
            var i = intArray_1_1.value;
            var str = i.toString(16);
            str = str.length === 0 ? "00" : str.length === 1 ? "0" + str : str;
            result += str;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (intArray_1_1 && !intArray_1_1.done && (_a = intArray_1.return)) _a.call(intArray_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
function getPrivateKeyFromWif(wif) {
    return ab2hexstring(wif_1.default.decode(wif, 128).privateKey);
}
exports.getPrivateKeyFromWif = getPrivateKeyFromWif;
function getAddressFromWif(wif) {
    var curve = new eddsa("ed25519");
    var privateKey = getPrivateKeyFromWif(wif);
    var privateKeyBuffer = Buffer.from(privateKey, "hex");
    var publicKey = curve.keyFromSecret(privateKeyBuffer).getPublic("hex");
    var addressHex = Buffer.from("0100" + publicKey, "hex");
    return "P" + bs58_1.default.encode(addressHex);
}
exports.getAddressFromWif = getAddressFromWif;
function getPublicKeyFromPrivateKey(privateKey) {
    var privateKeyBuffer = Buffer.from(privateKey, "hex");
    var publicKey = curve.keyFromSecret(privateKeyBuffer).getPublic("hex");
    return publicKey;
}
exports.getPublicKeyFromPrivateKey = getPublicKeyFromPrivateKey;
function generateNewSeed() {
    var buffer = new Uint8Array(32);
    var privateKey = Buffer.alloc(32);
    crypto_1.default.getRandomValues(buffer);
    for (var i = 0; i < 32; ++i) {
        privateKey.writeUInt8(buffer[i], i);
    }
    var wif = wif_1.default.encode(128, privateKey, true);
    var mnemonic = bip39.generateMnemonic();
    return mnemonic;
}
exports.generateNewSeed = generateNewSeed;
function generateNewSeedWords() {
    var buffer = new Uint8Array(32);
    var privateKey = Buffer.alloc(32);
    crypto_1.default.getRandomValues(buffer);
    for (var i = 0; i < 32; ++i) {
        privateKey.writeUInt8(buffer[i], i);
    }
    var wif = wif_1.default.encode(128, privateKey, true);
    var mnemonic = bip39.generateMnemonic();
    var seedWords = mnemonic.split(" ");
    return seedWords;
}
exports.generateNewSeedWords = generateNewSeedWords;
function generateNewWif() {
    var buffer = new Uint8Array(32);
    var privateKey = Buffer.alloc(32);
    crypto_1.default.getRandomValues(buffer);
    for (var i = 0; i < 32; ++i) {
        privateKey.writeUInt8(buffer[i], i);
    }
    var wif = wif_1.default.encode(128, privateKey, true);
    return wif;
}
exports.generateNewWif = generateNewWif;
function getWifFromPrivateKey(privateKey) {
    var privateKeyBuffer = Buffer.from(privateKey, "hex");
    var wif = wif_1.default.encode(128, privateKeyBuffer, true);
    return wif;
}
exports.getWifFromPrivateKey = getWifFromPrivateKey;
function signData(msgHex, privateKey) {
    var msgHashHex = Buffer.from(msgHex, "hex");
    var privateKeyBuffer = Buffer.from(privateKey, "hex");
    var sig = curve.sign(msgHashHex, privateKeyBuffer);
    var numBytes = sig.toBytes().length;
    return ("01" + (numBytes < 16 ? "0" : "") + numBytes.toString(16) + sig.toHex());
}
exports.signData = signData;
function verifyData(msgHex, phaSig, address) {
    var msgBytes = Buffer.from(msgHex, "hex");
    var realSig = phaSig.substring(4);
    var pubKey = bs58_1.default.decode(address.substring(1)).slice(2);
    return curve.verify(msgBytes, realSig, pubKey.toString("hex"));
}
exports.verifyData = verifyData;
