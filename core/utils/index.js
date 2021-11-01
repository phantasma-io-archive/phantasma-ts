"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseHex = exports.byteArrayToHex = exports.hexToByteArray = void 0;
function hexToByteArray(hexBytes) {
    var res = [hexBytes.length / 2];
    for (var i = 0; i < hexBytes.length; i += 2) {
        var hexdig = hexBytes.substr(i, 2);
        if (hexdig == "") {
            res.push(0);
        }
        else
            res.push(parseInt(hexdig, 16));
    }
    return res;
}
exports.hexToByteArray = hexToByteArray;
function byteArrayToHex(arr) {
    var e_1, _a;
    if (typeof arr !== "object") {
        throw new Error("ba2hex expects an array.Input was " + arr);
    }
    var result = "";
    var intArray = new Uint8Array(arr);
    try {
        for (var intArray_1 = __values(intArray), intArray_1_1 = intArray_1.next(); !intArray_1_1.done; intArray_1_1 = intArray_1.next()) {
            var i = intArray_1_1.value;
            var str = i.toString(16);
            str = str.length === 0 ? "00" : str.length === 1 ? "0" + str : str;
            result += str;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (intArray_1_1 && !intArray_1_1.done && (_a = intArray_1.return)) _a.call(intArray_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
exports.byteArrayToHex = byteArrayToHex;
function reverseHex(hex) {
    var out = "";
    for (var i = hex.length - 2; i >= 0; i -= 2) {
        out += hex.substr(i, 2);
    }
    return out;
}
exports.reverseHex = reverseHex;
