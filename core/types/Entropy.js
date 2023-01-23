"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entropy = void 0;
var crypto_1 = __importDefault(require("crypto"));
var Entropy = /** @class */ (function () {
    function Entropy() {
    }
    //private static rnd = crypto.randomBytes(24);
    Entropy.GetRandomBytes = function (targetLength) {
        var rnd = new Uint8Array(targetLength);
        var privateKey = Buffer.alloc(rnd.byteLength);
        crypto_1.default.getRandomValues(rnd);
        for (var i = 0; i < 32; ++i) {
            privateKey.writeUInt8(rnd[i], i);
        }
        //let pk = this.ToBuffer(rnd);
        return privateKey;
    };
    return Entropy;
}());
exports.Entropy = Entropy;
