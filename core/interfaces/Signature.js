"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = exports.ISignature = exports.SignatureKind = void 0;
var types_1 = require("../types");
var SignatureKind;
(function (SignatureKind) {
    SignatureKind[SignatureKind["None"] = 0] = "None";
    SignatureKind[SignatureKind["Ed25519"] = 1] = "Ed25519";
    SignatureKind[SignatureKind["ECDSA"] = 2] = "ECDSA";
})(SignatureKind = exports.SignatureKind || (exports.SignatureKind = {}));
var ISignature = /** @class */ (function () {
    function ISignature() {
    }
    return ISignature;
}());
exports.ISignature = ISignature;
var Signature = /** @class */ (function () {
    function Signature() {
    }
    Signature.prototype.Verify = function (message, address) {
        return this.VerifyMultiple(message, [address]);
    };
    Signature.prototype.ToByteArray = function () {
        var stream = new Uint8Array(64);
        var writer = new types_1.PBinaryWriter(stream);
        this.SerializeData(writer);
        return new Uint8Array(stream);
    };
    return Signature;
}());
exports.Signature = Signature;
