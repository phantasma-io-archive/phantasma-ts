"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phantasmaLink = void 0;
var vm_1 = require("../vm");
var phantasmaLink = /** @class */ (function () {
    function phantasmaLink(dappID) {
        this.onMessage = function (msg) {
            console.log(msg);
        };
        console.log('%cPhantasmaLink created', 'color:green');
        this.host = 'localhost:7090';
        this.dapp = dappID;
        this.onLogin = function (succ) {
            // do nothing
        };
    }
    phantasmaLink.prototype.login = function (onLoginCallback, onErrorCallback, providerHint) {
        this.providerHint = providerHint;
        this.onLogin = onLoginCallback;
        this.onError = onErrorCallback;
        this.createSocket();
    };
    phantasmaLink.prototype.invokeScript = function (script) {
        // this.onMessage('Relaying transaction to wallet...')
        var that = this;
        this.sendLinkRequest('invokeScript/' + script, function (result) {
            if (result.success) {
                that.onMessage('Transaction successful, hash: ' + result.hash.substr(0, 15) + '...');
            }
        });
    };
    phantasmaLink.prototype.signTx = function (nexus, script, payload, callback, onErrorCallback) {
        if (script.length >= 65536) {
            this.onMessage('Error: script is too big!');
            if (onErrorCallback)
                onErrorCallback();
            return;
        }
        if (payload == null) {
            payload = '';
        }
        else if (typeof payload === 'string') {
            // NOTE: here we convert a string into raw bytes
            var sb = new vm_1.ScriptBuilder();
            var bytes = sb.rawString(payload);
            sb.appendBytes(bytes);
            // then we convert the bytes into hex, because thats what PhantasmaLink protocol expects
            payload = sb.endScript();
        }
        else {
            this.onMessage('Error: invalid payload');
            if (onErrorCallback)
                onErrorCallback();
            return;
        }
        this.onError = onErrorCallback;
        var that = this;
        if (script.script) {
            script = script.script;
        }
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
                if (onErrorCallback)
                    onErrorCallback();
            }
        });
    };
    phantasmaLink.prototype.signData = function (data, callback, onErrorCallback) {
        if (data.length >= 65536) {
            this.onMessage('Error: data is too big!');
            if (onErrorCallback)
                onErrorCallback();
            return;
        }
        var that = this;
        if (data.data) {
            data = data.data;
        }
        this.sendLinkRequest('signData/' + data + '/1', function (result) {
            if (result.success) {
                //   alertbox.show('Data successfully signed')
                that.onMessage('Data successfully signed');
                if (callback) {
                    callback(result);
                }
            }
            else {
                if (onErrorCallback)
                    onErrorCallback();
            }
        });
    };
    phantasmaLink.prototype.createSocket = function () {
        var path = 'ws://' + this.host + '/phantasma';
        this.onMessage('Phantasma Link connecting...');
        if (this.socket)
            this.socket.close();
        this.socket = window.PhantasmaLinkSocket && this.providerHint !== 'poltergeist'
            ? new PhantasmaLinkSocket()
            : new WebSocket(path);
        this.requestCallback = null;
        this.token = null;
        this.account = null;
        this.requestID = 0;
        var that = this;
        this.socket.onopen = function (e) {
            // that.onMessage('Connection established, authorizing dapp in wallet...')
            that.sendLinkRequest('authorize/' + that.dapp, function (result) {
                if (result.success) {
                    that.token = result.token;
                    that.wallet = result.wallet;
                    // that.onMessage('Authorized, obtaining account info...')
                    that.sendLinkRequest('getAccount', function (result) {
                        if (result.success) {
                            that.account = result;
                            // that.onMessage(
                            //     'Ready, opening ' +
                            //       that.dapp +
                            //       ' dapp connected with ' +
                            //       that.account.name +
                            //       ' on ' +
                            //       that.wallet +
                            //       '...'
                            //   )
                        }
                        else {
                            that.onError('Error: could not obtain account info... Make sure you have an account currently open in ' +
                                that.wallet +
                                '...');
                            that.disconnect('Unable to optain Account Info');
                        }
                        that.onLogin(result.success);
                        that.onLogin = null;
                    });
                }
                else {
                    that.onError('Error: authorization failed...');
                    that.disconnect('Auth Failure');
                }
            });
        };
        this.socket.onmessage = function (event) {
            var obj = JSON.parse(event.data);
            console.log("%c" + event.data, 'color:blue');
            if (obj.message == 'Wallet is Closed') {
                that.onError('Error: could not obtain account info... Make sure you have an account currently open in ' + that.wallet);
                that.disconnect(true);
            }
            else if (obj.message == 'not logged in') {
                that.onError('Error: could not obtain account info... Make sure you have an account currently open in in your wallet');
                that.disconnect(true);
            }
            else if (obj.message == 'A previouus request is still pending' ||
                obj.message == 'A previous request is still pending') {
                that.onError('Error: you have a pending action in your wallet');
            }
            else if (obj.message == 'user rejected') {
                that.onError('Error: transaction cancelled by user in ' + that.wallet);
            }
            else if (obj.message && (obj.message).startsWith('nexus mismatch')) {
                that.onError('Error: ' + obj.message);
            }
            else {
                if (obj.wallet) {
                    // that.onMessage(
                    //   obj.dapp +
                    //     ' dapp is now connected with ' +
                    //     obj.wallet +
                    //     '...'
                    // )
                }
                else if (obj.name) {
                    // that.onMessage(
                    //   'Account info obtained, connected with ' +
                    //     obj.name +
                    //     '...'
                    // )
                }
                else if (obj.hash) {
                    // that.onMessage('Transaction accepted on wallet...')
                }
                else {
                    // that.onMessage(
                    //   'Got Phantasma Link answer: ' + obj.message
                    // )
                }
                var temp = that.requestCallback;
                if (temp == null) {
                    that.onError('Error: something bad happened');
                    return;
                }
                that.requestCallback = null;
                temp(obj);
            }
        };
        this.socket.onclose = function (event) {
            if (!event.wasClean) {
                if (that.onLogin)
                    that.onError('Error: connection terminated...');
                that.onLogin = null;
            }
        };
        this.socket.onerror = function (error) {
            if (error.message !== undefined) {
                that.onMessage('Error: ' + error.message);
            }
        };
    };
    phantasmaLink.prototype.retry = function () {
        this.createSocket();
    };
    Object.defineProperty(phantasmaLink.prototype, "dappID", {
        get: function () {
            return this.dapp;
        },
        enumerable: false,
        configurable: true
    });
    phantasmaLink.prototype.sendLinkRequest = function (request, callback) {
        this.onMessage('Sending Phantasma Link request: ' + request);
        if (this.token != null) {
            request = request + '/' + this.dapp + '/' + this.token;
        }
        this.requestID++;
        request = this.requestID + ',' + request;
        this.requestCallback = callback;
        this.socket.send(request);
    };
    phantasmaLink.prototype.disconnect = function (triggered) {
        this.onMessage('Disconnecting Phantasma Link');
        this.socket.close();
    };
    return phantasmaLink;
}());
exports.phantasmaLink = phantasmaLink;
function PavillionLink() {
    var _this = this;
    this._onMessage = function (e) {
        if (!e.data || !e.data.data) {
            return;
        }
        // console.log(e)
        if (e.data.type === 'pavillionLink/login') {
            _this.address = e.data.data.address;
            _this.balances = e.data.data.balances;
            if (_this.onLogin) {
                _this.onLogin(e.data.data);
                _this.onLogin = null;
            }
        }
        else if (e.data.type === 'pavillionLink/signAndSubmit') {
            if (_this.onSignAndSubmit) {
                _this.onSignAndSubmit(e.data.data);
                _this.onSignAndSubmit = null;
            }
        }
    };
    window.addEventListener('message', this._onMessage, {});
    this.login = function (callback) {
        this.onLogin = callback;
        window.parent.postMessage({ type: 'pavillionLink', data: { command: 'login' } }, '*');
    };
    this.sendTransaction = function (nexus, chain, script, payload, callback) {
        if (script.length >= 8192) {
            alert('script too big, sorry :(');
            return; // TODO callback with error
        }
        if (payload == null) {
            payload = '';
        }
        else if (typeof payload === 'string') {
            // NOTE: here we convert a string into raw bytes
            var sb = new vm_1.ScriptBuilder();
            var bytes = sb.rawString(payload);
            sb.appendBytes(bytes);
            // then we convert the bytes into hex, because thats what PhantasmaLink protocol expects
            payload = sb.str;
        }
        else {
            alert('invalid payload, sorry :(');
            return; // TODO callback with error
        }
        _this.onSignAndSubmit = callback;
        window.parent.postMessage({
            type: 'pavillionLink',
            data: {
                command: 'signAndSubmit',
                nexus: nexus,
                chain: chain,
                script: script,
                payload: payload
            }
        }, '*');
    };
}
