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
exports.SignLedger = exports.decodeSignature = exports.splitMessageIntoChunks = exports.chunkString = exports.GetPublicKey = exports.GetBip44PathMessage = exports.GetVersion = exports.GetApplicationName = exports.GetDevice = exports.GetErrorMessage = exports.hex2ascii = exports.ErrorDescriptions = exports.Bip44Path = exports.MAX_SIGNED_TX_LEN = void 0;
exports.MAX_SIGNED_TX_LEN = 1024;
var Debug = true;
exports.Bip44Path = '8000002C' + // 44
    '8000003C' + // 60
    '80000000' + // 0
    '00000000' + // 0
    '00000000'; // 0
exports.ErrorDescriptions = {
    '530C': 'Unlock Ledger Device',
    '6D02': 'App Not Open On Ledger Device',
    6511: 'App Not Open On Ledger Device',
    '6E00': 'App Not Open On Ledger Device',
    '6A86': 'Incorrect Pip2',
    '6A87': 'Wrong Data Length',
    '6A88': 'No Data Length',
    '6A89': 'Wrong Main Data Length',
    '6A90': 'Incorrect Pip1',
    6985: 'Tx Denied on Ledger',
    '6D06': 'Tx Decoding Buffer Underflow',
    B000: 'Wrong response length on Ledger Device',
    B002: 'Failed to display Address on Ledger Device',
    B005: 'Failed to parse Transaction on Ledger Device',
    B008: 'Failed to sign Transaction on Ledger Device',
    B009: 'Wrong signing parmeters on Ledger Device',
};
var hex2ascii = function (hexx) {
    var hex = hexx.toString(); // force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
};
exports.hex2ascii = hex2ascii;
var int2buffer = function (i) {
    var hex = i.toString(16).toUpperCase();
    if (hex.length % 2 === 1) {
        hex = '0' + hex;
    }
    return Buffer.from(hex, 'hex');
};
var GetErrorMessage = function (responseStr) {
    var suffix = responseStr.slice(-4);
    if (exports.ErrorDescriptions[suffix] !== undefined) {
        var description = exports.ErrorDescriptions[suffix];
        return "[".concat(suffix, "] ").concat(responseStr, " ").concat(description);
    }
    else {
        return "[".concat(suffix, "] ").concat(responseStr, " Unknown Error");
    }
};
exports.GetErrorMessage = GetErrorMessage;
/**
 * Get Device
 * @param transport
 * @returns
 */
var GetDevice = function (transport) { return __awaiter(void 0, void 0, void 0, function () {
    var supported, list, path, device;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                /* istanbul ignore if */
                if (Debug) {
                    console.log('getDevice', 'transport', transport);
                }
                return [4 /*yield*/, transport.isSupported()];
            case 1:
                supported = _a.sent();
                /* istanbul ignore if */
                if (Debug) {
                    console.log('getDevice', 'supported', supported);
                }
                if (!supported) {
                    return [2 /*return*/, {
                            enabled: false,
                            error: true,
                            message: 'Your computer does not support the ledger device.',
                        }];
                }
                return [4 /*yield*/, transport.list()];
            case 2:
                list = _a.sent();
                /* istanbul ignore if */
                if (Debug) {
                    console.log('getDevice', 'list', list);
                }
                if (list.length == 0) {
                    return [2 /*return*/, {
                            enabled: false,
                            error: true,
                            message: 'No device connected.',
                        }];
                }
                path = list[0];
                /* istanbul ignore if */
                if (Debug) {
                    console.log('getDevice', 'path', path);
                }
                return [4 /*yield*/, transport.open(path)];
            case 3:
                device = _a.sent();
                /* istanbul ignore if */
                if (Debug) {
                    console.log('getDevice', 'device', device);
                }
                return [2 /*return*/, {
                        enabled: true,
                        error: false,
                        device: device,
                    }];
        }
    });
}); };
exports.GetDevice = GetDevice;
/**
 * Get Application Name
 * @param transport
 * @returns
 */
var GetApplicationName = function (transport) { return __awaiter(void 0, void 0, void 0, function () {
    var device, request, response, responseStr, success, message, applicationName, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.GetDevice)(transport)];
            case 1:
                device = _a.sent();
                if (!device.enabled) {
                    return [2 /*return*/, {
                            success: false,
                            message: 'Your computer does not support the ledger device.',
                        }];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, 5, 7]);
                request = Buffer.from('E004000000', 'hex');
                /* istanbul ignore if */
                if (Debug) {
                    console.log('exchange', 'request', request.toString('hex').toUpperCase());
                }
                return [4 /*yield*/, device.device.exchange(request)];
            case 3:
                response = _a.sent();
                responseStr = response.toString('hex').toUpperCase();
                /* istanbul ignore if */
                if (Debug) {
                    console.log('exchange', 'response', responseStr);
                }
                success = false;
                message = '';
                applicationName = '';
                if (responseStr.endsWith('9000')) {
                    success = true;
                    message = responseStr;
                    applicationName = responseStr.substring(0, responseStr.length - 4);
                    applicationName = (0, exports.hex2ascii)(applicationName);
                }
                else {
                    message = (0, exports.GetErrorMessage)(responseStr);
                }
                return [2 /*return*/, {
                        success: success,
                        message: message,
                        applicationName: applicationName,
                    }];
            case 4:
                error_1 = _a.sent();
                /* istanbul ignore if */
                if (Debug) {
                    console.trace('getApplicationName', 'error', error_1);
                }
                return [2 /*return*/, {
                        success: false,
                        message: error_1.message,
                    }];
            case 5: return [4 /*yield*/, device.device.close()];
            case 6:
                _a.sent();
                return [7 /*endfinally*/];
            case 7:
                if (device.error) {
                    return [2 /*return*/, {
                            success: false,
                            message: device.message,
                        }];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.GetApplicationName = GetApplicationName;
/**
 * Get Version
 * @param transport
 * @returns
 */
var GetVersion = function (transport) { return __awaiter(void 0, void 0, void 0, function () {
    var device, request, response, responseStr, success, message, version, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.GetDevice)(transport)];
            case 1:
                device = _a.sent();
                if (!device.enabled) {
                    return [2 /*return*/, {
                            success: false,
                            message: 'Your computer does not support the ledger device.',
                        }];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, 5, 7]);
                request = Buffer.from('E003000000', 'hex');
                /* istanbul ignore if */
                if (Debug) {
                    console.log('exchange', 'request', request.toString('hex').toUpperCase());
                }
                return [4 /*yield*/, device.device.exchange(request)];
            case 3:
                response = _a.sent();
                responseStr = response.toString('hex').toUpperCase();
                /* istanbul ignore if */
                if (Debug) {
                    console.log('exchange', 'response', responseStr);
                }
                success = false;
                message = '';
                version = '';
                if (responseStr.endsWith('9000')) {
                    success = true;
                    message = responseStr;
                    version = responseStr.substring(0, responseStr.length - 4);
                    version = (0, exports.hex2ascii)(version);
                }
                else {
                    message = (0, exports.GetErrorMessage)(responseStr);
                }
                return [2 /*return*/, {
                        success: success,
                        message: message,
                        version: version,
                    }];
            case 4:
                error_2 = _a.sent();
                /* istanbul ignore if */
                if (Debug) {
                    console.trace('getVersion', 'error', error_2);
                }
                return [2 /*return*/, {
                        success: false,
                        message: error_2.message,
                    }];
            case 5: return [4 /*yield*/, device.device.close()];
            case 6:
                _a.sent();
                return [7 /*endfinally*/];
            case 7:
                if (device.error) {
                    return [2 /*return*/, {
                            success: false,
                            message: device.message,
                        }];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.GetVersion = GetVersion;
/**
 * Get Pip44 Path Message
 * @param messagePrefix
 * @returns
 */
var GetBip44PathMessage = function (messagePrefix) {
    /* istanbul ignore if */
    if (messagePrefix == undefined) {
        throw Error('messagePrefix is a required parameter.');
    }
    if (messagePrefix.length !== 4) {
        throw Error('messagePrefix must be of length 4.');
    }
    var bip44PathBuffer = Buffer.from(exports.Bip44Path, 'hex');
    var bip44PathBufferLen = 5; // bip44PathBuffer.length;
    var bip44PathBufferLenBuffer = int2buffer(bip44PathBufferLen);
    var payload = Buffer.concat([bip44PathBufferLenBuffer, bip44PathBuffer]);
    var payloadLen = int2buffer(payload.length);
    if (Debug) {
        console.log('getBip44PathMessage', 'bip44PathBuffer', bip44PathBuffer.toString('hex').toUpperCase());
        console.log('getBip44PathMessage', 'bip44PathBufferLen', bip44PathBufferLen);
        console.log('getBip44PathMessage', 'bip44PathBufferLenBuffer', bip44PathBufferLenBuffer.toString('hex').toUpperCase());
        console.log('getBip44PathMessage', 'payload', payload.toString('hex').toUpperCase());
        console.log('getBip44PathMessage', 'payloadLen', payloadLen.toString('hex').toUpperCase());
    }
    var message = Buffer.concat([messagePrefix, payloadLen, payload]);
    return message;
};
exports.GetBip44PathMessage = GetBip44PathMessage;
/**
 * Get Public Key
 * @param transport
 * @param options
 * @returns
 */
var GetPublicKey = function (transport, options) { return __awaiter(void 0, void 0, void 0, function () {
    var device, messagePrefix, request, response, responseStr, success, message, publicKey, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                /* istanbul ignore if */
                if (transport == undefined) {
                    throw Error('transport is a required parameter.');
                }
                /* istanbul ignore if */
                if (options == undefined) {
                    throw Error('options is a required parameter.');
                }
                return [4 /*yield*/, (0, exports.GetDevice)(transport)];
            case 1:
                device = _a.sent();
                if (!device.enabled) {
                    return [2 /*return*/, {
                            success: false,
                            message: 'Your computer does not support the ledger device.',
                        }];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, 5, 7]);
                messagePrefix = void 0;
                if (options.verifyOnDevice) {
                    messagePrefix = Buffer.from('E0050100', 'hex');
                }
                else {
                    messagePrefix = Buffer.from('E0050000', 'hex');
                }
                request = (0, exports.GetBip44PathMessage)(messagePrefix);
                /* istanbul ignore if */
                if (Debug) {
                    console.log('exchange', 'request', request.toString('hex').toUpperCase());
                }
                return [4 /*yield*/, device.device.exchange(request)];
            case 3:
                response = _a.sent();
                responseStr = response.toString('hex').toUpperCase();
                /* istanbul ignore if */
                if (Debug) {
                    console.log('exchange', 'response', responseStr);
                }
                success = false;
                message = '';
                publicKey = '';
                if (responseStr.endsWith('9000')) {
                    success = true;
                    message = responseStr;
                    publicKey = responseStr.substring(0, 64);
                }
                else {
                    message = (0, exports.GetErrorMessage)(responseStr);
                }
                return [2 /*return*/, {
                        success: success,
                        message: message,
                        publicKey: publicKey,
                    }];
            case 4:
                error_3 = _a.sent();
                /* istanbul ignore if */
                if (Debug) {
                    console.trace('getPublicKey', 'error', error_3);
                }
                return [2 /*return*/, {
                        success: false,
                        message: error_3.message,
                    }];
            case 5: return [4 /*yield*/, device.device.close()];
            case 6:
                _a.sent();
                return [7 /*endfinally*/];
            case 7:
                if (device.error) {
                    return [2 /*return*/, {
                            success: false,
                            message: device.message,
                        }];
                }
                return [2 /*return*/, {
                        success: false,
                        message: 'Unknown Error',
                    }];
        }
    });
}); };
exports.GetPublicKey = GetPublicKey;
var chunkString = function (str, length) {
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
};
exports.chunkString = chunkString;
var splitMessageIntoChunks = function (ledgerMessage) {
    var messages = [];
    messages.push((0, exports.GetBip44PathMessage)(Buffer.from('E006' + '00' + '80', 'hex')));
    if (Debug) {
        console.log('splitMessageIntoChunks', 'ledgerMessage.length', ledgerMessage.length);
    }
    // MAX 250, as theres 5 header bytes, and max total buffer size is 255.
    var bufferSize = 250 * 2;
    // ledgerMessage = ledgerMessage.substring(0,bufferSize);
    var chunks = (0, exports.chunkString)(ledgerMessage, bufferSize);
    for (var chunkIx = 0; chunkIx < chunks.length; chunkIx++) {
        var chunk = chunks[chunkIx];
        var chunkNbr = chunkIx + 1;
        if (Debug) {
            console.log('splitMessageIntoChunks', 'chunk.length', chunk.length);
        }
        var p1 = chunkNbr.toString(16).padStart(2, '0');
        if (Debug) {
            console.log('splitMessageIntoChunks', 'p1', p1);
        }
        var p2 = void 0;
        if (chunkNbr == chunks.length) {
            // LAST
            p2 = '00';
        }
        else {
            // MORE
            p2 = '80';
        }
        if (Debug) {
            console.log('splitMessageIntoChunks', 'p2', p2);
        }
        var chunkLength = chunk.length / 2;
        var chunkLengthHex = chunkLength.toString(16).padStart(2, '0');
        if (Debug) {
            console.log('splitMessageIntoChunks', 'chunkLengthHex', chunkLengthHex);
        }
        var messageHex = 'E006' + p1 + p2 + chunkLengthHex + chunk;
        if (Debug) {
            console.log('splitMessageIntoChunks', 'messageHex', messageHex);
        }
        var message = Buffer.from(messageHex, 'hex');
        if (Debug) {
            console.log('splitMessageIntoChunks', 'message', message);
        }
        messages.push(message);
    }
    return messages;
};
exports.splitMessageIntoChunks = splitMessageIntoChunks;
var decodeSignature = function (response) {
    /* istanbul ignore if */
    if (Debug) {
        console.log('decodeSignature', 'response', response);
    }
    var signature = response.substring(0, 128);
    /* istanbul ignore if */
    if (Debug) {
        console.log('decodeSignature', 'signature', signature);
    }
    return signature;
};
exports.decodeSignature = decodeSignature;
var SignLedger = function (transport, transactionHex) { return __awaiter(void 0, void 0, void 0, function () {
    var transactionByteLength, ledgerMessage, messages, device, lastResponse, ix, message_1, response, responseStr, message_2, signature, success, message, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                /* istanbul ignore if */
                if (Debug) {
                    console.log('sign', 'transactionHex', transactionHex);
                }
                transactionByteLength = Math.ceil(transactionHex.length / 2);
                if (transactionByteLength > exports.MAX_SIGNED_TX_LEN) {
                    return [2 /*return*/, {
                            success: false,
                            message: "Transaction length of ".concat(transactionByteLength, " bytes exceeds max length of ").concat(exports.MAX_SIGNED_TX_LEN, " bytes. Send less candidates and consolidate utxos."),
                        }];
                }
                ledgerMessage = transactionHex;
                messages = (0, exports.splitMessageIntoChunks)(ledgerMessage);
                if (Debug) {
                    console.log('sign', 'transport', transport);
                }
                return [4 /*yield*/, (0, exports.GetDevice)(transport)];
            case 1:
                device = _a.sent();
                if (Debug) {
                    console.log('sign', 'device', device);
                    console.log('sign', 'messages.length', messages.length);
                }
                if (!device.enabled) {
                    return [2 /*return*/, {
                            success: false,
                            message: 'Your computer does not support the ledger device.',
                        }];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 7, 8, 10]);
                lastResponse = undefined;
                ix = 0;
                _a.label = 3;
            case 3:
                if (!(ix < messages.length)) return [3 /*break*/, 6];
                message_1 = messages[ix];
                /* istanbul ignore if */
                if (Debug) {
                    console.log('exchange', ix, 'of', messages.length, 'message', message_1.toString('hex').toUpperCase());
                }
                return [4 /*yield*/, device.device.exchange(message_1)];
            case 4:
                response = _a.sent();
                responseStr = response.toString('hex').toUpperCase();
                if (Debug) {
                    console.log('exchange', ix, 'of', messages.length, 'response', responseStr);
                }
                if (responseStr !== undefined) {
                    if (!responseStr.endsWith('9000')) {
                        message_2 = (0, exports.GetErrorMessage)(responseStr);
                        return [2 /*return*/, {
                                success: false,
                                message: message_2,
                                signature: '',
                            }];
                    }
                }
                lastResponse = responseStr;
                _a.label = 5;
            case 5:
                ix++;
                return [3 /*break*/, 3];
            case 6:
                signature = undefined;
                success = false;
                message = lastResponse;
                if (lastResponse !== undefined) {
                    if (lastResponse.endsWith('9000')) {
                        signature = (0, exports.decodeSignature)(lastResponse);
                        success = true;
                    }
                    else {
                        message = (0, exports.GetErrorMessage)(lastResponse);
                    }
                }
                return [2 /*return*/, {
                        success: success,
                        message: message,
                        signature: signature,
                    }];
            case 7:
                error_4 = _a.sent();
                /* istanbul ignore if */
                if (Debug) {
                    console.trace('sign', 'error', error_4);
                }
                return [2 /*return*/, {
                        success: false,
                        message: error_4.message,
                    }];
            case 8: return [4 /*yield*/, device.device.close()];
            case 9:
                _a.sent();
                return [7 /*endfinally*/];
            case 10:
                if (device.error) {
                    return [2 /*return*/, {
                            success: false,
                            message: device.message,
                        }];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.SignLedger = SignLedger;
