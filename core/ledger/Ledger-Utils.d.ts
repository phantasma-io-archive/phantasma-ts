/// <reference types="node" />
import { ApplicationNameResponse } from './interfaces/ApplicationNameResponse';
import { DeviceResponse } from './interfaces/DeviceResponse';
import { PublicKeyResponse } from './interfaces/PublicKeyResponse';
import { SignResponse } from './interfaces/SignResponse';
import { VersionResponse } from './interfaces/VersionResponse';
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
/**
 * Get's the error message.
 * @param responseStr
 * @returns
 */
export declare const GetErrorMessage: (responseStr: string) => string;
/**
 * Get Device
 * @param transport
 * @returns
 */
export declare const GetDevice: (transport: any) => Promise<DeviceResponse>;
/**
 * Get Application Name
 * @param transport
 * @returns
 */
export declare const GetApplicationName: (transport: any) => Promise<ApplicationNameResponse>;
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
/**
 * Get Public Key
 * @param transport
 * @param options
 * @returns
 */
export declare const GetPublicKey: (transport: any, options: any) => Promise<PublicKeyResponse>;
/**
 * Chunk String
 * @param str
 * @param length
 * @returns
 */
export declare const ChunkString: (str: any, length: any) => any;
export declare const SplitMessageIntoChunks: (ledgerMessage: any) => any;
export declare const DecodeSignature: (response: any) => any;
export declare const SignLedger: (transport: any, transactionHex: any) => Promise<SignResponse>;
//# sourceMappingURL=Ledger-Utils.d.ts.map