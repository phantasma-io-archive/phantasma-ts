"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash256 = exports.hash160 = exports.ripemd160 = exports.sha256 = void 0;
var enc_hex_1 = __importDefault(require("crypto-js/enc-hex"));
var ripemd160_1 = __importDefault(require("crypto-js/ripemd160"));
var sha256_1 = __importDefault(require("crypto-js/sha256"));
function hash(hex, hashingFunction) {
    var hexEncoded = enc_hex_1.default.parse(hex);
    var result = hashingFunction(hexEncoded);
    return result.toString(enc_hex_1.default);
}
/**
 * Performs a single SHA256.
 */
function sha256(hex) {
    return hash(hex, sha256_1.default);
}
exports.sha256 = sha256;
/**
 * Performs a single RIPEMD160.
 */
function ripemd160(hex) {
    return hash(hex, ripemd160_1.default);
}
exports.ripemd160 = ripemd160;
/**
 * Performs a SHA256 followed by a RIPEMD160.
 */
function hash160(hex) {
    var sha = sha256(hex);
    return ripemd160(sha);
    // const hexEncoded = safeParseHex(hex);
    // const ProgramSha256 = SHA256(hexEncoded);
    // return RIPEMD160(ProgramSha256.toString()).toString();
}
exports.hash160 = hash160;
/**
 * Performs 2 SHA256.
 */
function hash256(hex) {
    var firstSha = sha256(hex);
    return sha256(firstSha);
    // const hexEncoded = safeParseHex(hex);
    // const ProgramSha256 = SHA256(hexEncoded);
    // return SHA256(ProgramSha256).toString();
}
exports.hash256 = hash256;
