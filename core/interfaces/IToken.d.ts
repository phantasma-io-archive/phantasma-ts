import { Address, ContractInterface } from "../types";
export declare enum TokenFlags {
    None = 0,
    Transferable = 1,
    Fungible = 2,
    Finite = 4,
    Divisible = 8,
    Fuel = 16,
    Stakable = 32,
    Fiat = 64,
    Swappable = 128,
    Burnable = 256,
    Mintable = 512
}
export declare enum TokenSeriesMode {
    Unique = 0,
    Duplicated = 1
}
export interface IToken {
    readonly Name: string;
    readonly Symbol: string;
    readonly Owner: Address;
    readonly Flags: TokenFlags;
    readonly MaxSupply: BigInteger;
    readonly Decimals: number;
    readonly Script: Uint8Array;
    readonly ABI: ContractInterface;
}
//# sourceMappingURL=IToken.d.ts.map