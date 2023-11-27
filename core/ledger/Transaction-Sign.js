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
exports.GetPublicFromPrivate = exports.Verify = exports.Sign = exports.GetHash = exports.SignBytes = exports.PublicToPem = exports.PublicToDer = exports.PrivateToDer = void 0;
var crypto = __importStar(require("crypto"));
var PUBLIC_KEY_PREFIX = '302A300506032B6570032100';
var DEBUG = false;
var PrivateToDer = function (privateKeyHex) {
    if (DEBUG) {
        console.log('privateToDer', 'privateKeyHex', privateKeyHex);
    }
    var derHex = "302e020100300506032b657004220420".concat(privateKeyHex);
    if (DEBUG) {
        console.log('privateToDer', 'derHex', derHex);
    }
    return Buffer.from(derHex, 'hex');
};
exports.PrivateToDer = PrivateToDer;
var PublicToDer = function (publicKeyHex) {
    var publicKeyDerHex = "".concat(PUBLIC_KEY_PREFIX).concat(publicKeyHex);
    return Buffer.from(publicKeyDerHex, 'hex');
};
exports.PublicToDer = PublicToDer;
var PublicToPem = function (publicKeyHex) {
    var publicKeyDer = (0, exports.PublicToDer)(publicKeyHex);
    var publicKeyDerBase64 = publicKeyDer.toString('base64');
    return "-----BEGIN PUBLIC KEY-----\n".concat(publicKeyDerBase64, "\n-----END PUBLIC KEY-----");
};
exports.PublicToPem = PublicToPem;
var SignBytes = function (hash, privateKey) {
    if (DEBUG) {
        console.log('signBytes.hash', hash);
        console.log('signBytes.privateKey', privateKey);
    }
    var privateKeyDer = (0, exports.PrivateToDer)(privateKey.toString('hex'));
    if (DEBUG) {
        console.log('signBytes.privateKeyDer', privateKeyDer);
    }
    var privateKeyObj = crypto.createPrivateKey({
        key: privateKeyDer,
        format: 'der',
        type: 'pkcs8',
    });
    var signature = crypto.sign(undefined, hash, privateKeyObj);
    var signatureHex = signature.toString('hex');
    if (DEBUG) {
        console.log('signatureHex', signatureHex);
    }
    return signatureHex;
};
exports.SignBytes = SignBytes;
var GetHash = function (encodedTx, debug) {
    return Buffer.from(encodedTx, 'hex');
};
exports.GetHash = GetHash;
var Sign = function (encodedTx, privateKeyHex) {
    if (DEBUG) {
        console.log('sign', 'encodedTx', encodedTx);
    }
    var privateKey = Buffer.from(privateKeyHex, 'hex');
    if (DEBUG) {
        console.log('sign', 'privateKey', privateKey.toString('hex'));
    }
    var hash = (0, exports.GetHash)(encodedTx);
    if (DEBUG) {
        console.log('sign', 'hash', hash.toString('hex'));
    }
    var signature = (0, exports.SignBytes)(hash, privateKey);
    if (DEBUG) {
        console.log('sign', 'signature', signature);
    }
    return signature.toLowerCase();
};
exports.Sign = Sign;
var Verify = function (encodedTx, signatureHex, publicKeyHex) {
    if (DEBUG) {
        console.log('verify', 'encodedTx', encodedTx);
        console.log('verify', 'signatureHex', signatureHex);
        console.log('verify', 'publicKeyHex', publicKeyHex);
    }
    var publicKeyPem = (0, exports.PublicToPem)(publicKeyHex);
    if (DEBUG) {
        console.log('verify', 'publicKeyPem', publicKeyPem);
    }
    var publicKeyObj = crypto.createPublicKey({
        key: publicKeyPem,
        format: 'pem',
        type: 'spki',
    });
    var signature = Buffer.from(signatureHex, 'hex');
    var hash = (0, exports.GetHash)(encodedTx);
    if (DEBUG) {
        console.log('verify', 'hash', hash.toString('hex'));
    }
    return crypto.verify(undefined, hash, publicKeyObj, signature);
};
exports.Verify = Verify;
var GetPublicFromPrivate = function (privateKey) {
    var privateKeyDer = (0, exports.PrivateToDer)(privateKey);
    var privateKeyObj = crypto.createPrivateKey({
        key: privateKeyDer,
        format: 'der',
        type: 'pkcs8',
    });
    var privateKeyString = privateKeyObj.export({ format: 'der', type: 'pkcs8' });
    /*const publicKeyObj = crypto.createPublicKey({
      key: privateKeyObj,
      format: 'pem',
      type: 'sec1',
    });*/
    var publicKeyObj = crypto.createPublicKey({
        key: privateKeyString,
        format: 'pem',
        type: 'spki',
    });
    var encodedHex = publicKeyObj
        .export({ format: 'der', type: 'spki' })
        .toString('hex')
        .toUpperCase();
    if (encodedHex.startsWith(PUBLIC_KEY_PREFIX)) {
        return encodedHex.substring(PUBLIC_KEY_PREFIX.length);
    }
    else {
        throw new Error("unknown prefix, expecting '".concat(PUBLIC_KEY_PREFIX, "' cannot decode public key '").concat(encodedHex, "'"));
    }
};
exports.GetPublicFromPrivate = GetPublicFromPrivate;
