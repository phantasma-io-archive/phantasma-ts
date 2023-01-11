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
exports.uint8ArrayToBytes = exports.arrayNumberToUint8Array = exports.stringToUint8Array = exports.uint8ArrayToNumberArray = exports.uint8ArrayToString = exports.encodeBase16 = exports.decodeBase16 = exports.getDifficulty = exports.reverseHex = exports.byteArrayToHex = exports.hexStringToBytes = exports.hexToByteArray = void 0;
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
function hexStringToBytes(hexString) {
    for (var bytes = [], c = 0; c < hexString.length; c += 2)
        bytes.push(parseInt(hexString.substr(c, 2), 16));
    return bytes;
}
exports.hexStringToBytes = hexStringToBytes;
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
function getDifficulty(transactionHash) {
    var bytes = hexStringToBytes(transactionHash).reverse();
    var result = 0;
    for (var i = 0; i < bytes.length; i++) {
        var n = bytes[i];
        for (var j = 0; j < 8; j++) {
            if ((bytes[i] & (1 << j)) != 0) {
                result = 1 + (i << 3) + j;
            }
        }
    }
    return 256 - result;
}
exports.getDifficulty = getDifficulty;
function decodeBase16(hex) {
    var str = "";
    for (var i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}
exports.decodeBase16 = decodeBase16;
function encodeBase16(str) {
    return str.split("")
        .map(function (c) { return c.charCodeAt(0).toString(16).padStart(2, "0"); })
        .join("");
}
exports.encodeBase16 = encodeBase16;
function uint8ArrayToString(array) {
    var result = '';
    for (var i = 0; i < array.length; i++) {
        result += String.fromCharCode(array[i]);
    }
    return result;
}
exports.uint8ArrayToString = uint8ArrayToString;
function uint8ArrayToNumberArray(array) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
        result.push(array[i]);
    }
    return result;
}
exports.uint8ArrayToNumberArray = uint8ArrayToNumberArray;
function stringToUint8Array(str) {
    var result = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        result[i] = str.charCodeAt(i);
    }
    return result;
}
exports.stringToUint8Array = stringToUint8Array;
function arrayNumberToUint8Array(arr) {
    var result = new Uint8Array(arr.length);
    for (var i = 0; i < arr.length; i++) {
        result[i] = arr[i];
    }
    return result;
}
exports.arrayNumberToUint8Array = arrayNumberToUint8Array;
function uint8ArrayToBytes(array) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
        result.push(array[i]);
    }
    return result;
}
exports.uint8ArrayToBytes = uint8ArrayToBytes;
