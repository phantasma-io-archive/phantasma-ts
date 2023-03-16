export declare enum ProofOfWork {
    None = 0,
    Minimal = 5,
    Moderate = 15,
    Hard = 19,
    Heavy = 24,
    Extreme = 30
}
export declare class PhantasmaLink {
    host: string;
    dapp: any;
    onLogin: (succ: any) => void;
    providerHint: any;
    onError: any;
    socket: any;
    requestCallback: any;
    token: any;
    requestID: number;
    account: any;
    wallet: any;
    messageLogging: boolean;
    version: number;
    nexus: string;
    chain: string;
    platform: string;
    constructor(dappID: any, logging?: boolean);
    onMessage: (msg: any) => void;
    login(onLoginCallback: any, onErrorCallback: any, version?: number, platform?: string, providerHint?: string): void;
    invokeScript(script: any, callback: any): void;
    signTx(script: any, payload: string | null, callback: (arg0: any) => void, onErrorCallback: () => void, pow?: ProofOfWork, signature?: string): void;
    signTxSignature(tx: any, callback: any, onErrorCallback: any, signature?: string): void;
    multiSig(subject: any, callback: any, onErrorCallback: any, signature?: string): void;
    getPeer(callback: any, onErrorCallback: any): void;
    fetchWallet(callback: any, onErrorCallback: any): void;
    getNexus(callback: any, onErrorCallback: any): void;
    signData(data: any, callback: any, onErrorCallback: any, signature?: string): void;
    createSocket(): void;
    toggleMessageLogging(): void;
    retry(): void;
    set dappID(dapp: any);
    get dappID(): any;
    sendLinkRequest(request: any, callback: any): void;
    disconnect(triggered: any): void;
}
//# sourceMappingURL=phantasmaLink.d.ts.map