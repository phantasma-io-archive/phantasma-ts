import { IKeyPair } from "../interfaces/IKeyPair";
import { Address } from "./Address";
import { Signature } from "../interfaces/Signature";
export declare class PhantasmaKeys implements IKeyPair {
    private _privateKey;
    get PrivateKey(): Uint8Array;
    private _publicKey;
    get PublicKey(): Uint8Array;
    readonly Address: Address;
    static readonly PrivateKeyLength = 32;
    constructor(privateKey: Uint8Array);
    toString(): string;
    static generate(): PhantasmaKeys;
    static fromWIF(wif: string): PhantasmaKeys;
    toWIF(): string;
    static xor(x: Uint8Array, y: Uint8Array): Uint8Array;
    Sign(msg: Uint8Array, customSignFunction?: (msg: Uint8Array, privateKey: Uint8Array, publicKey: Uint8Array) => Uint8Array): Signature;
}
//# sourceMappingURL=PhantasmaKeys.d.ts.map