import { PhantasmaLink, ProofOfWork } from "./phantasmaLink";
import { EasyScript, Nexus } from "./easyScript";
export declare class EasyConnect {
    requiredVersion: number;
    platform: string;
    providerHint: string;
    link: PhantasmaLink;
    connected: boolean;
    script: EasyScript;
    nexus: Nexus;
    constructor(_options?: Array<string>);
    setConfig(_provider: string): void;
    connect(onSuccess?: any, onFail?: any): void;
    disconnect(_message?: string): void;
    query(_type?: string, _arguments?: Array<string>, _callback?: any): Promise<any>;
    action(_type?: string, _arguments?: Array<any>, onSuccess?: any, onFail?: any): Promise<void>;
    signTransaction(script: string, payload?: any, onSuccess?: any, onFail?: any): void;
    signData(data: any, onSuccess?: any, onFail?: any): void;
    invokeScript(script: string, _callback: any): void;
    deployContract(script: string, payload?: any, proofOfWork?: ProofOfWork, onSuccess?: any, onFail?: any): void;
}
//# sourceMappingURL=easyConnect.d.ts.map