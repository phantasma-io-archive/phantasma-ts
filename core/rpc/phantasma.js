"use strict";
/* eslint-disable */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhantasmaAPI = void 0;
var cross_fetch_1 = __importDefault(require("cross-fetch"));
var PhantasmaAPI = /** @class */ (function () {
    function PhantasmaAPI(defHost, peersUrlJson) {
        var _this = this;
        this.rpcName = "Auto";
        this.nexus = "mainnet";
        this.host = defHost;
        this.availableHosts = [];
        (0, cross_fetch_1.default)(peersUrlJson + "?_=" + new Date().getTime()).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var data, i, msecs, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, res.json()];
                    case 1:
                        data = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < data.length)) return [3 /*break*/, 7];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.pingAsync(data[i].url)];
                    case 4:
                        msecs = _a.sent();
                        data[i].info = data[i].location + " • " + msecs + " ms";
                        data[i].msecs = msecs;
                        //console.log(data[i].location + " • " + msecs + " ms • " + data[i].url + "/rpc");
                        this.availableHosts.push(data[i]);
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        i++;
                        return [3 /*break*/, 2];
                    case 7:
                        this.availableHosts.sort(function (a, b) { return a.msecs - b.msecs; });
                        this.updateRpc();
                        return [2 /*return*/];
                }
            });
        }); });
    }
    PhantasmaAPI.prototype.pingAsync = function (host) {
        return new Promise(function (resolve, reject) {
            var started = new Date().getTime();
            var http = new XMLHttpRequest();
            http.open("GET", host + "/rpc", true);
            http.timeout = 4500;
            http.onreadystatechange = function () {
                if (http.readyState == 4 && http.status == 200) {
                    var ended = new Date().getTime();
                    var milliseconds = ended - started;
                    resolve(milliseconds);
                }
                http.ontimeout = function () {
                    resolve(100000);
                };
                http.onerror = function () {
                    resolve(100000);
                };
            };
            try {
                http.send(null);
            }
            catch (exception) {
                // this is expected
                reject();
            }
        });
    };
    PhantasmaAPI.prototype.JSONRPC = function (method, params) {
        return __awaiter(this, void 0, void 0, function () {
            var res, resJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, cross_fetch_1.default)(this.host, {
                            method: "POST",
                            mode: "cors",
                            body: JSON.stringify({
                                jsonrpc: "2.0",
                                method: method,
                                params: params,
                                id: "1",
                            }),
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        resJson = _a.sent();
                        //console.log("method", method, resJson);
                        if (resJson.error) {
                            if (resJson.error.message)
                                return [2 /*return*/, { error: resJson.error.message }];
                            return [2 /*return*/, { error: resJson.error }];
                        }
                        return [4 /*yield*/, resJson.result];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PhantasmaAPI.prototype.setRpcHost = function (rpcHost) {
        this.host = rpcHost;
    };
    PhantasmaAPI.prototype.setRpcByName = function (rpcName) {
        this.rpcName = rpcName;
        if (this.nexus === "mainnet")
            this.updateRpc();
    };
    PhantasmaAPI.prototype.setNexus = function (nexus) {
        this.nexus = nexus.toLowerCase();
    };
    PhantasmaAPI.prototype.updateRpc = function () {
        var _this = this;
        if (this.nexus === "mainnet" && this.availableHosts.length > 0) {
            console.log("%cUpdate RPC with name " + this.rpcName, "font-size: 20px");
            if (this.rpcName == "Auto") {
                this.host = this.availableHosts[0].url + "/rpc";
            }
            else {
                var rpc = this.availableHosts.find(function (h) { return h.location == _this.rpcName; });
                if (rpc)
                    this.host = rpc.url + "/rpc";
                else
                    this.host = this.availableHosts[0].url + "/rpc";
            }
            console.log("%cSet RPC api to " + this.host, "font-size: 20px");
        }
    };
    PhantasmaAPI.prototype.convertDecimals = function (amount, decimals) {
        var mult = Math.pow(10, decimals);
        return amount / mult;
    };
    //Returns the account name and balance of given address.
    PhantasmaAPI.prototype.getAccount = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [account];
                        return [4 /*yield*/, this.JSONRPC("getAccount", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns the address that owns a given name.
    PhantasmaAPI.prototype.lookUpName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [name];
                        return [4 /*yield*/, this.JSONRPC("lookUpName", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns the height of a chain.
    PhantasmaAPI.prototype.getBlockHeight = function (chainInput) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [chainInput];
                        return [4 /*yield*/, this.JSONRPC("getBlockHeight", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns the number of transactions of given block hash or error if given hash is invalid or is not found.
    PhantasmaAPI.prototype.getBlockTransactionCountByHash = function (blockHash) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [blockHash];
                        return [4 /*yield*/, this.JSONRPC("getBlockTransactionCountByHash", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns information about a block by hash.
    PhantasmaAPI.prototype.getBlockByHash = function (blockHash) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [blockHash];
                        return [4 /*yield*/, this.JSONRPC("getBlockByHash", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns a serialized string, containing information about a block by hash.
    PhantasmaAPI.prototype.getRawBlockByHash = function (blockHash) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [blockHash];
                        return [4 /*yield*/, this.JSONRPC("getRawBlockByHash", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns information about a block by height and chain.
    PhantasmaAPI.prototype.getBlockByHeight = function (chainInput, height) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [chainInput, height];
                        return [4 /*yield*/, this.JSONRPC("getBlockByHeight", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns a serialized string, in hex format, containing information about a block by height and chain.
    PhantasmaAPI.prototype.getRawBlockByHeight = function (chainInput, height) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [chainInput, height];
                        return [4 /*yield*/, this.JSONRPC("getRawBlockByHeight", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns the information about a transaction requested by a block hash and transaction index.
    PhantasmaAPI.prototype.getTransactionByBlockHashAndIndex = function (blockHash, index) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [blockHash, index];
                        return [4 /*yield*/, this.JSONRPC("getTransactionByBlockHashAndIndex", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns last X transactions of given address.
    PhantasmaAPI.prototype.getAddressTransactions = function (account, page, pageSize) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [account, page, pageSize];
                        return [4 /*yield*/, this.JSONRPC("getAddressTransactions", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Get number of transactions in a specific address and chain
    PhantasmaAPI.prototype.getAddressTransactionCount = function (account, chainInput) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [account, chainInput];
                        return [4 /*yield*/, this.JSONRPC("getAddressTransactionCount", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Allows to broadcast a signed operation on the network, but it&apos;s required to build it manually.
    PhantasmaAPI.prototype.sendRawTransaction = function (txData) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [txData];
                        return [4 /*yield*/, this.JSONRPC("sendRawTransaction", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Allows to invoke script based on network state, without state changes.
    PhantasmaAPI.prototype.invokeRawScript = function (chainInput, scriptData) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [chainInput, scriptData];
                        return [4 /*yield*/, this.JSONRPC("invokeRawScript", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns information about a transaction by hash.
    PhantasmaAPI.prototype.getTransaction = function (hashText) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [hashText];
                        return [4 /*yield*/, this.JSONRPC("getTransaction", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Removes a pending transaction from the mempool.
    PhantasmaAPI.prototype.cancelTransaction = function (hashText) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [hashText];
                        return [4 /*yield*/, this.JSONRPC("cancelTransaction", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns an array of all chains deployed in Phantasma.
    PhantasmaAPI.prototype.getChains = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [];
                        return [4 /*yield*/, this.JSONRPC("getChains", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns info about the nexus.
    PhantasmaAPI.prototype.getNexus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [];
                        return [4 /*yield*/, this.JSONRPC("getNexus", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns info about an organization.
    PhantasmaAPI.prototype.getOrganization = function (ID) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [ID];
                        return [4 /*yield*/, this.JSONRPC("getOrganization", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns content of a Phantasma leaderboard.
    PhantasmaAPI.prototype.getLeaderboard = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [name];
                        return [4 /*yield*/, this.JSONRPC("getLeaderboard", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns an array of tokens deployed in Phantasma.
    PhantasmaAPI.prototype.getTokens = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [];
                        return [4 /*yield*/, this.JSONRPC("getTokens", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns info about a specific token deployed in Phantasma.
    PhantasmaAPI.prototype.getToken = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [symbol];
                        return [4 /*yield*/, this.JSONRPC("getToken", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns data of a non-fungible token, in hexadecimal format.
    PhantasmaAPI.prototype.getTokenData = function (symbol, IDtext) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [symbol, IDtext];
                        return [4 /*yield*/, this.JSONRPC("getTokenData", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns the balance for a specific token and chain, given an address.
    PhantasmaAPI.prototype.getTokenBalance = function (account, tokenSymbol, chainInput) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [account, tokenSymbol, chainInput];
                        return [4 /*yield*/, this.JSONRPC("getTokenBalance", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns the number of active auctions.
    PhantasmaAPI.prototype.getAuctionsCount = function (chainAddressOrName, symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [chainAddressOrName, symbol];
                        return [4 /*yield*/, this.JSONRPC("getAuctionsCount", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns the auctions available in the market.
    PhantasmaAPI.prototype.getAuctions = function (chainAddressOrName, symbol, page, pageSize) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [chainAddressOrName, symbol, page, pageSize];
                        return [4 /*yield*/, this.JSONRPC("getAuctions", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns the auction for a specific token.
    PhantasmaAPI.prototype.getAuction = function (chainAddressOrName, symbol, IDtext) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [chainAddressOrName, symbol, IDtext];
                        return [4 /*yield*/, this.JSONRPC("getAuction", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns info about a specific archive.
    PhantasmaAPI.prototype.getArchive = function (hashText) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [hashText];
                        return [4 /*yield*/, this.JSONRPC("getArchive", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Writes the contents of an incomplete archive.
    PhantasmaAPI.prototype.writeArchive = function (hashText, blockIndex, blockContent) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [hashText, blockIndex, blockContent];
                        return [4 /*yield*/, this.JSONRPC("writeArchive", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns the ABI interface of specific contract.
    PhantasmaAPI.prototype.getABI = function (chainAddressOrName, contractName) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [chainAddressOrName, contractName];
                        return [4 /*yield*/, this.JSONRPC("getABI", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns list of known peers.
    PhantasmaAPI.prototype.getPeers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [];
                        return [4 /*yield*/, this.JSONRPC("getPeers", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Writes a message to the relay network.
    PhantasmaAPI.prototype.relaySend = function (receiptHex) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [receiptHex];
                        return [4 /*yield*/, this.JSONRPC("relaySend", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Receives messages from the relay network.
    PhantasmaAPI.prototype.relayReceive = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [account];
                        return [4 /*yield*/, this.JSONRPC("relayReceive", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Reads pending messages from the relay network.
    PhantasmaAPI.prototype.getEvents = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [account];
                        return [4 /*yield*/, this.JSONRPC("getEvents", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns an array of available interop platforms.
    PhantasmaAPI.prototype.getPlatforms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [];
                        return [4 /*yield*/, this.JSONRPC("getPlatforms", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns an array of available validators.
    PhantasmaAPI.prototype.getValidators = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [];
                        return [4 /*yield*/, this.JSONRPC("getValidators", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Tries to settle a pending swap for a specific hash.
    PhantasmaAPI.prototype.settleSwap = function (sourcePlatform, destPlatform, hashText) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [sourcePlatform, destPlatform, hashText];
                        return [4 /*yield*/, this.JSONRPC("settleSwap", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns platform swaps for a specific address.
    PhantasmaAPI.prototype.getSwapsForAddressOld = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [account];
                        return [4 /*yield*/, this.JSONRPC("getSwapsForAddress", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns platform swaps for a specific address.
    PhantasmaAPI.prototype.getSwapsForAddress = function (account, platform) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [account, platform, false];
                        return [4 /*yield*/, this.JSONRPC("getSwapsForAddress", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    //Returns info of a nft.
    PhantasmaAPI.prototype.getNFT = function (symbol, nftId) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [symbol, nftId, true];
                        return [4 /*yield*/, this.JSONRPC("getNFT", params)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    return PhantasmaAPI;
}());
exports.PhantasmaAPI = PhantasmaAPI;
