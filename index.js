"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.phantasma = exports.hostConfiguration = exports.backBone = void 0;
//Imports PhantasmaJS
var backBone = __importStar(require("./core/index"));
//Exports PhantasmaJS
exports.backBone = __importStar(require("./core/index"));
//Exports Host Config Generator
var hostConfiguration = /** @class */ (function () {
    //Constructs The Host Config
    function hostConfiguration(
    //Set Defualt Values
    rpcURL, jsonPeerList, nexus, chain) {
        if (rpcURL === void 0) { rpcURL = 'https://seed.ghostdevs.com:7077/rpc'; }
        if (jsonPeerList === void 0) { jsonPeerList = 'https://ghostdevs.com/getpeers.json'; }
        if (nexus === void 0) { nexus = 'mainnet'; }
        if (chain === void 0) { chain = 'main'; }
        //Set Values
        this.rpc = rpcURL;
        this.peerList = jsonPeerList;
        this.nexus = nexus;
        this.chain = chain;
    }
    ;
    return hostConfiguration;
}());
exports.hostConfiguration = hostConfiguration;
;
//Exports The SDK
var phantasma = /** @class */ (function () {
    //Constructs The BigBoi
    function phantasma(config) {
        if (config === void 0) { config = new hostConfiguration; }
        //Sets The Config
        this.config = config;
        //Sets The RPC Host
        this.rpc = new backBone.PhantasmaAPI(this.config.rpc, this.config.peerList);
    }
    ;
    return phantasma;
}());
exports.phantasma = phantasma;
;
