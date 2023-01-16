import { ContractInterface } from "../types";
export interface IContract {
    Name: string;
    ABI: ContractInterface;
}
export declare enum NativeContractKind {
    Gas = 0,
    Block = 1,
    Stake = 2,
    Swap = 3,
    Account = 4,
    Consensus = 5,
    Governance = 6,
    Storage = 7,
    Validator = 8,
    Interop = 9,
    Exchange = 10,
    Privacy = 11,
    Relay = 12,
    Ranking = 13,
    Market = 14,
    Friends = 15,
    Mail = 16,
    Sale = 17,
    Unknown = 18
}
//# sourceMappingURL=IContract.d.ts.map