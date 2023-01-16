import { ISerializable } from "../interfaces";
import { Opcode } from "./Opcode";
import { VMType } from "./VMType";
type byte = number;
export declare enum Contracts {
    GasContractName = "gas",
    BlockContractName = "block",
    StakeContractName = "stake",
    SwapContractName = "swap",
    AccountContractName = "account",
    ConsensusContractName = "consensus",
    GovernanceContractName = "governance",
    StorageContractName = "storage",
    ValidatorContractName = "validator",
    InteropContractName = "interop",
    ExchangeContractName = "exchange",
    PrivacyContractName = "privacy",
    RelayContractName = "relay",
    RankingContractName = "ranking"
}
export declare class ScriptBuilder {
    _labelLocations: {
        [id: string]: number;
    };
    _jumpLocations: {
        [id: number]: string;
    };
    str: string;
    nullAddress: string;
    constructor();
    beginScript(): void;
    getScript(): string;
    endScript(): string;
    emit(opcode: Opcode, bytes?: number[]): this;
    emitPush(reg: byte): this;
    emitPop(reg: byte): this;
    emitExtCall(method: string, reg?: byte): this;
    emitBigInteger(value: string): this;
    emitAddress(textAddress: string): this;
    rawString(value: string): any[];
    emitLoad(reg: number, obj: any): this;
    emitLoadBytes(reg: number, bytes: byte[], type?: VMType): this;
    emitLoadArray(reg: number, obj: any): this;
    emitLoadISerializable(reg: number, obj: ISerializable): this;
    emitLoadEnum(reg: number, enumVal: number): this;
    emitLoadTimestamp(reg: number, obj: Date): this;
    emitMove(src_reg: number, dst_reg: number): this;
    emitCopy(src_reg: number, dst_reg: number): this;
    emitLabel(label: string): this;
    emitJump(opcode: Opcode, label: string, reg?: number): this;
    emitCall(label: string, regCount: byte): this;
    emitConditionalJump(opcode: Opcode, src_reg: byte, label: string): this;
    insertMethodArgs(args: any[]): void;
    callInterop(method: string, args: any[]): this;
    callContract(contractName: string, method: string, args: any[]): this;
    allowGas(from: string, to: string, gasPrice: number, gasLimit: number): this;
    spendGas(address: string): this;
    callRPC<T>(methodName: string, params: any[]): Promise<T>;
    getAddressTransactionCount(address: string, chainInput: string): Promise<number>;
    emitTimestamp(obj: Date): this;
    emitByteArray(bytes: number[]): this;
    emitVarString(text: string): this;
    emitVarInt(value: number): this;
    emitUInt32(value: number): this;
    emitBytes(bytes: byte[]): this;
    byteToHex(byte: number): string;
    appendByte(byte: number): void;
    appendBytes(bytes: byte[]): void;
    appendUshort(ushort: number): void;
    appendHexEncoded(bytes: string): this;
}
export {};
//# sourceMappingURL=ScriptBuilder.d.ts.map