"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Describer = void 0;
var Describer = /** @class */ (function () {
    function Describer() {
    }
    Describer.describe = function (val, parent) {
        if (parent === void 0) { parent = false; }
        var result = [];
        if (parent) {
            var proto = Object.getPrototypeOf(val.prototype);
            if (proto) {
                result = result.concat(this.describe(proto.constructor, parent));
            }
        }
        result = result.concat(val.toString().match(this.FRegEx) || []);
        return result;
    };
    Describer.FRegEx = new RegExp(/(?:this\.)(.+?(?= ))/g);
    return Describer;
}());
exports.Describer = Describer;
