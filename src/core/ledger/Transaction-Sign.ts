import * as crypto from 'crypto';

const PUBLIC_KEY_PREFIX = '302A300506032B6570032100';
const DEBUG = false;

export const PrivateToDer = (privateKeyHex: string): Buffer => {
  if (DEBUG) {
    console.log('privateToDer', 'privateKeyHex', privateKeyHex);
  }
  const derHex = `302e020100300506032b657004220420${privateKeyHex}`;
  if (DEBUG) {
    console.log('privateToDer', 'derHex', derHex);
  }
  return Buffer.from(derHex, 'hex');
};

export const PublicToDer = (publicKeyHex: string): Buffer => {
  const publicKeyDerHex = `${PUBLIC_KEY_PREFIX}${publicKeyHex}`;
  return Buffer.from(publicKeyDerHex, 'hex');
};

export const PublicToPem = (publicKeyHex: string): string => {
  const publicKeyDer = PublicToDer(publicKeyHex);
  const publicKeyDerBase64 = publicKeyDer.toString('base64');
  return `-----BEGIN PUBLIC KEY-----\n${publicKeyDerBase64}\n-----END PUBLIC KEY-----`;
};

export const SignBytes = (hash: Buffer, privateKey: Buffer): string => {
  if (DEBUG) {
    console.log('signBytes.hash', hash);
    console.log('signBytes.privateKey', privateKey);
  }
  const privateKeyDer = PrivateToDer(privateKey.toString('hex'));
  if (DEBUG) {
    console.log('signBytes.privateKeyDer', privateKeyDer);
  }
  const privateKeyObj = crypto.createPrivateKey({
    key: privateKeyDer,
    format: 'der',
    type: 'pkcs8',
  });
  const signature = crypto.sign(undefined, hash, privateKeyObj);
  const signatureHex = signature.toString('hex');
  if (DEBUG) {
    console.log('signatureHex', signatureHex);
  }
  return signatureHex;
};

export const GetHash = (encodedTx: string, debug?: boolean): Buffer => {
  return Buffer.from(encodedTx, 'hex');
};

export const Sign = (encodedTx: string, privateKeyHex: string): string => {
  if (DEBUG) {
    console.log('sign', 'encodedTx', encodedTx);
  }
  const privateKey = Buffer.from(privateKeyHex, 'hex');
  if (DEBUG) {
    console.log('sign', 'privateKey', privateKey.toString('hex'));
  }

  const hash = GetHash(encodedTx);
  if (DEBUG) {
    console.log('sign', 'hash', hash.toString('hex'));
  }
  const signature = SignBytes(hash, privateKey);
  if (DEBUG) {
    console.log('sign', 'signature', signature);
  }
  return signature.toLowerCase();
};

export const Verify = (encodedTx: string, signatureHex: string, publicKeyHex: string): boolean => {
  if (DEBUG) {
    console.log('verify', 'encodedTx', encodedTx);
    console.log('verify', 'signatureHex', signatureHex);
    console.log('verify', 'publicKeyHex', publicKeyHex);
  }
  const publicKeyPem = PublicToPem(publicKeyHex);
  if (DEBUG) {
    console.log('verify', 'publicKeyPem', publicKeyPem);
  }
  const publicKeyObj = crypto.createPublicKey({
    key: publicKeyPem,
    format: 'pem',
    type: 'spki',
  });
  const signature = Buffer.from(signatureHex, 'hex');
  const hash = GetHash(encodedTx);
  if (DEBUG) {
    console.log('verify', 'hash', hash.toString('hex'));
  }
  return crypto.verify(undefined, hash, publicKeyObj, signature);
};

export const GetPublicFromPrivate = (privateKey: string): string => {
  const privateKeyDer = PrivateToDer(privateKey);
  const privateKeyObj = crypto.createPrivateKey({
    key: privateKeyDer,
    format: 'der',
    type: 'pkcs8',
  });
  const privateKeyString = privateKeyObj.export({ format: 'der', type: 'pkcs8' });
  /*const publicKeyObj = crypto.createPublicKey({
    key: privateKeyObj,
    format: 'pem',
    type: 'sec1',
  });*/
  const publicKeyObj = crypto.createPublicKey({
    key: privateKeyString,
    format: 'pem',
    type: 'spki',
  });
  const encodedHex = publicKeyObj
    .export({ format: 'der', type: 'spki' })
    .toString('hex')
    .toUpperCase();
  if (encodedHex.startsWith(PUBLIC_KEY_PREFIX)) {
    return encodedHex.substring(PUBLIC_KEY_PREFIX.length);
  } else {
    throw new Error(
      `unknown prefix, expecting '${PUBLIC_KEY_PREFIX}' cannot decode public key '${encodedHex}'`
    );
  }
};
