import { ScriptBuilder } from "../vm";
export declare enum Nexus {
    Mainnet = "mainnet",
    Simnet = "simnet",
    Testnet = "testnet"
}
export declare class EasyScript {
    nexus: Nexus;
    sb: ScriptBuilder;
    constructor(nexus?: Nexus);
    buildScript(_type: string, _options?: Array<any>): string;
}
//# sourceMappingURL=easyScript.d.ts.map