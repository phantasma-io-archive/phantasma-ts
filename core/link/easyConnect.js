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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.EasyConnect = void 0;
var phantasmaLink_1 = require("./phantasmaLink");
var easyScript_1 = require("./easyScript");
var EasyConnect = /** @class */ (function () {
    function EasyConnect(_options) {
        if (_options === void 0) { _options = null; }
        this.platform = "phantasma";
        this.providerHint = "poltergeist";
        this.script = new easyScript_1.EasyScript();
        this.link = new phantasmaLink_1.PhantasmaLink("easyConnect", false);
        this.connected = false;
        this.requiredVersion = 2;
        //Make This Auto In Future
        this.nexus = easyScript_1.Nexus.Mainnet;
        if (_options == null) {
            this.setConfig('auto');
        }
        else {
            try {
                this.requiredVersion = Number(_options[0]);
                this.platform = _options[1];
                this.providerHint = _options[2];
            }
            catch (error) {
                console.log(error);
            }
        }
        this.script = new easyScript_1.EasyScript();
    }
    EasyConnect.prototype.setConfig = function (_provider) {
        this.requiredVersion = 2;
        this.platform = "phantasma";
        switch (_provider) {
            case 'auto':
                // @ts-ignore
                if (!!window.PhantasmaLinkSocket == true) {
                    this.setConfig('ecto');
                }
                else {
                    this.providerHint = "";
                }
                break;
            case 'ecto':
                this.providerHint = "ecto";
                break;
            case 'poltergeist':
                this.providerHint = "poltergeist";
                break;
        }
    };
    EasyConnect.prototype.connect = function (onSuccess, onFail) {
        if (onSuccess === void 0) { onSuccess = function (data) { }; }
        if (onFail === void 0) { onFail = function (data) { console.log('%cError: ' + data, 'color:red'); }; }
        var that = this;
        this.link.login(function (data) {
            //Console Logging for Debugging Purposes
            if (data) {
                that.connected = true;
                onSuccess(data);
                console.log('%c[EasyConnect Connected]', 'color:green');
                console.log('Wallet Address \'' + that.link.account.address + '\' connected via ' + that.link.wallet);
            }
            else {
                onFail();
                console.log('EasyConnect could not connect to wallet');
            }
            ;
        }, onFail, this.requiredVersion, this.platform, this.providerHint);
    };
    EasyConnect.prototype.disconnect = function (_message) {
        if (_message === void 0) { _message = 'Graceful Disconect'; }
        this.link.disconnect(_message);
        this.connected = false;
    };
    EasyConnect.prototype.query = function (_type, _arguments, _callback) {
        if (_type === void 0) { _type = null; }
        if (_arguments === void 0) { _arguments = null; }
        if (_callback === void 0) { _callback = function (data) { console.log(data); }; }
        return __awaiter(this, void 0, void 0, function () {
            var account, name_1, balances, walletAddress, avatar;
            return __generator(this, function (_a) {
                if (this.connected == true) {
                    switch (_type) {
                        case 'account':
                            account = this.link.account;
                            _callback(account);
                            return [2 /*return*/, account];
                            break;
                        case 'name':
                            name_1 = this.link.account.name;
                            _callback(name_1);
                            return [2 /*return*/, name_1];
                            break;
                        case 'balances':
                            balances = this.link.account.balances;
                            _callback(balances);
                            return [2 /*return*/, balances];
                            break;
                        case 'walletAddress':
                            walletAddress = this.link.account.address;
                            _callback(walletAddress);
                            return [2 /*return*/, walletAddress];
                            break;
                        case 'avatar':
                            avatar = this.link.account.avatar;
                            _callback(avatar);
                            return [2 /*return*/, avatar];
                            break;
                        case 'tokenBalance':
                            //let token = _arguments[0];
                            //return this.link.accounts[]
                            break;
                    }
                }
                else {
                    console.log('%cWallet is not connected', 'color:red');
                }
                return [2 /*return*/];
            });
        });
    };
    EasyConnect.prototype.action = function (_type, _arguments, onSuccess, onFail) {
        if (_type === void 0) { _type = null; }
        if (_arguments === void 0) { _arguments = null; }
        if (onSuccess === void 0) { onSuccess = function (data) { }; }
        if (onFail === void 0) { onFail = function (data) { console.log('%cError: ' + data, 'color:red'); }; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, sendFTScript, sendNFTScript;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.connected == true)) return [3 /*break*/, 6];
                        _a = _type;
                        switch (_a) {
                            case 'sendFT': return [3 /*break*/, 1];
                            case 'sendNFT': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, this.script.buildScript('interop', ["Runtime.SendTokens", [_arguments[0], _arguments[1], _arguments[2], _arguments[3]]])];
                    case 2:
                        sendFTScript = _b.sent();
                        this.signTransaction(sendFTScript, null, onSuccess, onFail);
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.script.buildScript('interop', ["Runtime.SendTokens", [_arguments[0], _arguments[1], _arguments[2], _arguments[3]]])];
                    case 4:
                        sendNFTScript = _b.sent();
                        this.signTransaction(sendNFTScript, null, onSuccess, onFail);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        console.log('%cWallet is not connected', 'color:red');
                        _b.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    EasyConnect.prototype.signTransaction = function (script, payload, onSuccess, onFail) {
        if (payload === void 0) { payload = null; }
        if (onSuccess === void 0) { onSuccess = function (data) { }; }
        if (onFail === void 0) { onFail = function (data) { console.log('%cError: ' + data, 'color:red'); }; }
        this.link.signTx(script, payload, onSuccess, onFail);
    };
    EasyConnect.prototype.signData = function (data, onSuccess, onFail) {
        if (onSuccess === void 0) { onSuccess = function (data) { }; }
        if (onFail === void 0) { onFail = function (data) { console.log('%cError: ' + data, 'color:red'); }; }
        this.link.signData(data, onSuccess, onFail);
    };
    EasyConnect.prototype.invokeScript = function (script, _callback) {
        this.link.invokeScript(script, _callback);
    };
    EasyConnect.prototype.deployContract = function (script, payload, proofOfWork, onSuccess, onFail) {
        if (payload === void 0) { payload = null; }
        if (proofOfWork === void 0) { proofOfWork = phantasmaLink_1.ProofOfWork.Minimal; }
        if (onSuccess === void 0) { onSuccess = function (data) { }; }
        if (onFail === void 0) { onFail = function (data) { console.log('%cError: ' + data, 'color:red'); }; }
        this.link.signTx(script, payload, onSuccess, onFail, proofOfWork);
    };
    return EasyConnect;
}());
exports.EasyConnect = EasyConnect;
