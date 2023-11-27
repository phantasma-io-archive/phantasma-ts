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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAddressPublicKeyFromPublicKey = exports.GetAddressFromPublicKey = exports.GetAddressFromPrivateKey = void 0;
var bs58 = __importStar(require("bs58"));
var types_1 = require("../types");
/**
 * Gets the address from a private key.
 * @param privateKey The private key as a string.
 * @returns The address as a string.
 */
var GetAddressFromPrivateKey = function (privateKey) {
    var keys = types_1.PhantasmaKeys.fromWIF(privateKey);
    var publicKey = keys.Address.Text;
    return publicKey;
};
exports.GetAddressFromPrivateKey = GetAddressFromPrivateKey;
/**
 * Gets the address from a public key.
 * @param publicKey The public key as a string.
 * @returns The address as a string.
 */
var GetAddressFromPublicKey = function (publicKey) {
    // Assuming Base16.decodeUint8Array is a function that decodes a base16 string to Uint8Array
    var pubKeyBytes = types_1.Base16.decodeUint8Array(publicKey);
    // Create a new array and set the first two elements
    var addrArray = new Uint8Array(34);
    addrArray[0] = 1;
    // Copy 32 bytes from the 2nd position of pubKeyBytes to addrArray, starting from the 3rd position of addrArray
    addrArray.set(pubKeyBytes.slice(0, 32), 2);
    return 'P' + bs58.encode(addrArray);
};
exports.GetAddressFromPublicKey = GetAddressFromPublicKey;
/**
 * Gets the address from a public key.
 * @param publicKey Public key as a string.
 * @returns Address
 */
var GetAddressPublicKeyFromPublicKey = function (publicKey) {
    var pubKeyBytes = types_1.Base16.decodeUint8Array(publicKey);
    // Create a new array and set the first two elements
    var addrArray = new Uint8Array(34);
    addrArray[0] = 1;
    // Copy 32 bytes from the 2nd position of pubKeyBytes to addrArray, starting from the 3rd position of addrArray
    addrArray.set(pubKeyBytes.slice(0, 32), 2);
    return types_1.Address.FromPublickKey(addrArray);
};
exports.GetAddressPublicKeyFromPublicKey = GetAddressPublicKeyFromPublicKey;
