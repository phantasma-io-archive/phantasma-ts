"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptBuilder = void 0;
var Opcode_1 = require("./Opcode");
var VMType_1 = require("./VMType");
var MaxRegisterCount = 32;
var Nexus;
(function (Nexus) {
    Nexus["GasContractName"] = "gas";
    Nexus["BlockContractName"] = "block";
    Nexus["StakeContractName"] = "stake";
    Nexus["SwapContractName"] = "swap";
    Nexus["AccountContractName"] = "account";
    Nexus["ConsensusContractName"] = "consensus";
    Nexus["GovernanceContractName"] = "governance";
    Nexus["StorageContractName"] = "storage";
    Nexus["ValidatorContractName"] = "validator";
    Nexus["InteropContractName"] = "interop";
    Nexus["ExchangeContractName"] = "exchange";
    Nexus["PrivacyContractName"] = "privacy";
    Nexus["RelayContractName"] = "relay";
    Nexus["RankingContractName"] = "ranking";
})(Nexus || (Nexus = {}));
var ScriptBuilder = /** @class */ (function () {
    function ScriptBuilder() {
        this._labelLocations = {};
        this._jumpLocations = {};
        this.nullAddress = "S1111111111111111111111111111111111";
        this.str = "";
    }
    ScriptBuilder.prototype.beginScript = function () {
        this.str = "";
    };
    ScriptBuilder.prototype.getScript = function () {
        return this.str;
    };
    ScriptBuilder.prototype.endScript = function () {
        this.emit(Opcode_1.Opcode.RET);
        return this.str;
    };
    ScriptBuilder.prototype.emit = function (opcode, bytes) {
        this.appendByte(opcode);
        if (bytes) {
            this.emitBytes(bytes);
        }
        return this;
    };
    ScriptBuilder.prototype.emitPush = function (reg) {
        this.emit(Opcode_1.Opcode.PUSH);
        this.appendByte(reg);
        return this;
    };
    ScriptBuilder.prototype.emitPop = function (reg) {
        this.emit(Opcode_1.Opcode.POP);
        this.appendByte(reg);
        return this;
    };
    ScriptBuilder.prototype.emitExtCall = function (method, reg) {
        if (reg === void 0) { reg = 0; }
        this.emitLoad(reg, method);
        this.emit(Opcode_1.Opcode.EXTCALL);
        this.appendByte(reg);
        return this;
    };
    ScriptBuilder.prototype.rawString = function (value) {
        var data = [];
        for (var i = 0; i < value.length; i++) {
            data.push(value.charCodeAt(i));
        }
        return data;
    };
    ScriptBuilder.prototype.emitLoad = function (reg, obj) {
        switch (typeof obj) {
            case "string": {
                var bytes = this.rawString(obj);
                this.emitLoadBytes(reg, bytes, VMType_1.VMType.String);
                break;
            }
            case "boolean": {
                var bytes = [obj ? 1 : 0];
                this.emitLoadBytes(reg, bytes, VMType_1.VMType.Bool);
                break;
            }
            case "number": {
                // obj is BigInteger
                // var bytes = val.ToSignedByteArray();
                // this.emitLoadBytes(reg, bytes, VMType.Number);
                var bytes = this.rawString(BigInt(obj).toString());
                this.emitLoadBytes(reg, bytes, VMType_1.VMType.String);
                break;
            }
            case "object":
                if (Array.isArray(obj)) {
                    this.emitLoadBytes(reg, obj);
                }
                else if (obj instanceof Date) {
                    this.emitLoadTimestamp(reg, obj);
                }
                else
                    throw Error("Load type " + typeof obj + " not supported");
                break;
            default:
                throw Error("Load type " + typeof obj + " not supported");
        }
        return this;
    };
    ScriptBuilder.prototype.emitLoadBytes = function (reg, bytes, type) {
        if (type === void 0) { type = VMType_1.VMType.Bytes; }
        if (bytes.length > 0xffff)
            throw new Error("tried to load too much data");
        this.emit(Opcode_1.Opcode.LOAD);
        this.appendByte(reg);
        this.appendByte(type);
        this.emitVarInt(bytes.length);
        this.emitBytes(bytes);
        return this;
    };
    ScriptBuilder.prototype.emitLoadEnum = function (reg, enumVal) {
        // var temp = Convert.ToUInt32(enumVal);
        // var bytes = BitConverter.GetBytes(temp);
        var bytes = [0, 0, 0, 0];
        for (var i = 0; i < bytes.length; i++) {
            var byte = enumVal & 0xff;
            bytes[i] = byte;
            enumVal = (enumVal - byte) / 256;
        }
        this.emitLoadBytes(reg, bytes, VMType_1.VMType.Enum);
        return this;
    };
    ScriptBuilder.prototype.emitLoadTimestamp = function (reg, obj) {
        var num = (obj.getTime() + obj.getTimezoneOffset() * 60 * 1000) / 1000;
        var a = (num & 0xff000000) >> 24;
        var b = (num & 0x00ff0000) >> 16;
        var c = (num & 0x0000ff00) >> 8;
        var d = num & 0x000000ff;
        var bytes = [d, c, b, a];
        this.emitLoadBytes(reg, bytes, VMType_1.VMType.Timestamp);
        return this;
    };
    ScriptBuilder.prototype.emitMove = function (src_reg, dst_reg) {
        this.emit(Opcode_1.Opcode.MOVE);
        this.appendByte(src_reg);
        this.appendByte(dst_reg);
        return this;
    };
    ScriptBuilder.prototype.emitCopy = function (src_reg, dst_reg) {
        this.emit(Opcode_1.Opcode.COPY);
        this.appendByte(src_reg);
        this.appendByte(dst_reg);
        return this;
    };
    ScriptBuilder.prototype.emitLabel = function (label) {
        this.emit(Opcode_1.Opcode.NOP);
        this._labelLocations[label] = this.str.length;
        return this;
    };
    ScriptBuilder.prototype.emitJump = function (opcode, label, reg) {
        if (reg === void 0) { reg = 0; }
        switch (opcode) {
            case Opcode_1.Opcode.JMP:
            case Opcode_1.Opcode.JMPIF:
            case Opcode_1.Opcode.JMPNOT:
                this.emit(opcode);
                break;
            default:
                throw new Error("Invalid jump opcode: " + opcode);
        }
        if (opcode != Opcode_1.Opcode.JMP) {
            this.appendByte(reg);
        }
        var ofs = this.str.length;
        this.appendUshort(0);
        this._jumpLocations[ofs] = label;
        return this;
    };
    ScriptBuilder.prototype.emitCall = function (label, regCount) {
        if (regCount < 1 || regCount > MaxRegisterCount) {
            throw new Error("Invalid number of registers");
        }
        var ofs = this.str.length; //(int)stream.Position;
        ofs += 2;
        this.emit(Opcode_1.Opcode.CALL);
        this.appendByte(regCount);
        this.appendUshort(0);
        this._jumpLocations[ofs] = label;
        return this;
    };
    ScriptBuilder.prototype.emitConditionalJump = function (opcode, src_reg, label) {
        if (opcode != Opcode_1.Opcode.JMPIF && opcode != Opcode_1.Opcode.JMPNOT) {
            throw new Error("Opcode is not a conditional jump");
        }
        var ofs = this.str.length;
        ofs += 2;
        this.emit(opcode);
        this.appendByte(src_reg);
        this.appendUshort(0);
        this._jumpLocations[ofs] = label;
        return this;
    };
    ScriptBuilder.prototype.insertMethodArgs = function (args) {
        var temp_reg = 0;
        for (var i = args.length - 1; i >= 0; i--) {
            var arg = args[i];
            this.emitLoad(temp_reg, arg);
            this.emitPush(temp_reg);
        }
    };
    ScriptBuilder.prototype.callInterop = function (method, args) {
        this.insertMethodArgs(args);
        var dest_reg = 0;
        this.emitLoad(dest_reg, method);
        this.emit(Opcode_1.Opcode.EXTCALL, [dest_reg]);
        return this;
    };
    ScriptBuilder.prototype.callContract = function (contractName, method, args) {
        this.insertMethodArgs(args);
        var temp_reg = 0;
        this.emitLoad(temp_reg, method);
        this.emitPush(temp_reg);
        var src_reg = 0;
        var dest_reg = 1;
        this.emitLoad(src_reg, contractName);
        this.emit(Opcode_1.Opcode.CTX, [src_reg, dest_reg]);
        this.emit(Opcode_1.Opcode.SWITCH, [dest_reg]);
        return this;
    };
    //#region ScriptBuilderExtensions
    ScriptBuilder.prototype.allowGas = function (from, to, gasPrice, gasLimit) {
        return this.callContract(Nexus.GasContractName, "AllowGas", [
            from,
            to,
            gasPrice,
            gasLimit,
        ]);
    };
    ScriptBuilder.prototype.spendGas = function (address) {
        return this.callContract(Nexus.GasContractName, "SpendGas", [address]);
    };
    ScriptBuilder.prototype.callRPC = function (methodName, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, "bla"];
            });
        });
    };
    ScriptBuilder.prototype.getAddressTransactionCount = function (address, chainInput) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [address, chainInput];
                        return [4 /*yield*/, this.callRPC("getAddressTransactionCount", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //#endregion
    ScriptBuilder.prototype.emitVarString = function (text) {
        var bytes = this.rawString(text);
        this.emitVarInt(bytes.length);
        this.emitBytes(bytes);
        return this;
    };
    ScriptBuilder.prototype.emitVarInt = function (value) {
        if (value < 0)
            throw "negative value invalid";
        if (value < 0xfd) {
            this.appendByte(value);
        }
        else if (value <= 0xffff) {
            var B = (value & 0x0000ff00) >> 8;
            var A = value & 0x000000ff;
            // TODO check if the endianess is correct, might have to reverse order of appends
            this.appendByte(0xfd);
            this.appendByte(A);
            this.appendByte(B);
        }
        else if (value <= 0xffffffff) {
            var C = (value & 0x00ff0000) >> 16;
            var B = (value & 0x0000ff00) >> 8;
            var A = value & 0x000000ff;
            // TODO check if the endianess is correct, might have to reverse order of appends
            this.appendByte(0xfe);
            this.appendByte(A);
            this.appendByte(B);
            this.appendByte(C);
        }
        else {
            var D = (value & 0xff000000) >> 24;
            var C = (value & 0x00ff0000) >> 16;
            var B = (value & 0x0000ff00) >> 8;
            var A = value & 0x000000ff;
            // TODO check if the endianess is correct, might have to reverse order of appends
            this.appendByte(0xff);
            this.appendByte(A);
            this.appendByte(B);
            this.appendByte(C);
            this.appendByte(D);
        }
        return this;
    };
    ScriptBuilder.prototype.emitBytes = function (bytes) {
        for (var i = 0; i < bytes.length; i++)
            this.appendByte(bytes[i]);
        // writer.Write(bytes);
        return this;
    };
    ScriptBuilder.prototype.byteToHex = function (byte) {
        var result = ('0' + (byte & 0xFF).toString(16)).slice(-2);
        return result;
    };
    ScriptBuilder.prototype.appendByte = function (byte) {
        this.str += this.byteToHex(byte);
    };
    ScriptBuilder.prototype.appendBytes = function (bytes) {
        for (var i = 0; i < bytes.length; i++) {
            this.appendByte(bytes[i]);
        }
    };
    ScriptBuilder.prototype.appendUshort = function (ushort) {
        this.str +=
            this.byteToHex(ushort & 0xff) + this.byteToHex((ushort >> 8) & 0xff);
    };
    ScriptBuilder.prototype.appendHexEncoded = function (bytes) {
        this.str += bytes;
        return this;
    };
    return ScriptBuilder;
}());
exports.ScriptBuilder = ScriptBuilder;
