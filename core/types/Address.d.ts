import { IKeyPair } from "../interfaces";
export declare enum AddressKind {
    Invalid = 0,
    User = 1,
    System = 2,
    Interop = 3
}
export declare class Address {
    static readonly NullText: string;
    static readonly LengthInBytes: number;
    static readonly MaxPlatformNameLength: number;
    private static NullPublicKey;
    static readonly Null: Address;
    private _bytes;
    get Kind(): AddressKind;
    get IsSystem(): boolean;
    get IsInterop(): boolean;
    get IsUser(): boolean;
    get IsNull(): boolean;
    private _text;
    private static _keyToTextCache;
    get Text(): string;
    private constructor();
    static FromBytes(bytes: Uint8Array): Address;
    static FromKey(key: IKeyPair): Address;
    static FromHash(str: string): Address;
    static FromHash(input: Uint8Array): Address;
    static FromWif(wif: string): Address;
    compareTo(other: Address): number;
    equals(other: any): boolean;
    toString(): string;
    ToByteArray(): Uint8Array;
}
//# sourceMappingURL=Address.d.ts.map