import { Address } from '../types';
/**
 * Gets the address from a private key.
 * @param privateKey The private key as a string.
 * @returns The address as a string.
 */
export declare const GetAddressFromPrivateKey: (privateKey: string) => string;
/**
 * Gets the address from a public key.
 * @param publicKey The public key as a string.
 * @returns The address as a string.
 */
export declare const GetAddressFromPublicKey: (publicKey: string) => string;
export declare const GetAddressPublicKeyFromPublicKey: (publicKey: string) => Address;
//# sourceMappingURL=Address-Transcode.d.ts.map