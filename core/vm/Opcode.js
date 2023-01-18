"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Opcode = void 0;
var Opcode;
(function (Opcode) {
    Opcode[Opcode["NOP"] = 0] = "NOP";
    // register
    Opcode[Opcode["MOVE"] = 1] = "MOVE";
    Opcode[Opcode["COPY"] = 2] = "COPY";
    Opcode[Opcode["PUSH"] = 3] = "PUSH";
    Opcode[Opcode["POP"] = 4] = "POP";
    Opcode[Opcode["SWAP"] = 5] = "SWAP";
    // flow
    Opcode[Opcode["CALL"] = 6] = "CALL";
    Opcode[Opcode["EXTCALL"] = 7] = "EXTCALL";
    Opcode[Opcode["JMP"] = 8] = "JMP";
    Opcode[Opcode["JMPIF"] = 9] = "JMPIF";
    Opcode[Opcode["JMPNOT"] = 10] = "JMPNOT";
    Opcode[Opcode["RET"] = 11] = "RET";
    Opcode[Opcode["THROW"] = 12] = "THROW";
    // data
    Opcode[Opcode["LOAD"] = 13] = "LOAD";
    Opcode[Opcode["CAST"] = 14] = "CAST";
    Opcode[Opcode["CAT"] = 15] = "CAT";
    Opcode[Opcode["RANGE"] = 16] = "RANGE";
    Opcode[Opcode["LEFT"] = 17] = "LEFT";
    Opcode[Opcode["RIGHT"] = 18] = "RIGHT";
    Opcode[Opcode["SIZE"] = 19] = "SIZE";
    Opcode[Opcode["COUNT"] = 20] = "COUNT";
    // logical
    Opcode[Opcode["NOT"] = 21] = "NOT";
    Opcode[Opcode["AND"] = 22] = "AND";
    Opcode[Opcode["OR"] = 23] = "OR";
    Opcode[Opcode["XOR"] = 24] = "XOR";
    Opcode[Opcode["EQUAL"] = 25] = "EQUAL";
    Opcode[Opcode["LT"] = 26] = "LT";
    Opcode[Opcode["GT"] = 27] = "GT";
    Opcode[Opcode["LTE"] = 28] = "LTE";
    Opcode[Opcode["GTE"] = 29] = "GTE";
    // numeric
    Opcode[Opcode["INC"] = 30] = "INC";
    Opcode[Opcode["DEC"] = 31] = "DEC";
    Opcode[Opcode["SIGN"] = 32] = "SIGN";
    Opcode[Opcode["NEGATE"] = 33] = "NEGATE";
    Opcode[Opcode["ABS"] = 34] = "ABS";
    Opcode[Opcode["ADD"] = 35] = "ADD";
    Opcode[Opcode["SUB"] = 36] = "SUB";
    Opcode[Opcode["MUL"] = 37] = "MUL";
    Opcode[Opcode["DIV"] = 38] = "DIV";
    Opcode[Opcode["MOD"] = 39] = "MOD";
    Opcode[Opcode["SHL"] = 40] = "SHL";
    Opcode[Opcode["SHR"] = 41] = "SHR";
    Opcode[Opcode["MIN"] = 42] = "MIN";
    Opcode[Opcode["MAX"] = 43] = "MAX";
    Opcode[Opcode["POW"] = 44] = "POW";
    // context
    Opcode[Opcode["CTX"] = 45] = "CTX";
    Opcode[Opcode["SWITCH"] = 46] = "SWITCH";
    // array
    Opcode[Opcode["PUT"] = 47] = "PUT";
    Opcode[Opcode["GET"] = 48] = "GET";
    Opcode[Opcode["CLEAR"] = 49] = "CLEAR";
    Opcode[Opcode["UNPACK"] = 50] = "UNPACK";
    Opcode[Opcode["PACK"] = 51] = "PACK";
    //  debugger
    Opcode[Opcode["DEBUG"] = 52] = "DEBUG";
    // add
    Opcode[Opcode["SUBSTR"] = 53] = "SUBSTR";
})(Opcode = exports.Opcode || (exports.Opcode = {}));
