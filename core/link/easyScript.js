"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasyScript = exports.Nexus = void 0;
var vm_1 = require("../vm");
var Nexus;
(function (Nexus) {
    Nexus["Mainnet"] = "mainnet";
    Nexus["Simnet"] = "simnet";
    Nexus["Testnet"] = "testnet";
})(Nexus = exports.Nexus || (exports.Nexus = {}));
var EasyScript = /** @class */ (function () {
    function EasyScript(nexus) {
        if (nexus === void 0) { nexus = Nexus.Mainnet; }
        this.sb = new vm_1.ScriptBuilder();
        this.nexus = nexus;
    }
    EasyScript.prototype.buildScript = function (_type, _options) {
        if (_options === void 0) { _options = [null]; }
        this.sb = new vm_1.ScriptBuilder();
        switch (_type) {
            case "interact":
                var contractNameInteract = _options[0];
                var methodNameInteract = _options[1];
                var inputArgumentsInteract = _options[2];
                return this.sb
                    .CallContract("gas", "AllowGas", [])
                    .CallContract(contractNameInteract, methodNameInteract, inputArgumentsInteract) //The Meat of the Script
                    .CallContract("gas", "SpendGas", [])
                    .EndScript();
                break;
            case "invoke":
                var contractNameInvoke = _options[0];
                var methodNameInvoke = _options[1];
                var inputArgumentsInvoke = _options[2];
                return this.sb
                    .CallContract(contractNameInvoke, methodNameInvoke, inputArgumentsInvoke) //The Meat of the Script
                    .EndScript();
                break;
            case "interop":
                var interopNameInterop = _options[0];
                var inputArgumentsInterop = _options[1];
                return this.sb
                    .CallContract("gas", "AllowGas", [])
                    .CallInterop(interopNameInterop, inputArgumentsInterop)
                    .CallContract("gas", "SpendGas", [])
                    .EndScript();
                break;
        }
    };
    return EasyScript;
}());
exports.EasyScript = EasyScript;
