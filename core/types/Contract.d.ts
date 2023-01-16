import { ISerializable } from "../interfaces";
import { VMType } from "../vm/VMType";
import { BinaryReader, BinaryWriter } from "csharp-binary-stream";
import { TokenTrigger } from "./DomainSettings";
import { PBinaryReader, PBinaryWriter } from "./Extensions";
export declare class ContractParameter {
    name: string;
    type: VMType;
    constructor(name: string, type: VMType);
}
export declare class ContractInterface implements ISerializable {
    static readonly Empty: ContractInterface;
    private _methods;
    Methods: ContractMethod[];
    MethodCount: number;
    private _events;
    Events(): ContractEvent[];
    EventCount(): number;
    newEmpty(): void;
    constructor(methods: ContractMethod[], events: ContractEvent[]);
    get(name: string): ContractMethod | null;
    HasMethod(name: string): boolean;
    HasTokenTrigger(trigger: TokenTrigger): boolean;
    FindMethod(name: string): ContractMethod | null;
    FindEvent(value: number): ContractEvent | null;
    ImplementsEvent(evt: ContractEvent): boolean;
    ImplementsMethod(method: ContractMethod): boolean;
    ImplementsInterface(other: ContractInterface): boolean;
    UnserializeData(reader: PBinaryReader): void;
    SerializeData(writer: PBinaryWriter): void;
}
export declare class ContractMethod implements ISerializable {
    name: string;
    returnType: VMType;
    parameters: ContractParameter[];
    offset: number;
    SerializeData(writer: PBinaryWriter): void;
    UnserializeData(reader: PBinaryReader): ContractMethod;
    constructorOne(name: string, returnType: VMType, labels: Map<string, number>, parameters: ContractParameter[]): void;
    constructor(name: string, returnType: VMType, offset: number, parameters: ContractParameter[]);
    isProperty(): boolean;
    isTrigger(): boolean;
    toString(): string;
    static fromBytes(bytes: Uint8Array): ContractMethod;
    static Unserialize(reader: PBinaryReader): ContractMethod;
    Serialize(writer: PBinaryWriter): void;
    toArray(): Uint8Array;
}
export declare class ContractEvent implements ISerializable {
    readonly value: number;
    readonly name: string;
    readonly returnType: VMType;
    readonly description: Uint8Array;
    constructor(value: number, name: string, returnType: VMType, description: Uint8Array);
    SerializeData(writer: BinaryWriter): void;
    UnserializeData(reader: BinaryReader): ContractEvent;
    toString(): string;
    static Unserialize(reader: BinaryReader): ContractEvent;
    Serialize(writer: BinaryWriter): void;
}
//# sourceMappingURL=Contract.d.ts.map