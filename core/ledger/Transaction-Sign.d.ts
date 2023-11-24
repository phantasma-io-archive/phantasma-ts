/// <reference types="node" />
declare const GetHash: (encodedTx: string, debug?: boolean) => Buffer;
declare const Sign: (encodedTx: string, privateKeyHex: string) => string;
export declare const Verify: (encodedTx: string, signatureHex: string, publicKeyHex: string) => boolean;
declare const GetPublicFromPrivate: (privateKey: string) => string;
export { Sign, GetHash, GetPublicFromPrivate };
//# sourceMappingURL=Transaction-Sign.d.ts.map