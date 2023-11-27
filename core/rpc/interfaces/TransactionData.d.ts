import { Event } from './Event';
import { SignatureResult } from './SignatureResult';
export interface TransactionData {
    hash: string;
    chainAddress: string;
    timestamp: number;
    blockHeight: number;
    blockHash: string;
    script: string;
    payload: string;
    events: Array<Event>;
    result: string;
    fee: string;
    state: string;
    signatures: Array<SignatureResult>;
    sender: string;
    gasPayer: string;
    gasTarget: string;
    gasPrice: string;
    gasLimit: string;
    expiration: number;
}
//# sourceMappingURL=TransactionData.d.ts.map