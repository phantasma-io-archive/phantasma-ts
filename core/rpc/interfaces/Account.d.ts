import { Balance } from './Balance';
import { Stake } from './Stake';
import { Storage } from './Storage';
export interface Account {
    address: string;
    name: string;
    stakes: Stake;
    stake: string;
    unclaimed: string;
    relay: string;
    validator: string;
    storage: Storage;
    balances: Array<Balance>;
    txs: Array<string>;
}
//# sourceMappingURL=Account.d.ts.map