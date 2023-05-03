import { Balance } from "../rpc/phantasma";
export declare enum ProofOfWork {
    None = 0,
    Minimal = 5,
    Moderate = 15,
    Hard = 19,
    Heavy = 24,
    Extreme = 30
}
export interface IFile {
    name: string;
    hash: string;
    size: number;
    date: string;
}
export interface IAccount {
    alias: string;
    name: string;
    address: string;
    avatar: string;
    platform: string;
    external: string;
    balances: Balance[];
    files: IFile[];
}
export declare class PhantasmaLink {
    host: string;
    dapp: any;
    onLogin: (succ: any) => void;
    providerHint: any;
    onError: (message: any) => void;
    socket: any;
    requestCallback: any;
    token: any;
    requestID: number;
    account: IAccount;
    wallet: any;
    messageLogging: boolean;
    version: number;
    nexus: string;
    chain: string;
    platform: string;
    constructor(dappID: any, logging?: boolean);
    onMessage: (msg: string) => void;
    login(onLoginCallback: (success: boolean) => void, onErrorCallback: (message: string) => void, version?: number, platform?: string, providerHint?: string): void;
    invokeScript(script: string, callback: (message: string) => void): void;
    signTx(script: any, payload: string | null, callback: (arg0: string) => void, onErrorCallback: () => void, pow?: ProofOfWork, signature?: string): void;
    signTxSignature(tx: string, callback: (result: string) => void, onErrorCallback: () => void, signature?: string): void;
    multiSig(subject: string, callback: (result: string) => void, onErrorCallback: () => void, signature?: string): void;
    getPeer(callback: (result: string) => void, onErrorCallback: () => void): void;
    fetchWallet(callback: (result: any) => void, onErrorCallback: (message: any) => void): void;
    getNexus(callback: (message: any) => void, onErrorCallback: (message: any) => void): void;
    signData(data: string, callback: (success: string) => void, onErrorCallback: (message: string) => void, signature?: string): void;
    createSocket(isResume?: boolean): void;
    toggleMessageLogging(): void;
    resume(token: any): void;
    retry(): void;
    set dappID(dapp: any);
    get dappID(): any;
    sendLinkRequest(request: string, callback: (T: any) => void): void;
    disconnect(triggered: string | boolean | undefined): void;
}
//# sourceMappingURL=phantasmaLink.d.ts.map