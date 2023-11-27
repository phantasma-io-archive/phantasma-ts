import { PublicKeyResponse } from '..';
import { LedgerConfig } from './interfaces/LedgerConfig';
import { LedgerDeviceInfoResponse } from './interfaces/LedgerDeviceInfoResponse';
import { LedgerBalanceFromLedgerResponse } from './interfaces/LedgerBalanceFromLedgerResponse';
import { LedgerSigner } from './interfaces/LedgerSigner';
/**
 *
 * @param number
 * @param length
 * @returns
 */
export declare const LeftPad: (number: any, length: any) => string;
/**
 *
 * @param balance
 * @param decimals
 * @returns
 */
export declare const ToWholeNumber: (balance: any, decimals: any) => string;
/**
 * Get the device info from the ledger.
 * @param config
 * @returns
 */
export declare const GetLedgerDeviceInfo: (config: LedgerConfig) => Promise<LedgerDeviceInfoResponse>;
/**
 * Get Ledger Account Signer
 * @param config
 * @param accountIx
 * @returns
 */
export declare const GetLedgerAccountSigner: (config: LedgerConfig, accountIx: any) => Promise<LedgerSigner>;
/**
 * GetBalanceFromLedger
 * @param config
 * @param options
 * @returns
 */
export declare const GetBalanceFromLedger: (config: LedgerConfig, options: any) => Promise<LedgerBalanceFromLedgerResponse>;
/**
 * Get Addres from Ledger
 * @param config
 * @param options
 * @returns
 */
export declare const GetAddressFromLedeger: (config: LedgerConfig, options: any) => Promise<string | PublicKeyResponse>;
/**
 * SendTransactionLedger
 * @param config
 * @param script
 * @returns
 */
export declare function SendTransactionLedger(config: LedgerConfig, script: string): Promise<any>;
/**
 *
 * @param config
 * @param privateKey
 * @returns
 */
export declare const GetBalanceFromPrivateKey: (config: any, privateKey: any) => Promise<any>;
/**
 *
 * @param config
 * @param mnemonic
 * @param index
 * @returns
 */
export declare const GetBalanceFromMnemonic: (config: LedgerConfig, mnemonic: string, index: any) => Promise<any>;
//# sourceMappingURL=Ledger-Commands.d.ts.map