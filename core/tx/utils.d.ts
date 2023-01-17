export declare function getPrivateKeyFromWif(wif: string): string;
export declare function getAddressFromWif(wif: string): string;
export declare function generateNewSeed(): string;
export declare function generateNewSeedWords(): string[];
export declare function generateNewWif(): string;
export declare function getWifFromPrivateKey(privateKey: string): string;
export declare function signData(msgHex: string, privateKey: string): string;
export declare function verifyData(msgHex: string, phaSig: string, address: string): boolean;
//# sourceMappingURL=utils.d.ts.map