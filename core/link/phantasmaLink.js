"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhantasmaLink = exports.ProofOfWork = void 0;
var vm_1 = require("../vm");
var ProofOfWork;
(function (ProofOfWork) {
    ProofOfWork[ProofOfWork["None"] = 0] = "None";
    ProofOfWork[ProofOfWork["Minimal"] = 5] = "Minimal";
    ProofOfWork[ProofOfWork["Moderate"] = 15] = "Moderate";
    ProofOfWork[ProofOfWork["Hard"] = 19] = "Hard";
    ProofOfWork[ProofOfWork["Heavy"] = 24] = "Heavy";
    ProofOfWork[ProofOfWork["Extreme"] = 30] = "Extreme";
})(ProofOfWork = exports.ProofOfWork || (exports.ProofOfWork = {}));
var PhantasmaLink = /** @class */ (function () {
    //Construct The Link
    function PhantasmaLink(dappID, logging) {
        if (logging === void 0) { logging = true; }
        var _this = this;
        //Message Logging
        this.onMessage = function (msg) {
            if (_this.messageLogging == true) {
                console.log(msg);
            }
        };
        //Turn On|Off Console Logging
        if (logging == false) {
            this.messageLogging = false;
        }
        else {
            this.messageLogging = true;
            console.log('%cPhantasmaLink created', 'color:green');
        }
        //Standard Sets
        this.host = 'localhost:7090';
        this.dapp = dappID;
        this.onLogin = function (succ) { }; //Does Nothing for Now
    }
    //Connect To Wallet
    PhantasmaLink.prototype.login = function (onLoginCallback, onErrorCallback, providerHint) {
        this.providerHint = providerHint;
        this.onLogin = onLoginCallback;
        this.onError = onErrorCallback;
        this.createSocket();
    };
    //Script Invoking With Wallet Connection
    PhantasmaLink.prototype.invokeScript = function (script, callback) {
        this.onMessage('Relaying transaction to wallet...');
        var that = this;
        this.sendLinkRequest('invokeScript/' + script, function (result) {
            if (result.success) {
                that.onMessage('Transaction successful, hash: ' + result.hash.substr(0, 15) + '...');
                if (callback) {
                    callback(result);
                }
            }
        });
    };
    //Wallet Transaction Signing + Sending
    PhantasmaLink.prototype.signTx = function (nexus, script, payload, callback, onErrorCallback) {
        //Checks If Needed Script Is In Object
        if (script.script) {
            script = script.script;
        }
        //Overload Protection
        if (script.length >= 65536) {
            this.onMessage('Error: script is too big!');
            if (onErrorCallback) {
                onErrorCallback();
            }
            return;
        }
        //Check Payload
        if (payload == null) {
            payload = '7068616e7461736d612d7473'; //Says 'Phantasma-ts' in hex
        }
        else if (typeof payload === 'string') { //Turn String Payload -> Bytes -> Hex
            var sb = new vm_1.ScriptBuilder();
            var bytes = sb.rawString(payload);
            sb.appendBytes(bytes);
            payload = sb.endScript();
        }
        else {
            this.onMessage('Error: Invalid Payload');
            if (onErrorCallback) {
                onErrorCallback();
            }
            return;
        }
        this.onError = onErrorCallback; //Sets Error Callback Function
        var that = this; //Allows the use of 'this' inside sendLinkRequest Object
        //Sends Signiture Request To Connected Wallet For Script
        this.sendLinkRequest('signTx/' + nexus + '/main/' + script + '/' + payload, function (result) {
            if (result.success) {
                if (result.hash.error) {
                    that.onMessage('Error: ' + result.hash.error);
                    return;
                }
                that.onMessage('Transaction successful, hash: ' + result.hash.substr(0, 15) + '...');
                if (callback) {
                    callback(result);
                }
            }
            else {
                if (onErrorCallback) {
                    onErrorCallback();
                }
                ;
            }
        });
    };
    //Wallet Transaction Signing for Proof of Work
    PhantasmaLink.prototype.signTxPow = function (nexus, script, payload, proofOfWork, callback, onErrorCallback) {
        //Checks If Needed Script Is In Object
        if (script.script) {
            script = script.script;
        }
        //Overload Protection
        if (script.length >= 65536) {
            this.onMessage('Error: script is too big!');
            if (onErrorCallback) {
                onErrorCallback();
            }
            return;
        }
        //Check Payload
        if (payload == null) {
            payload = '7068616e7461736d612d7473'; //Says 'Phantasma-ts' in hex
        }
        else if (typeof payload === 'string') { //Turn String Payload -> Bytes -> Hex
            var sb = new vm_1.ScriptBuilder();
            var bytes = sb.rawString(payload);
            sb.appendBytes(bytes);
            payload = sb.endScript();
        }
        else {
            this.onMessage('Error: Invalid Payload');
            if (onErrorCallback) {
                onErrorCallback();
            }
            return;
        }
        this.onError = onErrorCallback; //Sets Error Callback Function
        var that = this; //Allows the use of 'this' inside sendLinkRequest Object
        //Sends Signiture Request To Connected Wallet For Script
        this.sendLinkRequest('signTxPow/' + nexus + '/main/' + script + '/' + payload + '/' + proofOfWork, function (result) {
            if (result.success) {
                if (result.hash.error) {
                    that.onMessage('Error: ' + result.hash.error);
                    return;
                }
                that.onMessage('Transaction successful, hash: ' + result.hash.substr(0, 15) + '...');
                if (callback) {
                    callback(result);
                }
            }
            else {
                if (onErrorCallback) {
                    onErrorCallback();
                }
                ;
            }
        });
    };
    PhantasmaLink.prototype.getPeer = function (callback, onErrorCallback) {
        this.onError = onErrorCallback; //Sets Error Callback Function
        var that = this; //Allows the use of 'this' inside sendLinkRequest Object
        //Sends Signiture Request To Connected Wallet For Script
        this.sendLinkRequest('getPeer/', function (result) {
            if (result.success) {
                if (result.hash.error) {
                    that.onMessage('Error: ' + result);
                    return;
                }
                that.onMessage('Peer Query,: ' + result);
                if (callback) {
                    callback(result);
                }
            }
            else {
                if (onErrorCallback) {
                    onErrorCallback();
                }
                ;
            }
        });
    };
    //Uses Wallet To Sign Data With Signiture
    PhantasmaLink.prototype.signData = function (data, callback, onErrorCallback) {
        //Checks If Needed Data Is In Object
        if (data.data) {
            data = data.data;
        }
        //Overload Protection
        if (data.length >= 65536) {
            this.onMessage('Error: data is too big!');
            if (onErrorCallback) {
                onErrorCallback();
            }
            return;
        }
        var that = this; //Allows the use of 'this' inside sendLinkRequest Object
        this.sendLinkRequest('signData/' + data + '/1', function (result) {
            if (result.success) {
                that.onMessage('Data successfully signed');
                if (callback) {
                    callback(result);
                }
            }
            else {
                if (onErrorCallback) {
                    onErrorCallback(result);
                }
            }
        });
    };
    //Wallet Socket Connection Creation
    PhantasmaLink.prototype.createSocket = function () {
        var path = 'ws://' + this.host + '/phantasma';
        this.onMessage('Phantasma Link connecting...');
        if (this.socket) {
            this.socket.close();
        }
        // @ts-ignore
        this.socket = window.PhantasmaLinkSocket && this.providerHint !== 'poltergeist'
            // @ts-ignore
            ? new PhantasmaLinkSocket()
            : new WebSocket(path);
        this.requestCallback = null;
        this.token = null;
        this.account = null;
        this.requestID = 0;
        var that = this;
        //Once Socket Opened
        this.socket.onopen = function (e) {
            that.onMessage('Connection established, authorizing dapp in wallet...');
            that.sendLinkRequest('authorize/' + that.dapp, function (result) {
                //Set Global Variables With Successful Account Query
                if (result.success) {
                    that.token = result.token;
                    that.wallet = result.wallet;
                    that.onMessage('Authorized, obtaining account info...');
                    that.sendLinkRequest('getAccount', function (result) {
                        if (result.success) {
                            that.account = result;
                        }
                        else {
                            that.onError('Could not obtain account info... Make sure you have an account currently open in ' +
                                that.wallet + '...');
                            that.disconnect('Unable to optain Account Info');
                        }
                        that.onLogin(result.success);
                        that.onLogin = null;
                    });
                }
                else {
                    that.onError('Authorization failed...');
                    that.disconnect('Auth Failure');
                }
            });
        };
        //Retrieves Message From Socket and Processes It
        this.socket.onmessage = function (event) {
            var obj = JSON.parse(event.data);
            if (that.messageLogging == true) {
                console.log('%c' + event.data, 'color:blue');
            }
            //Checks What To Do Based On Message
            switch (obj.message) {
                case 'Wallet is Closed':
                    that.onError('Could not obtain account info... Make sure you have an account currently open in ' + that.wallet);
                    that.disconnect(true);
                    break;
                case 'not logged in':
                    that.onError('Could not obtain account info... Make sure you have an account currently logged in');
                    that.disconnect(true);
                    break;
                case 'A previous request is still pending':
                    that.onError('You have a pending action in your wallet');
                    break;
                case 'user rejected':
                    that.onError('Transaction cancelled by user in ' + that.wallet);
                    break;
                case 'user rejected':
                    that.onError('Transaction cancelled by user in ' + that.wallet);
                    break;
                default:
                    if (obj.message && (obj.message).startsWith('nexus mismatch')) {
                        that.onError(obj.message);
                    }
                    else {
                        var temp = that.requestCallback;
                        if (temp == null) {
                            that.onError('Something bad happened');
                            return;
                        }
                        that.requestCallback = null;
                        temp(obj);
                    }
                    break;
            }
        };
        //Cleanup After Socket Closes
        this.socket.onclose = function (event) {
            if (!event.wasClean) {
                if (that.onLogin) {
                    that.onError('Connection terminated...');
                }
                that.onLogin = null;
            }
        };
        //Error Callback When Socket Has Error
        this.socket.onerror = function (error) {
            if (error.message !== undefined) {
                that.onMessage('Error: ' + error.message);
            }
        };
    };
    //Message Logging Util
    PhantasmaLink.prototype.toggleMessageLogging = function () {
        if (this.messageLogging == true) {
            this.messageLogging = false;
        }
        else {
            this.messageLogging = true;
        }
    };
    //Retry Util
    PhantasmaLink.prototype.retry = function () {
        this.createSocket();
    };
    Object.defineProperty(PhantasmaLink.prototype, "dappID", {
        //Get Dapp ID Name Util
        get: function () {
            return this.dapp;
        },
        enumerable: false,
        configurable: true
    });
    //Build Request and Send To Wallet Via Socket
    PhantasmaLink.prototype.sendLinkRequest = function (request, callback) {
        this.onMessage('Sending Phantasma Link request: ' + request);
        if (this.token != null) {
            request = request + '/' + this.dapp + '/' + this.token;
        }
        this.requestID++; //Object Nonce Increase?
        request = this.requestID + ',' + request;
        this.requestCallback = callback;
        this.socket.send(request);
    };
    //Disconnect The Wallet Connection Socket
    PhantasmaLink.prototype.disconnect = function (triggered) {
        this.onMessage('Disconnecting Phantasma Link: ' + triggered);
        this.socket.close();
    };
    return PhantasmaLink;
}());
exports.PhantasmaLink = PhantasmaLink;
