"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entropy = void 0;
var Entropy = /** @class */ (function () {
    function Entropy() {
    }
    //private static rnd = crypto.randomBytes(24);
    Entropy.GetRandomBytes = function (targetLength) {
        var rnd = new Uint8Array(targetLength);
        return this.ToBuffer(self.crypto.getRandomValues(rnd).buffer);
    };
    Entropy.ToBuffer = function (ab) {
        var buf = Buffer.alloc(ab.byteLength);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            buf[i] = view[i];
        }
        return buf;
    };
    return Entropy;
}());
exports.Entropy = Entropy;
