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
exports.EasyScript = void 0;
var vm_1 = require("../vm");
var EasyScript = /** @class */ (function () {
    function EasyScript(_minimumFee, _gasLimit) {
        if (_minimumFee === void 0) { _minimumFee = '100000'; }
        if (_gasLimit === void 0) { _gasLimit = '900'; }
        //Default Gas Profile
        this.minimumFee = _minimumFee;
        this.gasLimit = _gasLimit;
    }
    EasyScript.prototype.createScript = function (_type, _options) {
        if (_options === void 0) { _options = [null]; }
        return __awaiter(this, void 0, void 0, function () {
            var accountAddressInteract, contractNameInteract, methodNameInteract, inputArgumentsInteract, contractNameInvoke, methodNameInvoke, inputArgumentsInvoke, accountAddressInterop, interopNameInterop, inputArgumentsInterop;
            return __generator(this, function (_a) {
                this.sb = new vm_1.ScriptBuilder();
                switch (_type) {
                    case 'interact':
                        accountAddressInteract = _options[0];
                        contractNameInteract = _options[1];
                        methodNameInteract = _options[2];
                        inputArgumentsInteract = _options[3];
                        return [2 /*return*/, (this.sb
                                .callContract('gas', 'AllowGas', [accountAddressInteract, this.sb.nullAddress, this.minimumFee, this.gasLimit]) //Just for good measure
                                .callContract(contractNameInteract, methodNameInteract, inputArgumentsInteract) //The Meat of the Script
                                .callContract('gas', 'SpendGas', [accountAddressInteract]) //Just for good measure (optional)
                                .endScript())];
                        break;
                    case 'invoke':
                        contractNameInvoke = _options[0];
                        methodNameInvoke = _options[1];
                        inputArgumentsInvoke = _options[2];
                        return [2 /*return*/, (this.sb
                                .callContract(contractNameInvoke, methodNameInvoke, inputArgumentsInvoke) //The Meat of the Script
                                .endScript())];
                        break;
                    case 'interop':
                        accountAddressInterop = _options[0];
                        interopNameInterop = _options[1];
                        inputArgumentsInterop = _options[2];
                        return [2 /*return*/, (this.sb
                                .callContract('gas', 'AllowGas', [accountAddressInterop, this.sb.nullAddress, this.minimumFee, this.gasLimit]) //Just for good measure
                                .callInterop(interopNameInterop, inputArgumentsInterop)
                                .callContract('gas', 'SpendGas', [accountAddressInterop]) //Just for good measure (optional)
                                .endScript())];
                        break;
                }
                return [2 /*return*/];
            });
        });
    };
    return EasyScript;
}());
exports.EasyScript = EasyScript;
