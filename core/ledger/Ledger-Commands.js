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
exports.GetBalanceFromMnemonic = exports.GetBalanceFromPrivateKey = exports.SendTransactionLedger = exports.GetAddressFromLedeger = exports.GetBalanceFromLedger = exports.GetLedgerSignerData = exports.GetLedgerAccountSigner = exports.GetLedgerDeviceInfo = exports.ToWholeNumber = exports.LeftPad = void 0;
var __1 = require("..");
var tx_1 = require("../tx");
var types_1 = require("../types");
var Address_Transcode_1 = require("./Address-Transcode");
var Transaction_Sign_1 = require("./Transaction-Sign");
var Transaction_Transcode_1 = require("./Transaction-Transcode");
var Ledger_Utils_1 = require("./Ledger-Utils");
/**
 *
 * @param number
 * @param length
 * @returns
 */
var LeftPad = function (number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
};
exports.LeftPad = LeftPad;
/**
 *
 * @param balance
 * @param decimals
 * @returns
 */
var ToWholeNumber = function (balance, decimals) {
    if (balance === undefined) {
        throw Error('balance is a required parameter.');
    }
    if (decimals === undefined) {
        throw Error('decimals is a required parameter.');
    }
    // console.log('toWholeNumber', 'balance', balance);
    var paddedBalance = (0, exports.LeftPad)(balance, decimals + 1);
    // console.log('toWholeNumber', 'paddedBalance', paddedBalance);
    var prefixLength = paddedBalance.length - decimals;
    // console.log('toWholeNumber', 'prefixLength', prefixLength);
    var prefix = paddedBalance.slice(0, prefixLength);
    // console.log('toWholeNumber', 'prefix', prefix);
    var suffix = paddedBalance.slice(-decimals);
    // console.log('toWholeNumber', 'suffix', suffix);
    return "".concat(prefix, ".").concat(suffix);
};
exports.ToWholeNumber = ToWholeNumber;
/**
 * Get the device info from the ledger.
 * @param config
 * @returns
 */
var GetLedgerDeviceInfo = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var version, applicationName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (config == undefined) {
                    throw Error('config is a required parameter.');
                }
                return [4 /*yield*/, (0, Ledger_Utils_1.GetVersion)(config.Transport)];
            case 1:
                version = _a.sent();
                return [4 /*yield*/, (0, Ledger_Utils_1.GetApplicationName)(config.Transport)];
            case 2:
                applicationName = _a.sent();
                return [2 /*return*/, {
                        version: version,
                        applicationName: applicationName,
                    }];
        }
    });
}); };
exports.GetLedgerDeviceInfo = GetLedgerDeviceInfo;
/**
 * Get Ledger Account Signer
 * @param config
 * @param accountIx
 * @returns
 */
var GetLedgerAccountSigner = function (config, accountIx) { return __awaiter(void 0, void 0, void 0, function () {
    var paths, accountData, signer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                /* istanbul ignore if */
                if (config === undefined) {
                    throw Error('config is a required parameter.');
                }
                /* istanbul ignore if */
                if (accountIx === undefined) {
                    throw Error('accountIx is a required parameter.');
                }
                return [4 /*yield*/, config.Transport.list()];
            case 1:
                paths = _a.sent();
                console.log('paths', paths);
                if (paths.length == 0) {
                    alert('NUmber of devices found:' + paths.length);
                    return [2 /*return*/];
                }
                return [4 /*yield*/, GetLedgerSignerData(config, {
                        verifyOnDevice: false,
                        debug: true,
                    })];
            case 2:
                accountData = _a.sent();
                signer = {
                    GetPublicKey: function () {
                        return accountData.publicKey;
                    },
                    GetAccount: function () {
                        return accountData.address;
                    },
                };
                return [2 /*return*/, signer];
        }
    });
}); };
exports.GetLedgerAccountSigner = GetLedgerAccountSigner;
/**
 * GetLedgerSignerData
 * @param config
 * @param options
 * @returns
 */
function GetLedgerSignerData(config, options) {
    return __awaiter(this, void 0, void 0, function () {
        var msg, response, publicKey, address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (config == undefined) {
                        throw Error('config is a required parameter.');
                    }
                    if (options == undefined) {
                        throw Error('options is a required parameter.');
                    }
                    return [4 /*yield*/, (0, Ledger_Utils_1.GetPublicKey)(config.Transport, options)];
                case 1:
                    msg = _a.sent();
                    response = {
                        address: types_1.Address.Null,
                        publicKey: '',
                        success: false,
                        message: '',
                    };
                    response.success = false;
                    response.message = msg.message;
                    if (!msg.success) {
                        return [2 /*return*/, response];
                    }
                    publicKey = msg.publicKey;
                    address = (0, Address_Transcode_1.GetAddressPublicKeyFromPublicKey)(publicKey);
                    response.success = true;
                    response.message = 'success';
                    response.address = address;
                    response.publicKey = publicKey;
                    return [2 /*return*/, response];
            }
        });
    });
}
exports.GetLedgerSignerData = GetLedgerSignerData;
/**
 * GetBalanceFromLedger
 * @param config
 * @param options
 * @returns
 */
var GetBalanceFromLedger = function (config, options) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, response, publicKey, address, _a, _b, _c, rpcResponse;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                /* istanbul ignore if */
                if (config == undefined) {
                    throw Error('config is a required parameter.');
                }
                /* istanbul ignore if */
                if (options == undefined) {
                    throw Error('options is a required parameter.');
                }
                return [4 /*yield*/, (0, Ledger_Utils_1.GetPublicKey)(config.Transport, options)];
            case 1:
                msg = _d.sent();
                /* istanbul ignore if */
                if (config.Debug) {
                    console.log('getBalanceFromLedger', 'msg', msg);
                }
                response = {
                    address: types_1.Address.Null,
                    publicKey: '',
                    balances: new Map(),
                    success: false,
                    message: '',
                };
                response.message = msg.message;
                if (!msg.success) {
                    return [2 /*return*/, response];
                }
                publicKey = msg.publicKey;
                address = (0, Address_Transcode_1.GetAddressPublicKeyFromPublicKey)(publicKey);
                /* istanbul ignore if */
                if (config.Debug) {
                    console.log('address', address);
                    console.log('rpc', config.RPC);
                }
                _b = (_a = console).log;
                _c = ['rpcAwait'];
                return [4 /*yield*/, config.RPC.getAccount(address.Text)];
            case 2:
                _b.apply(_a, _c.concat([_d.sent()]));
                return [4 /*yield*/, config.RPC.getAccount(address.Text)];
            case 3:
                rpcResponse = _d.sent();
                if (config.Debug) {
                    console.log('rpcResponse', rpcResponse);
                }
                response.balances = new Map();
                if (rpcResponse.balances !== undefined) {
                    rpcResponse.balances.forEach(function (balanceElt) {
                        response.balances[balanceElt.symbol] = (0, exports.ToWholeNumber)(balanceElt.amount, balanceElt.decimals);
                    });
                }
                response.address = address;
                response.publicKey = publicKey;
                response.success = true;
                return [2 /*return*/, response];
        }
    });
}); };
exports.GetBalanceFromLedger = GetBalanceFromLedger;
/**
 * Get Addres from Ledger
 * @param config
 * @param options
 * @returns
 */
var GetAddressFromLedeger = function (config, options) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, publicKey, address;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                /* istanbul ignore if */
                if (config == undefined) {
                    throw Error('config is a required parameter.');
                }
                /* istanbul ignore if */
                if (options == undefined) {
                    throw Error('options is a required parameter.');
                }
                return [4 /*yield*/, (0, Ledger_Utils_1.GetPublicKey)(config.Transport, options)];
            case 1:
                msg = _a.sent();
                /* istanbul ignore if */
                if (config.Debug) {
                    console.log('getBalanceFromLedger', 'msg', msg);
                }
                if (msg.success) {
                    publicKey = msg.publicKey;
                    address = (0, Address_Transcode_1.GetAddressFromPublicKey)(publicKey);
                    return [2 /*return*/, address];
                }
                else {
                    return [2 /*return*/, msg];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.GetAddressFromLedeger = GetAddressFromLedeger;
/**
 *
 * @param encodedTx
 * @param config
 * @returns
 */
function SignEncodedTx(encodedTx, config) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, Ledger_Utils_1.SignLedger)(config.Transport, encodedTx)];
                case 1:
                    response = _a.sent();
                    /* istanbul ignore if */
                    if (config.Debug) {
                        console.log('sendAmountUsingLedger', 'signCallback', 'response', response);
                    }
                    if (response.success) {
                        return [2 /*return*/, response.signature];
                    }
                    else {
                        throw Error(response.message);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * SendTransactionLedger
 * @param config
 * @param script
 * @returns
 */
function SendTransactionLedger(config, script) {
    return __awaiter(this, void 0, void 0, function () {
        var options, msg_publicKey, addr, publicKey, nexusName, chainName, gasPrice, gasLimit, expirationDate, payload, myTransaction, encodedTx, signature, verifyResponse, signatureBytes, mySignature, myNewSignaturesArray, encodedSignedTx, txHash, response, error_1, errorResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (config == undefined) {
                        throw Error('config is a required parameter.');
                    }
                    options = { verifyOnDevice: false };
                    return [4 /*yield*/, (0, Ledger_Utils_1.GetPublicKey)(config.Transport, options)];
                case 1:
                    msg_publicKey = _a.sent();
                    if (!msg_publicKey.success) {
                        if (config.Debug) {
                            console.log('SendTransactionLedger', 'error ', msg_publicKey);
                        }
                        return [2 /*return*/, msg_publicKey];
                    }
                    addr = (0, Address_Transcode_1.GetAddressPublicKeyFromPublicKey)(msg_publicKey.publicKey);
                    publicKey = msg_publicKey.publicKey;
                    nexusName = config.NexusName;
                    chainName = config.ChainName;
                    gasPrice = config.GasPrice;
                    gasLimit = config.GasLimit;
                    expirationDate = (0, Transaction_Transcode_1.GetExpirationDate)();
                    payload = config.Payload;
                    myTransaction = new tx_1.Transaction(nexusName, // Nexus Name
                    chainName, // Chain
                    script, // In string format
                    expirationDate, // Expiration Date
                    payload);
                    encodedTx = types_1.Base16.encodeUint8Array(myTransaction.ToByteAray(false));
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    if (config.Debug) {
                        console.log('sendAmountUsingCallback', 'encodedTx', encodedTx);
                    }
                    return [4 /*yield*/, SignEncodedTx(encodedTx, config)];
                case 3:
                    signature = _a.sent();
                    if (config.Debug) {
                        console.log('sendAmountUsingCallback', 'signature', signature);
                    }
                    if (config.VerifyResponse) {
                        verifyResponse = (0, Transaction_Sign_1.Verify)(encodedTx, signature, publicKey);
                        if (verifyResponse == false) {
                            throw Error("invalidSignature encodedTx:'".concat(encodedTx, "', publicKey:'").concat(publicKey, "' signature:'").concat(signature, "'"));
                        }
                        if (config.Debug) {
                            console.log('verifyResponse', verifyResponse);
                        }
                    }
                    signatureBytes = types_1.Base16.decodeUint8Array(signature);
                    mySignature = new types_1.Ed25519Signature(signatureBytes);
                    myNewSignaturesArray = [];
                    myNewSignaturesArray.push(mySignature);
                    myTransaction.signatures = myNewSignaturesArray;
                    if (config.Debug) {
                        console.log('signedTx', myTransaction);
                    }
                    encodedSignedTx = types_1.Base16.encodeUint8Array(myTransaction.ToByteAray(true));
                    console.log('encoded signed tx: ', encodedSignedTx);
                    return [4 /*yield*/, config.RPC.sendRawTransaction(encodedSignedTx)];
                case 4:
                    txHash = _a.sent();
                    if (config.Debug) {
                        console.log('sendAmountUsingCallback', 'txHash', txHash);
                    }
                    response = {
                        success: true,
                        message: txHash,
                    };
                    /* istanbul ignore if */
                    if (config.Debug) {
                        console.log('response', response);
                    }
                    return [2 /*return*/, response];
                case 5:
                    error_1 = _a.sent();
                    if (config.Debug) {
                        console.log('error', error_1);
                    }
                    errorResponse = {
                        success: false,
                        message: error_1.message,
                    };
                    return [2 /*return*/, errorResponse];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.SendTransactionLedger = SendTransactionLedger;
/**
 *
 * @param config
 * @param privateKey
 * @returns
 */
var GetBalanceFromPrivateKey = function (config, privateKey) { return __awaiter(void 0, void 0, void 0, function () {
    var publicKey, address, rpcResponse, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                /* istanbul ignore if */
                if (config == undefined) {
                    throw Error('config is a required parameter.');
                }
                /* istanbul ignore if */
                if (privateKey == undefined) {
                    throw Error('privateKey is a required parameter.');
                }
                /* istanbul ignore if */
                if (config.Debug) {
                    console.log('privateKey', privateKey);
                }
                publicKey = (0, Transaction_Sign_1.GetPublicFromPrivate)(privateKey);
                /* istanbul ignore if */
                if (config.Debug) {
                    console.log('publicKey', publicKey);
                }
                address = (0, Address_Transcode_1.GetAddressFromPublicKey)(publicKey);
                /* istanbul ignore if */
                if (config.Debug) {
                    console.log('address', address);
                }
                return [4 /*yield*/, config.RPC.getAccount(address)];
            case 1:
                rpcResponse = _a.sent();
                if (config.Debug) {
                    console.log('rpcResponse', rpcResponse);
                }
                response.balances = new Map();
                if (rpcResponse.balances !== undefined) {
                    rpcResponse.balances.forEach(function (balanceElt) {
                        response.balances[balanceElt.symbol] = (0, exports.ToWholeNumber)(balanceElt.amount, balanceElt.decimals);
                    });
                }
                response.address = types_1.Address.FromText(address);
                response.success = true;
                // const lastRefPath = `/transaction/last-ref/${address}`;
                // const lastRefResponse = await httpRequestUtil.get(config, lastRefPath);
                // response.lastRef = lastRefResponse;
                return [2 /*return*/, response];
        }
    });
}); };
exports.GetBalanceFromPrivateKey = GetBalanceFromPrivateKey;
/**
 *
 * @param config
 * @param mnemonic
 * @param index
 * @returns
 */
var GetBalanceFromMnemonic = function (config, mnemonic, index) { return __awaiter(void 0, void 0, void 0, function () {
    var privateKey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                /* istanbul ignore if */
                if (config == undefined) {
                    throw Error('config is a required parameter.');
                }
                /* istanbul ignore if */
                if (mnemonic == undefined) {
                    throw Error('mnemonic is a required parameter.');
                }
                /* istanbul ignore if */
                if (index == undefined) {
                    throw Error('index is a required parameter.');
                }
                /* istanbul ignore if */
                if (config.Debug) {
                    console.log('mnemonic', mnemonic);
                }
                privateKey = (0, __1.GetPrivateKeyFromMnemonic)(config, mnemonic, index);
                return [4 /*yield*/, (0, exports.GetBalanceFromPrivateKey)(config, privateKey)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.GetBalanceFromMnemonic = GetBalanceFromMnemonic;
