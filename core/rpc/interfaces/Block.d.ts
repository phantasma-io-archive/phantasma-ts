import { Event } from './Event';
import { Oracle } from './Oracle';
import { TransactionData } from './TransactionData';
export interface Block {
    hash: string;
    previousHash: string;
    timestamp: number;
    height: number;
    chainAddress: string;
    protocol: number;
    txs: Array<TransactionData>;
    validatorAddress: string;
    reward: string;
    events: Array<Event>;
    oracles: Array<Oracle>;
}
//# sourceMappingURL=Block.d.ts.map