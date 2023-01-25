"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base16 = void 0;
var Base16 = /** @class */ (function () {
    function Base16() {
    }
    Base16.encode = function (str) {
        if (!str)
            return "";
        return str
            .split("")
            .map(function (c) { return c.charCodeAt(0).toString(16).padStart(2, "0"); })
            .join("")
            .toUpperCase();
    };
    Base16.encodeUint8Array = function (arr) {
        return Array.from(arr)
            .map(function (c) { return c.toString(16).padStart(2, "0"); })
            .join("")
            .toUpperCase();
    };
    Base16.decode = function (str) {
        var _a, _b;
        if (!str || str.length % 2 !== 0)
            return "";
        return ((_b = (_a = str
            .match(/.{1,2}/g)) === null || _a === void 0 ? void 0 : _a.map(function (c) { return String.fromCharCode(parseInt(c, 16)); }).join("")) !== null && _b !== void 0 ? _b : "");
    };
    return Base16;
}());
exports.Base16 = Base16;
