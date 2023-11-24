import { GetPrivateKeyFromMnemonic, Signature } from '..';
import { Transaction } from '../tx';
import { Address, Base16, Ed25519Signature, PBinaryReader } from '../types';
import { GetAddressFromPublicKey, GetAddressPublicKeyFromPublicKey } from './Address-Transcode';
import { LedgerConfig } from './LedgerConfig';
import { GetPublicFromPrivate, Sign, Verify } from './Transaction-Sign';
import { GetExpirationDate } from './Transaction-Transcode';
import {
  GetVersion,
  GetApplicationName,
  GetPublicKey,
  SignLedger,
  VersionResponse,
  ApplicationNameResponse,
} from './Ledger-Utils';

export const LeftPad = (number, length) => {
  let str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
};

export const ToWholeNumber = (balance, decimals) => {
  if (balance === undefined) {
    throw Error('balance is a required parameter.');
  }
  if (decimals === undefined) {
    throw Error('decimals is a required parameter.');
  }
  // console.log('toWholeNumber', 'balance', balance);
  const paddedBalance = LeftPad(balance, decimals + 1);
  // console.log('toWholeNumber', 'paddedBalance', paddedBalance);
  const prefixLength = paddedBalance.length - decimals;
  // console.log('toWholeNumber', 'prefixLength', prefixLength);
  const prefix = paddedBalance.slice(0, prefixLength);
  // console.log('toWholeNumber', 'prefix', prefix);
  const suffix = paddedBalance.slice(-decimals);
  // console.log('toWholeNumber', 'suffix', suffix);
  return `${prefix}.${suffix}`;
};

export interface LedgerDeviceInfoResponse {
  version: VersionResponse;
  applicationName: ApplicationNameResponse;
}

export const GetLedgerDeviceInfo = async (
  config: LedgerConfig
): Promise<LedgerDeviceInfoResponse> => {
  if (config == undefined) {
    throw Error('config is a required parameter.');
  }
  const version = await GetVersion(config.Transport);
  const applicationName = await GetApplicationName(config.Transport);

  return {
    version: version,
    applicationName: applicationName,
  };
};

export const GetBalanceFromLedger = async (config: LedgerConfig, options) => {
  /* istanbul ignore if */
  if (config == undefined) {
    throw Error('config is a required parameter.');
  }
  /* istanbul ignore if */
  if (options == undefined) {
    throw Error('options is a required parameter.');
  }
  const msg = await GetPublicKey(config.Transport, options);
  /* istanbul ignore if */
  if (config.Debug) {
    console.log('getBalanceFromLedger', 'msg', msg);
  }
  if (msg.success) {
    const publicKey = msg.publicKey;
    const address = GetAddressPublicKeyFromPublicKey(publicKey!);
    /* istanbul ignore if */
    if (config.Debug) {
      console.log('address', address);
      console.log('rpc', config.RPC);
    }

    console.log('rpcAwait', await config.RPC.getAccount(address.Text));
    const rpcResponse = await config.RPC.getAccount(address.Text);
    if (config.Debug) {
      console.log('rpcResponse', rpcResponse);
    }
    const response: any = {};
    response.balances = {};
    if (rpcResponse.balances !== undefined) {
      rpcResponse.balances.forEach((balanceElt) => {
        response.balances[balanceElt.symbol] = ToWholeNumber(
          balanceElt.amount,
          balanceElt.decimals
        );
      });
    }
    response.address = address;
    response.success = true;
    return response;
  } else {
    return msg;
  }
};

export const GetAddressFromLedeger = async (config, options) => {
  /* istanbul ignore if */
  if (config == undefined) {
    throw Error('config is a required parameter.');
  }
  /* istanbul ignore if */
  if (options == undefined) {
    throw Error('options is a required parameter.');
  }
  const msg = await GetPublicKey(config.transport, options);
  /* istanbul ignore if */
  if (config.Debug) {
    console.log('getBalanceFromLedger', 'msg', msg);
  }
  if (msg.success) {
    const publicKey = msg.publicKey!;
    const address = GetAddressFromPublicKey(publicKey);
    return address;
  } else {
    return msg;
  }
};

async function SignEncodedTx(encodedTx, config) {
  const response = await SignLedger(config.transport, encodedTx);
  /* istanbul ignore if */
  if (config.Debug) {
    console.log('sendAmountUsingLedger', 'signCallback', 'response', response);
  }
  if (response.success) {
    return response.signature;
  } else {
    throw Error(response.message);
  }
}

export async function SendTransactionLedger(config: LedgerConfig, script: string) {
  if (config == undefined) {
    throw Error('config is a required parameter.');
  }

  const options = { verifyOnDevice: false };
  const msg_publicKey = await GetPublicKey(config, options);
  if (!msg_publicKey.success) {
    if (config.Debug) {
      console.log('SendTransactionLedger', 'error ', msg_publicKey);
    }
    return msg_publicKey;
  }

  const addr = GetAddressPublicKeyFromPublicKey(msg_publicKey.publicKey!);
  const publicKey = msg_publicKey.publicKey!;

  const nexusName = config.NexusName;
  const chainName = config.ChainName;
  const gasPrice = config.GasPrice;
  const gasLimit = config.GasLimit;

  const expirationDate = GetExpirationDate();

  // no payload, could be a message.
  const payload = config.Payload;

  const myTransaction = new Transaction(
    nexusName, // Nexus Name
    chainName, // Chain
    script, // In string format
    expirationDate, // Expiration Date
    payload
  ); // Extra Info to attach to Transaction in Serialized Hex

  const encodedTx = Base16.encodeUint8Array(myTransaction.ToByteAray(false));

  try {
    if (config.Debug) {
      console.log('sendAmountUsingCallback', 'encodedTx', encodedTx);
    }

    const signature = await SignEncodedTx(encodedTx, config);

    if (config.Debug) {
      console.log('sendAmountUsingCallback', 'signature', signature);
    }

    if (config.VerifyResponse) {
      const verifyResponse = Verify(encodedTx, signature!, publicKey);
      if (verifyResponse == false) {
        throw Error(
          `invalidSignature encodedTx:'${encodedTx}', publicKey:'${publicKey}' signature:'${signature}'`
        );
      }

      if (config.Debug) {
        console.log('verifyResponse', verifyResponse);
      }
    }

    let signatureBytes = Base16.decodeUint8Array(signature!);
    let mySignature = new Ed25519Signature(signatureBytes);
    let myNewSignaturesArray: Signature[] = [];
    myNewSignaturesArray.push(mySignature);
    myTransaction.signatures = myNewSignaturesArray;

    if (config.Debug) {
      console.log('signedTx', myTransaction);
    }

    const encodedSignedTx = Base16.encodeUint8Array(myTransaction.ToByteAray(true));
    console.log('encoded signed tx: ', encodedSignedTx);

    const txHash = await config.RPC.sendRawTransaction(encodedSignedTx);
    if (config.Debug) {
      console.log('sendAmountUsingCallback', 'txHash', txHash);
    }

    const response: any = {};
    response.success = true;
    response.message = txHash;

    if (txHash !== undefined) {
      response.success = false;
    }

    /* istanbul ignore if */
    if (config.Debug) {
      console.log('response', response);
    }
    return response;
  } catch (error) {
    if (config.Debug) {
      console.log('error', error);
    }

    const errorResponse: any = {};
    errorResponse.success = false;
    errorResponse.message = error.message;
    return errorResponse;
  }
}

export const GetBalanceFromPrivateKey = async (config, privateKey) => {
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
  // https://github.com/phantasma-io/phantasma-ts/blob/7d04aaed839851ae5640f68ab223ca7d92c42016/core/tx/utils.js
  const publicKey = GetPublicFromPrivate(privateKey);
  /* istanbul ignore if */
  if (config.Debug) {
    console.log('publicKey', publicKey);
  }
  const address = GetAddressFromPublicKey(publicKey);
  /* istanbul ignore if */
  if (config.Debug) {
    console.log('address', address);
  }
  // const path = `/address/${address}`;
  // const response = await httpRequestUtil.get(config, path);
  const rpcResponse = await config.RPC.getAccount(address);
  if (config.Debug) {
    console.log('rpcResponse', rpcResponse);
  }
  const response: any = {};
  response.balances = {};
  if (rpcResponse.balances !== undefined) {
    rpcResponse.balances.forEach((balanceElt) => {
      response.balances[balanceElt.symbol] = ToWholeNumber(balanceElt.amount, balanceElt.decimals);
    });
  }
  response.address = address;
  response.success = true;
  // const lastRefPath = `/transaction/last-ref/${address}`;
  // const lastRefResponse = await httpRequestUtil.get(config, lastRefPath);
  // response.lastRef = lastRefResponse;
  return response;
};

export const GetBalanceFromMnemonic = async (config: LedgerConfig, mnemonic: string, index) => {
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
  const privateKey = GetPrivateKeyFromMnemonic(config, mnemonic, index);
  return await GetBalanceFromPrivateKey(config, privateKey);
};
