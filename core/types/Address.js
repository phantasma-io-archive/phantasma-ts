"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = exports.AddressKind = void 0;
var bs58_1 = __importDefault(require("bs58"));
var utils_1 = require("../utils");
var sha256_1 = __importDefault(require("crypto-js/sha256"));
var enc_hex_1 = __importDefault(require("crypto-js/enc-hex"));
var tx_1 = require("../tx");
var elliptic_1 = require("elliptic");
var curve = new elliptic_1.eddsa("ed25519");
var AddressKind;
(function (AddressKind) {
    AddressKind[AddressKind["Invalid"] = 0] = "Invalid";
    AddressKind[AddressKind["User"] = 1] = "User";
    AddressKind[AddressKind["System"] = 2] = "System";
    AddressKind[AddressKind["Interop"] = 3] = "Interop";
})(AddressKind = exports.AddressKind || (exports.AddressKind = {}));
var Address = /** @class */ (function () {
    function Address(publicKey) {
        if (publicKey.length != Address.LengthInBytes) {
            throw new Error("publicKey length must be " + Address.LengthInBytes);
        }
        this._bytes = new Uint8Array(Address.LengthInBytes);
        this._bytes.set(publicKey);
        this._text = null;
    }
    Object.defineProperty(Address.prototype, "Kind", {
        /*public get Kind(): AddressKind {
            return this.IsNull ? AddressKind.System : (this._bytes[0] >= 3) ? AddressKind.Interop
                : (AddressKind)this._bytes[0];
        }*/
        get: function () {
            if (this.IsNull) {
                return AddressKind.System;
            }
            else if (this._bytes[0] >= 3) {
                return AddressKind.Interop;
            }
            else {
                return this._bytes[0];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Address.prototype, "IsSystem", {
        get: function () {
            return this.Kind == AddressKind.System;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Address.prototype, "IsInterop", {
        get: function () {
            return this.Kind == AddressKind.Interop;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Address.prototype, "IsUser", {
        get: function () {
            return this.Kind == AddressKind.User;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Address.prototype, "IsNull", {
        /*public get TendermintAddress(): string {
            return encodeBase16(this._bytes.slice(2).SHA256().slice(0, 20));
        }
        public get TendermintAddress() {
            return SHA256(this._bytes.slice(2)).slice(0, 20).toString('hex');
        }
        */
        get: function () {
            if (this._bytes == null || this._bytes.length == 0) {
                return true;
            }
            for (var i = 1; i < this._bytes.length; i++) {
                if (this._bytes[i] != 0) {
                    return false;
                }
            }
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Address.prototype, "Text", {
        get: function () {
            if (this.IsNull) {
                return Address.NullText;
            }
            if (!this._text) {
                if (Address._keyToTextCache.has(this._bytes)) {
                    this._text = Address._keyToTextCache.get(this._bytes);
                }
                if (!this._text) {
                    var prefix = void 0;
                    switch (this.Kind) {
                        case AddressKind.User:
                            prefix = 'P';
                            break;
                        case AddressKind.Interop:
                            prefix = 'X';
                            break;
                        default:
                            prefix = 'S';
                            break;
                    }
                    this._text = prefix + bs58_1.default.encode(this._bytes);
                    Address._keyToTextCache.set(this._bytes, this._text);
                }
            }
            return this._text;
        },
        enumerable: false,
        configurable: true
    });
    Address.FromBytes = function (bytes) {
        return new Address(bytes);
    };
    Address.FromKey = function (key) {
        var bytes = new Uint8Array(Address.LengthInBytes);
        bytes[0] = AddressKind.User;
        if (key.PublicKey.length == 32) {
            bytes.set(key.PublicKey, 2);
        }
        else if (key.PublicKey.length == 33) {
            bytes.set(key.PublicKey, 1);
        }
        else {
            throw new Error("Invalid public key length");
        }
        return new Address(bytes);
    };
    Address.FromHash = function (input) {
        var bytes;
        if (typeof input === "string") {
            bytes = new TextEncoder().encode(input);
        }
        else {
            bytes = input;
        }
        var hash = (0, sha256_1.default)(enc_hex_1.default.parse((0, utils_1.uint8ArrayToString)(bytes)));
        bytes = new Uint8Array(Address.LengthInBytes);
        bytes[0] = AddressKind.User;
        bytes.set(hash.words.slice(0, 32), 2);
        return new Address(bytes);
    };
    Address.FromWif = function (wif) {
        var privateKey = (0, tx_1.getPrivateKeyFromWif)(wif);
        return this.FromBytes((0, utils_1.stringToUint8Array)(privateKey));
    };
    Address.prototype.compareTo = function (other) {
        for (var i = 0; i < Address.LengthInBytes; i++) {
            if (this._bytes[i] < other._bytes[i]) {
                return -1;
            }
            else if (this._bytes[i] > other._bytes[i]) {
                return 1;
            }
        }
        return 0;
    };
    Address.prototype.equals = function (other) {
        if (!(other instanceof Address)) {
            return false;
        }
        var address = other;
        return this._bytes.toString() === address._bytes.toString();
    };
    Address.prototype.toString = function () {
        if (this.IsNull) {
            return Address.NullText;
        }
        if (!this._text) {
            var prefix = void 0;
            switch (this.Kind) {
                case AddressKind.User:
                    prefix = "P";
                    break;
                case AddressKind.Interop:
                    prefix = "X";
                    break;
                default:
                    prefix = "S";
                    break;
            }
            this._text = prefix + bs58_1.default.encode(this._bytes);
        }
        return this._text;
    };
    Address.prototype.ToByteArray = function () {
        return this._bytes;
    };
    Address.NullText = "NULL";
    Address.LengthInBytes = 34;
    Address.MaxPlatformNameLength = 10;
    Address.NullPublicKey = new Uint8Array(Address.LengthInBytes);
    Address.Null = new Address(Address.NullPublicKey);
    Address._keyToTextCache = new Map();
    return Address;
}());
exports.Address = Address;
