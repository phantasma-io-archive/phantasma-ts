"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entropy = void 0;
var Entropy = /** @class */ (function () {
    function Entropy() {
    }
    //private static rnd = crypto.randomBytes(24);
    Entropy.GetRandomBytes = function (targetLength) {
        var crypto = require('crypto');
        return crypto.randomBytes(targetLength);
    };
    return Entropy;
}());
exports.Entropy = Entropy;
