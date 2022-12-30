"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureKind = void 0;
var SignatureKind;
(function (SignatureKind) {
    SignatureKind[SignatureKind["None"] = 0] = "None";
    SignatureKind[SignatureKind["Ed25519"] = 1] = "Ed25519";
    SignatureKind[SignatureKind["ECDSA"] = 2] = "ECDSA";
})(SignatureKind = exports.SignatureKind || (exports.SignatureKind = {}));
