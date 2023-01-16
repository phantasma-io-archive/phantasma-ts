import { ISignature } from "../interfaces";
export declare class Transaction {
    script: string;
    nexusName: string;
    chainName: string;
    payload: string;
    expiration: Date;
    signatures: Array<ISignature>;
    hash: string;
    static FromBytes(serializedData: string): Transaction;
    constructor(nexusName: string, chainName: string, script: string, expiration: Date, payload: string);
    sign(privateKey: string): void;
    toString(withSignature: boolean): string;
    getHash(): string;
    mineTransaction(difficulty: number): void;
    private getSign;
    unserialize(serializedData: string): Transaction;
}
//# sourceMappingURL=Transaction.d.ts.map