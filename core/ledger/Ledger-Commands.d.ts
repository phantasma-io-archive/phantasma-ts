import { LedgerConfig } from './LedgerConfig';
import { VersionResponse, ApplicationNameResponse } from './Ledger-Utils';
export declare const LeftPad: (number: any, length: any) => string;
export declare const ToWholeNumber: (balance: any, decimals: any) => string;
export interface LedgerDeviceInfoResponse {
    version: VersionResponse;
    applicationName: ApplicationNameResponse;
}
export declare const GetLedgerDeviceInfo: (config: LedgerConfig) => Promise<LedgerDeviceInfoResponse>;
export declare const GetBalanceFromLedger: (config: LedgerConfig, options: any) => Promise<any>;
export declare const GetAddressFromLedeger: (config: any, options: any) => Promise<string | import("./Ledger-Utils").PublicKeyResponse>;
export declare function SendTransactionLedger(config: LedgerConfig, script: string): Promise<any>;
export declare const GetBalanceFromPrivateKey: (config: any, privateKey: any) => Promise<any>;
export declare const GetBalanceFromMnemonic: (config: LedgerConfig, mnemonic: string, index: any) => Promise<any>;
//# sourceMappingURL=Ledger-Commands.d.ts.map