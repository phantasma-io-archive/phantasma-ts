/// <reference types="node" />
export declare const MAX_SIGNED_TX_LEN = 1024;
export declare const Bip44Path: string;
export declare const ErrorDescriptions: {
    '530C': string;
    '6D02': string;
    6511: string;
    '6E00': string;
    '6A86': string;
    '6A87': string;
    '6A88': string;
    '6A89': string;
    '6A90': string;
    6985: string;
    '6D06': string;
    B000: string;
    B002: string;
    B005: string;
    B008: string;
    B009: string;
};
export declare const hex2ascii: (hexx: string) => string;
export declare const GetErrorMessage: (responseStr: string) => string;
export interface DeviceResponse {
    enabled: boolean;
    error: boolean;
    message?: string;
    device?: any;
}
/**
 * Get Device
 * @param transport
 * @returns
 */
export declare const GetDevice: (transport: any) => Promise<DeviceResponse>;
export interface ApplicationNameResponse {
    success: boolean;
    message: string;
    applicationName?: string;
}
/**
 * Get Application Name
 * @param transport
 * @returns
 */
export declare const GetApplicationName: (transport: any) => Promise<ApplicationNameResponse>;
export interface VersionResponse {
    success: boolean;
    message: string;
    version?: string;
}
/**
 * Get Version
 * @param transport
 * @returns
 */
export declare const GetVersion: (transport: any) => Promise<VersionResponse>;
/**
 * Get Pip44 Path Message
 * @param messagePrefix
 * @returns
 */
export declare const GetBip44PathMessage: (messagePrefix: any) => Buffer;
export interface PublicKeyResponse {
    success: boolean;
    message: string;
    publicKey?: string;
}
/**
 * Get Public Key
 * @param transport
 * @param options
 * @returns
 */
export declare const GetPublicKey: (transport: any, options: any) => Promise<PublicKeyResponse>;
export declare const chunkString: (str: any, length: any) => any;
export declare const splitMessageIntoChunks: (ledgerMessage: any) => any[];
export declare const decodeSignature: (response: any) => any;
export interface SignResponse {
    success: boolean;
    message: string;
    signature?: string;
}
export declare const SignLedger: (transport: any, transactionHex: any) => Promise<SignResponse>;
//# sourceMappingURL=ledger-comm.d.ts.map