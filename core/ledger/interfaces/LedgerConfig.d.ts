import { PhantasmaAPI } from '../../rpc/phantasma';
export interface LedgerConfig {
    Debug: boolean;
    Transport: any;
    Bip39: any;
    Bip32Factory: any;
    Curve: any;
    NexusName: string;
    ChainName: string;
    Payload: string;
    TokenNames: string[];
    RPC: PhantasmaAPI;
    GasPrice: number;
    GasLimit: number;
    VerifyResponse: boolean;
}
//# sourceMappingURL=LedgerConfig.d.ts.map