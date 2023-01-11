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
        return crypto_1.default.randomBytes(targetLength);
    };
    return Entropy;
}());
exports.Entropy = Entropy;
