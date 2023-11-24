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
exports.hex2ascii = exports.bigIntToByteArray = exports.numberToByteArray = exports.uint8ArrayToHex = exports.uint8ArrayToBytes = exports.arrayNumberToUint8Array = exports.hexStringToUint8Array = exports.stringToUint8Array = exports.uint8ArrayToNumberArray = exports.uint8ArrayToStringDefault = exports.uint8ArrayToString = exports.encodeBase16 = exports.decodeBase16 = exports.getDifficulty = exports.reverseHex = exports.BytesToHex = exports.byteArrayToHex = exports.hexStringToBytes = exports.bufferToHex = exports.hexToBuffer = exports.HexToBytes = exports.hexToByteArray = void 0;
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
function HexToBytes(hex) {
    return hexToByteArray(hex);
}
exports.HexToBytes = HexToBytes;
function hexToBuffer(hex) {
    return new Uint8Array(hexToByteArray(hex));
}
exports.hexToBuffer = hexToBuffer;
function bufferToHex(buffer) {
    return byteArrayToHex(buffer);
}
exports.bufferToHex = bufferToHex;
function hexStringToBytes(hexString) {
    for (var bytes = [], c = 0; c < hexString.length; c += 2)
        bytes.push(parseInt(hexString.substr(c, 2), 16));
    return bytes;
}
exports.hexStringToBytes = hexStringToBytes;
function byteArrayToHex(arr) {
    var e_1, _a;
    if (typeof arr !== "object") {
        throw new Error("ba2hex expects an array.Input was ".concat(arr));
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
function BytesToHex(bytes) {
    return byteArrayToHex(bytes);
}
exports.BytesToHex = BytesToHex;
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
    return str
        .split("")
        .map(function (c) { return c.charCodeAt(0).toString(16).padStart(2, "0"); })
        .join("")
        .toUpperCase();
}
exports.encodeBase16 = encodeBase16;
function uint8ArrayToString(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
        result += String.fromCharCode(array[i]);
    }
    return result;
}
exports.uint8ArrayToString = uint8ArrayToString;
function uint8ArrayToStringDefault(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
        result += array[i].toString(16);
    }
    return result;
}
exports.uint8ArrayToStringDefault = uint8ArrayToStringDefault;
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
function hexStringToUint8Array(str) {
    var result = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        result[i] = str.charCodeAt(i).toString(16).charCodeAt(0);
    }
    return result;
}
exports.hexStringToUint8Array = hexStringToUint8Array;
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
function uint8ArrayToHex(arr) {
    var hexString = "";
    for (var i = 0; i < arr.length; i++) {
        hexString += arr[i].toString(16).padStart(2, "0");
    }
    return hexString;
}
exports.uint8ArrayToHex = uint8ArrayToHex;
function numberToByteArray(num, size) {
    if (size === undefined) {
        if (num < 0xfd) {
            size = 1;
        }
        else if (num <= 0xfffd) {
            size = 2;
        }
        else if (num <= 0xffffd) {
            size = 3;
        }
        else if (num <= 0xfffffffd) {
            size = 4;
        }
        else if (num <= 0xffffffff) {
            size = 5;
        }
        else if (num <= 0xffffffffffffffff) {
            size = 9;
        }
    }
    var bytes = new Uint8Array(size);
    var i = 0;
    do {
        bytes[i++] = num & 0xff;
        num = num >> 8;
    } while (num);
    return bytes;
}
exports.numberToByteArray = numberToByteArray;
function bigIntToByteArray(bigint) {
    // Get a big-endian byte representation of the bigint
    var bytes = bigint.toString(16).padStart(64, "0");
    var byteArray = new Uint8Array(bytes.length / 2);
    for (var i = 0; i < bytes.length; i += 2) {
        byteArray[i / 2] = parseInt(bytes.substring(i, i + 2), 16);
    }
    return byteArray;
}
exports.bigIntToByteArray = bigIntToByteArray;
var hex2ascii = function (hexx) {
    var hex = hexx.toString();
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        var char = hex.substr(i, 2);
        var charCode = String.fromCharCode(parseInt(char, 16));
        // console.log('char', char, 'charCode', charCode);
        str += charCode;
    }
    return str;
};
exports.hex2ascii = hex2ascii;
