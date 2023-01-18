import { IKeyPair, ISerializable } from "../interfaces";
import { PBinaryWriter, PBinaryReader } from "./Extensions";
export declare enum AddressKind {
    Invalid = 0,
    User = 1,
    System = 2,
    Interop = 3
}
export declare class Address implements ISerializable {
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
    static FromText(text: string): Address;
    static Parse(text: string): Address;
    static IsValidAddress(text: string): boolean;
    static FromBytes(bytes: Uint8Array): Address;
    static FromKey(key: IKeyPair): Address;
    static FromHash(str: string): Address;
    static FromHash(input: Uint8Array): Address;
    static FromWif(wif: string): Address;
    compareTo(other: Address): number;
    equals(other: any): boolean;
    toString(): string;
    ToByteArray(): Uint8Array;
    SerializeData(writer: PBinaryWriter): void;
    UnserializeData(reader: PBinaryReader): void;
}
//# sourceMappingURL=Address.d.ts.map