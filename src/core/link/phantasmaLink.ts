import { Storage } from '../rpc/interfaces/Storage';
import { Stake } from '../rpc/interfaces/Stake';
import { ScriptBuilder } from '../vm';
import { ProofOfWork } from './interfaces/ProofOfWork';
import { IAccount } from './interfaces/IAccount';

export class PhantasmaLink {
  //Declarations
  host: string;
  dapp: any;
  onLogin: (succ: any) => void;
  providerHint: any;
  onError: (message: any) => void;
  socket: any;
  requestCallback: any;
  token: any;
  requestID: number = 0;
  account: IAccount;
  wallet: any;
  messageLogging: boolean;
  version: number;
  nexus: string;
  chain: string;
  platform: string;

  //Construct The Link
  constructor(dappID: any, logging: boolean = true) {
    this.version = 2;
    this.nexus = 'testnet';
    this.chain = 'main';
    this.platform = 'poltergeist';

    //Turn On|Off Console Logging
    if (logging == false) {
      this.messageLogging = false;
    } else {
      this.messageLogging = true;
      console.log('%cPhantasmaLink created', 'color:green');
    }

    this.requestID = 0;
    //Standard Sets
    this.host = 'localhost:7090';
    this.dapp = dappID;
    this.onLogin = function (succ) {}; //Does Nothing for Now
    this.onError = function (message) {}; //Does Nothing for Now
  }

  //Message Logging
  onMessage = (msg: string) => {
    if (this.messageLogging == true) {
      console.log(msg);
    }
  };

  //Connect To Wallet
  login(
    onLoginCallback: (success: boolean) => void,
    onErrorCallback: (message: string) => void,
    version: number = 2,
    platform: string = 'phantasma',
    providerHint: string = 'poltergeist'
  ) {
    this.providerHint = providerHint;
    this.onLogin = onLoginCallback;
    this.onError = onErrorCallback;
    this.version = version;
    this.platform = platform;
    this.providerHint = providerHint;
    this.createSocket();
  }

  //Script Invoking With Wallet Connection
  invokeScript(script: string, callback: (message: string) => void) {
    this.onMessage('Relaying transaction to wallet...');
    if (!this.socket) {
      callback('not logged in');
      return;
    }

    if (script.length >= 8192) {
      callback('script too big, sorry :(');
      return;
    }
    let requestStr = this.chain + '/' + script;
    if (this.version >= 2) {
      requestStr = requestStr;
    } else {
      requestStr = this.nexus + '/' + requestStr;
    }

    let invokeScriptRequest = 'invokeScript/' + requestStr;

    var that = this;
    this.sendLinkRequest(invokeScriptRequest, function (result) {
      if (result.success) {
        that.onMessage('Invoke successful, hash: ' + result + '...');
        if (callback) {
          callback(result);
        }
      }
    });
  }

  //Wallet Transaction Signing + Sending
  signTx(
    script: any,
    payload: string | null,
    callback: (arg0: string) => void,
    onErrorCallback: () => void,
    pow = ProofOfWork.None,
    signature = 'Ed25519'
  ) {
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
    } else if (typeof payload === 'string') {
      //Turn String Payload -> Bytes -> Hex
      let sb = new ScriptBuilder();
      let bytes = sb.RawString(payload);
      sb.AppendBytes(bytes);
      payload = sb.EndScript();
    } else {
      this.onMessage('Error: Invalid Payload');
      if (onErrorCallback) {
        onErrorCallback();
      }
      return;
    }

    this.onError = onErrorCallback; //Sets Error Callback Function
    let that = this; //Allows the use of 'this' inside sendLinkRequest Object

    let request =
      'signTx/' +
      this.chain +
      '/' +
      script +
      '/' +
      payload +
      '/' +
      signature +
      '/' +
      this.platform +
      '/' +
      pow;

    if (this.version == 1) {
      request = 'signTx/' + this.nexus + '/' + this.chain + '/' + script + '/' + payload;
    }

    //Sends Signiture Request To Connected Wallet For Script
    this.sendLinkRequest(request, function (result) {
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
        }
      }
    });
  }

  // Wallet Transaction Signing
  signTxSignature(
    tx: string,
    callback: (result: string) => void,
    onErrorCallback: () => void,
    signature: string = 'Ed25519'
  ) {
    if (!this.socket) {
      this.onMessage('not logged in');
      return;
    }
    if (tx == null) {
      this.onMessage('invalid data, sorry :(');
      return;
    }

    if (tx.length >= 1024) {
      this.onMessage('data too big, sorry :(');
      if (onErrorCallback) {
        onErrorCallback();
      }
      return;
    }

    let signDataStr = 'signTxSignature/' + tx + '/' + signature + '/' + this.platform;

    var that = this; //Allows the use of 'this' inside sendLinkRequest Object

    this.sendLinkRequest(signDataStr, function (result) {
      if (result.success) {
        that.onMessage('Data successfully signed');
        if (callback) {
          callback(result);
        }
      } else {
        if (onErrorCallback) {
          onErrorCallback();
        }
      }
    });
  }

  multiSig(
    subject: string,
    callback: (result: string) => void,
    onErrorCallback: () => void,
    signature: string = 'Ed25519'
  ) {
    if (!this.socket) {
      this.onMessage('not logged in');
      return;
    }
    if (subject == null) {
      this.onMessage('invalid data, sorry :(');
      return;
    }

    if (subject.length >= 1024) {
      this.onMessage('data too big, sorry :(');
      if (onErrorCallback) {
        onErrorCallback();
      }
      return;
    }

    let signDataStr = 'multiSig/' + subject + '/' + signature + '/' + this.platform;

    var that = this; //Allows the use of 'this' inside sendLinkRequest Object

    this.sendLinkRequest(signDataStr, function (result) {
      if (result.success) {
        that.onMessage('Data successfully signed');
        if (callback) {
          callback(result);
        }
      } else {
        if (onErrorCallback) {
          onErrorCallback();
        }
      }
    });
  }

  getPeer(callback: (result: string) => void, onErrorCallback: () => void) {
    this.onError = onErrorCallback; //Sets Error Callback Function
    let that = this; //Allows the use of 'this' inside sendLinkRequest Object

    //Sends Signiture Request To Connected Wallet For Script
    this.sendLinkRequest('getPeer/', function (result) {
      if (result.success) {
        that.onMessage('Peer Query,: ' + result);
        if (callback) {
          callback(result);
        }
      } else {
        if (onErrorCallback) {
          onErrorCallback();
        }
      }
    });
  }

  fetchWallet(callback: (result: any) => void, onErrorCallback: (message: any) => void) {
    let that = this; //Allows the use of 'this' inside sendLinkRequest Object
    let getAccountRequest = 'getAccount/' + this.platform;
    this.sendLinkRequest(getAccountRequest, function (result) {
      if (result.success) {
        that.account = result;
        callback(result);
      } else {
        onErrorCallback(
          'Could not obtain account info... Make sure you have an account currently open in ' +
            that.wallet +
            '...'
        );
        //that.disconnect("Unable to optain Account Info");
      }

      //that.onLogin(result.success);
      //that.onLogin = null;
    });
  }

  getNexus(callback: (message: any) => void, onErrorCallback: (message: any) => void) {
    this.onError = onErrorCallback; //Sets Error Callback Function
    let that = this; //Allows the use of 'this' inside sendLinkRequest Object

    //Sends Signiture Request To Connected Wallet For Script
    this.sendLinkRequest('getNexus/', function (result) {
      if (result.success) {
        that.onMessage('Nexus Query,: ' + result);
        if (callback) {
          callback(result);
        }
      } else {
        if (onErrorCallback) {
          onErrorCallback('Error: ' + result.error);
        }
      }
    });
  }

  getWalletVersion(callback: (message: any) => void, onErrorCallback: (message: any) => void) {
    this.onError = onErrorCallback; //Sets Error Callback Function
    let that = this; //Allows the use of 'this' inside sendLinkRequest Object

    //Sends Signiture Request To Connected Wallet For Script
    this.sendLinkRequest('getWalletVersion/', function (result) {
      if (result.success) {
        that.onMessage('Wallet Version Query,: ' + result);
        if (callback) {
          callback(result);
        }
      } else {
        if (onErrorCallback) {
          onErrorCallback('Error: ' + result.error);
        }
      }
    });
  }

  //Uses Wallet To Sign Data With Signiture
  // Data needs to be in Base16 encode.
  signData(
    data: string,
    callback: (success: string) => void,
    onErrorCallback: (message: string) => void,
    signature: string = 'Ed25519'
  ) {
    if (!this.socket) {
      this.onMessage('not logged in');
      return;
    }
    if (data == null) {
      this.onMessage('invalid data, sorry :(');
      return;
    }

    if (data.length >= 1024) {
      this.onMessage('data too big, sorry :(');
      if (onErrorCallback) {
        onErrorCallback('data too big, sorry :(');
      }
      return;
    }

    let signDataStr = 'signData/' + data + '/' + signature + '/' + this.platform;

    var that = this; //Allows the use of 'this' inside sendLinkRequest Object

    this.sendLinkRequest(signDataStr, function (result) {
      if (result.success) {
        that.onMessage('Data successfully signed');
        if (callback) {
          callback(result);
        }
      } else {
        if (onErrorCallback) {
          onErrorCallback(result);
        }
      }
    });
  }

  //Wallet Socket Connection Creation
  createSocket(isResume: boolean = false) {
    let path = 'ws://' + this.host + '/phantasma';
    this.onMessage('Phantasma Link connecting...');

    if (this.socket) {
      this.socket.close();
    }

    //@ts-ignore
    this.socket = //@ts-ignore
      window.PhantasmaLinkSocket && this.providerHint !== 'poltergeist'
        ? // @ts-ignore
          new PhantasmaLinkSocket()
        : new WebSocket(path);

    this.requestCallback = null;
    this.token = null;
    this.account = null;
    this.requestID = 0;
    let authorizeRequest = 'authorize/' + this.dapp + '/' + this.version;
    let getAccountRequest = 'getAccount/' + this.platform;
    let that = this;

    //Once Socket Opened
    this.socket.onopen = function (e) {
      that.onMessage('Connection established, authorizing dapp in wallet...');
      if (isResume) {
        that.fetchWallet(undefined, undefined);
      } else {
        that.sendLinkRequest(authorizeRequest, function (result) {
          //Set Global Variables With Successful Account Query
          if (result.success) {
            that.token = result.token;
            that.wallet = result.wallet;
            that.onMessage('Authorized, obtaining account info...');
            that.sendLinkRequest(getAccountRequest, function (result) {
              if (result.success) {
                that.account = result;
              } else {
                that.onError(
                  'Could not obtain account info... Make sure you have an account currently open in ' +
                    that.wallet +
                    '...'
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
    };

    //Retrieves Message From Socket and Processes It
    this.socket.onmessage = function (event) {
      const obj = JSON.parse(event.data);
      if (that.messageLogging == true) {
        console.log('%c' + event.data, 'color:blue');
      }

      //Checks What To Do Based On Message
      switch (obj.message) {
        case 'Wallet is Closed':
          that.onError(
            'Could not obtain account info... Make sure you have an account currently open in ' +
              that.wallet
          );
          that.disconnect(true);
          break;

        case 'not logged in':
          that.onError(
            'Could not obtain account info... Make sure you have an account currently logged in'
          );
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
          if (obj.message && obj.message.startsWith('nexus mismatch')) {
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
  }

  //Message Logging Util
  toggleMessageLogging() {
    if (this.messageLogging == true) {
      this.messageLogging = false;
    } else {
      this.messageLogging = true;
    }
  }

  resume(token: any) {
    this.token = token;
    this.retry();
  }

  //Retry Util
  retry() {
    this.createSocket();
  }

  //Get Dapp ID Name Util
  set dappID(dapp) {
    this.dapp = dapp;
  }

  get dappID() {
    return this.dapp;
  }

  //Build Request and Send To Wallet Via Socket
  sendLinkRequest(request: string, callback: (T: any) => void) {
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
  disconnect(triggered: string | boolean | undefined) {
    this.onMessage('Disconnecting Phantasma Link: ' + triggered);
    if (this.socket) this.socket.close();
  }
}
