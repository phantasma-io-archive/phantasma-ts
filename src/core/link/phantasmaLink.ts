import { ScriptBuilder } from "../vm";

export enum ProofOfWork {
    None = 0,
    Minimal = 5,
    Moderate = 15,
    Hard = 19,
    Heavy = 24,
    Extreme = 30
}

export class PhantasmaLink {

    //Declarations
    host: string
    dapp: any
    onLogin: (succ: any) => void
    providerHint: any
    onError: any
    socket: any
    requestCallback: any
    token: any
    requestID: number = 0
    account: any
    wallet: any
    messageLogging: boolean
    version: number
    nexus: string
    chain: string
    platform: string

    //Construct The Link
    constructor(dappID: any, logging: boolean = true) {
        this.version = 2;
        this.nexus = "testnet";
        this.chain = "main";
        this.platform = "poltergeist";

        //Turn On|Off Console Logging
        if(logging == false){
            this.messageLogging = false;
        }else{
            this.messageLogging = true;
            console.log('%cPhantasmaLink created', 'color:green');
        }

        this.requestID = 0;
        //Standard Sets
        this.host = 'localhost:7090';
        this.dapp = dappID;
        this.onLogin = function(succ) {} //Does Nothing for Now
    }

    //Message Logging
    onMessage = (msg) => {
        if (this.messageLogging == true){
            console.log(msg);
        }
    }

    //Connect To Wallet
    login(onLoginCallback, onErrorCallback, version = 2, platform = "phantasma", providerHint = "poltergeist") {
        this.providerHint = providerHint;
        this.onLogin = onLoginCallback;
        this.onError = onErrorCallback;
        this.version = version;
        this.platform = platform;
        this.providerHint = providerHint;
        this.createSocket();
    }

    //Script Invoking With Wallet Connection
    invokeScript(script, callback) {
        this.onMessage('Relaying transaction to wallet...');
        if (!this.socket) {
            callback("not logged in");
            return;
        }

        if (script.length >= 8192) {
            callback("script too big, sorry :(");
            return;
        }

		let requestStr = this.chain + "/" + script;
        if (this.version >= 2) {
            requestStr = requestStr;
        } else {
            requestStr = this.nexus + "/" + requestStr;
        }

        requestStr = 'invokeScript/' + requestStr;

        var that = this;
        this.sendLinkRequest(requestStr, function(result) {
            if (result.success) {
                that.onMessage('Invoke successful, hash: ' + result + '...');
                if (callback) {
                    callback(result);
                }
            }
        });
    }

    //Wallet Transaction Signing + 
    signTx(script, payload: string | null, callback: (arg0: any) => void, onErrorCallback: () => void, pow = ProofOfWork.None, signature = "Ed25519") {
        
        //Checks If Needed Script Is In Object
        if (script.script) {
            script = script.script
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
            payload = '7068616e7461736d612d7473';    //Says 'Phantasma-ts' in hex
        } else if (typeof payload === 'string') {    //Turn String Payload -> Bytes -> Hex
            let sb = new ScriptBuilder();
            let bytes = sb.rawString(payload);
            sb.appendBytes(bytes);
            payload = sb.endScript();
        } else {
            this.onMessage('Error: Invalid Payload');
            if (onErrorCallback) {
                onErrorCallback();
            }
            return;
        }

        this.onError = onErrorCallback  //Sets Error Callback Function
        let that = this                 //Allows the use of 'this' inside sendLinkRequest Object
       
        let request =  'signTx/' + this.chain + '/' + script + '/' + payload + '/' + signature + '/' + this.platform + '/' + pow;
        
        if ( this.version == 1)
        {
            request = 'signTx/' + this.nexus + '/' + this.chain + '/' + script + '/' + payload;
        }

        //Sends Signiture Request To Connected Wallet For Script
        this.sendLinkRequest(
            request,
            function(result) {
                if (result.success) {          
                    if (result.hash.error) {
                        that.onMessage('Error: ' + result.hash.error);
                        return;
                    }
                    that.onMessage('Transaction successful, hash: ' + result.hash.substr(0, 15) + '...');
                    if (callback) {
                        callback(result);
                    }
                } else {
                    if (onErrorCallback) {
                        onErrorCallback();
                    };
                }
            }
        )
    }


    getPeer(callback, onErrorCallback){

        this.onError = onErrorCallback  //Sets Error Callback Function
        let that = this                 //Allows the use of 'this' inside sendLinkRequest Object

        //Sends Signiture Request To Connected Wallet For Script
        this.sendLinkRequest(
            'getPeer/',
            function(result) {
                if (result.success) {          
                    that.onMessage('Peer Query,: ' + result);
                    if (callback) {
                        callback(result);
                    }
                } else {
                    if (onErrorCallback) {
                        onErrorCallback();
                    };
                }
            }
        )

    }

    //Uses Wallet To Sign Data With Signiture
    signData(data, callback, onErrorCallback) {
        
        //Checks If Needed Data Is In Object
        if (data.data) {
            data = data.data
        }
        
        //Overload Protection
        if (data.length >= 65536) {
            this.onMessage('Error: data is too big!')
            if (onErrorCallback) {
                onErrorCallback();
            }
            return;
        }

        var that = this;    //Allows the use of 'this' inside sendLinkRequest Object

        this.sendLinkRequest(
            'signData/' + data + '/1',
            function(result) {
                if (result.success) {          
                    that.onMessage('Data successfully signed');
                    if (callback) {
                        callback(result);
                    }
                }
                else {
                    if (onErrorCallback) {
                        onErrorCallback();
                    }
                }
            }
        )
    }

    //Wallet Socket Connection Creation
    createSocket() {

        let path = 'ws://' + this.host + '/phantasma'
        this.onMessage('Phantasma Link connecting...')
        
        if (this.socket){
            this.socket.close();
        }
        
        // @ts-ignore
        this.socket = window.PhantasmaLinkSocket && this.providerHint!=='poltergeist'
            // @ts-ignore
            ? new PhantasmaLinkSocket()
            : new WebSocket(path);

        this.requestCallback = null;
        this.token = null;
        this.account = null;
        this.requestID = 0;
        let that = this;

        //Once Socket Opened
        this.socket.onopen = function(e) {
                
            that.onMessage('Connection established, authorizing dapp in wallet...');
            that.sendLinkRequest('authorize/' + that.dapp, function(result) {
                    
                //Set Global Variables With Successful Account Query
                if (result.success) {
                    that.token = result.token;
                    that.wallet = result.wallet;
                    that.onMessage('Authorized, obtaining account info...');
                    that.sendLinkRequest('getAccount', function(result) {
                        if (result.success) {
                            that.account = result;
                        } else {
                            that.onError(
                                'Could not obtain account info... Make sure you have an account currently open in ' +
                                that.wallet + '...'
                            );
                            that.disconnect('Unable to optain Account Info');
                        }

                        that.onLogin(result.success);
                        that.onLogin = null;
                    });
                } else {
                    that.onError('Authorization failed...');
                    that.disconnect('Auth Failure');
                }
            });
        }

        //Retrieves Message From Socket and Processes It
        this.socket.onmessage = function(event) {
        
            const obj = JSON.parse(event.data)
            if(that.messageLogging == true){
                console.log('%c' + event.data, 'color:blue');
            }

            //Checks What To Do Based On Message
            switch(obj.message){
                case 'Wallet is Closed':
                    that.onError('Could not obtain account info... Make sure you have an account currently open in ' + that.wallet);
                    that.disconnect(true);
                break;

                case 'not logged in':
                    that.onError('Could not obtain account info... Make sure you have an account currently logged in');
                    that.disconnect(true);
                break;

                case 'A previouus request is still pending' || 'A previous request is still pending':
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
                    } else {
                        let temp = that.requestCallback;
                        if (temp == null) {
                            that.onError('Something bad happened');
                            return;
                        }
                        that.requestCallback = null;
                        temp(obj);
                    }
                break;
            }
        }

        //Cleanup After Socket Closes
        this.socket.onclose = function(event) {
            if (!event.wasClean) {
                if (that.onLogin){
                    that.onError('Connection terminated...');
                }
                that.onLogin = null;
            }
        }

        //Error Callback When Socket Has Error
        this.socket.onerror = function(error) {
            if (error.message !== undefined) {
                that.onMessage('Error: ' + error.message);
            }
        }
    }

    //Message Logging Util
    toggleMessageLogging(){
        if(this.messageLogging == true){
            this.messageLogging = false;
        }else{
            this.messageLogging = true;
        }
    }

    //Retry Util
    retry() {
        this.createSocket()
    }

    //Get Dapp ID Name Util
    get dappID() {
        return this.dapp
    }

    //Build Request and Send To Wallet Via Socket
    sendLinkRequest(request, callback) {
        this.onMessage('Sending Phantasma Link request: ' + request);

        if (this.token != null) {
            request = request + '/' + this.dapp + '/' + this.token;
        }

        this.requestID++; //Object Nonce Increase?
        request = this.requestID + ',' + request;
        this.requestCallback = callback;
        
        this.socket.send(request);
    }

    //Disconnect The Wallet Connection Socket
    disconnect(triggered) {
        this.onMessage('Disconnecting Phantasma Link: ' + triggered);
        this.socket.close();
    }
}
