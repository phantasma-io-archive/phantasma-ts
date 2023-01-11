"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenSeriesMode = exports.TokenFlags = void 0;
var TokenFlags;
(function (TokenFlags) {
    TokenFlags[TokenFlags["None"] = 0] = "None";
    TokenFlags[TokenFlags["Transferable"] = 1] = "Transferable";
    TokenFlags[TokenFlags["Fungible"] = 2] = "Fungible";
    TokenFlags[TokenFlags["Finite"] = 4] = "Finite";
    TokenFlags[TokenFlags["Divisible"] = 8] = "Divisible";
    TokenFlags[TokenFlags["Fuel"] = 16] = "Fuel";
    TokenFlags[TokenFlags["Stakable"] = 32] = "Stakable";
    TokenFlags[TokenFlags["Fiat"] = 64] = "Fiat";
    TokenFlags[TokenFlags["Swappable"] = 128] = "Swappable";
    TokenFlags[TokenFlags["Burnable"] = 256] = "Burnable";
    TokenFlags[TokenFlags["Mintable"] = 512] = "Mintable";
})(TokenFlags = exports.TokenFlags || (exports.TokenFlags = {}));
var TokenSeriesMode;
(function (TokenSeriesMode) {
    TokenSeriesMode[TokenSeriesMode["Unique"] = 0] = "Unique";
    TokenSeriesMode[TokenSeriesMode["Duplicated"] = 1] = "Duplicated";
})(TokenSeriesMode = exports.TokenSeriesMode || (exports.TokenSeriesMode = {}));
