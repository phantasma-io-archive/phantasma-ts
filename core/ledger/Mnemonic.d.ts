import { LedgerConfig } from './interfaces/LedgerConfig';
export declare const SOUL_COIN: number;
/**
 * converts a mnemonic into a private key, using the phantasma coin's bip44 path.
 *
 * @param config the config
 * @param mnemonic the mnemonic
 * @param index the bip44 index
 * @return returns the private key, hex encoded, upper case.
 */
export declare const GetPrivateKeyFromMnemonic: (config: LedgerConfig, mnemonic: string, index: string) => string;
/**
 * converts a mnemonic into a seed.
 *
 * @param config the config
 * @param seed the seed
 * @param index the bip44 index
 * @return returns the seed, hex encoded, upper case.
 */
export declare const GetPrivateKeyFromSeed: (config: LedgerConfig, seed: string, index: string) => string;
/**
 * converts a mnemonic into a Poltergeist mnemonic, using the phantasma coin's bip44 path.
 *
 * @param config the config
 * @param mnemonic the mnemonic
 * @param index the index
 * @return returns the private key, hex encoded, upper case.
 */
export declare const GetPoltergeistMnemonic: (config: LedgerConfig, mnemonic: string, index: string) => string;
/**
 * @param index the index
 * @return returns the bip44 path.
 */
export declare const GetBip44Path: (index: string) => string;
//# sourceMappingURL=Mnemonic.d.ts.map