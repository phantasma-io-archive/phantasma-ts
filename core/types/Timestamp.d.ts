export declare class Timestamp {
    value: number;
    constructor(value: number);
    toString(): string;
    toStringFormat(format: string): string;
    static now: number;
    static null: Timestamp;
    compareTo(other: Timestamp): 0 | 1 | -1;
    equals(obj: any): boolean;
    getHashCode(): number;
    getSize(): number;
    static equal(A: Timestamp, B: Timestamp): boolean;
    static notEqual(A: Timestamp, B: Timestamp): boolean;
    static lessThan(A: Timestamp, B: Timestamp): boolean;
    static greaterThan(A: Timestamp, B: Timestamp): boolean;
    static lessThanOrEqual(A: Timestamp, B: Timestamp): boolean;
    static greaterThanOrEqual(A: Timestamp, B: Timestamp): boolean;
    static subtract(A: Timestamp, B: Timestamp): number;
    static fromNumber(ticks: number): Timestamp;
    static fromDate(time: Date): Timestamp;
    static addTimeSpan(A: Timestamp, B: number): number;
    static subtractTimeSpan(A: Timestamp, B: number): number;
    static Serialize(): void;
    static Unserialize(): void;
}
//# sourceMappingURL=Timestamp.d.ts.map