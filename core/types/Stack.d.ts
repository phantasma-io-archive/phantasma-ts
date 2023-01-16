import { IStack } from "../interfaces";
export declare class Stack<T> implements IStack<T> {
    private capacity;
    private storage;
    constructor(capacity?: number);
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    size(): number;
    isEmpty(): boolean;
    toArray(): T[];
    clear(): void;
    toString(): string;
    isFull(): boolean;
}
//# sourceMappingURL=Stack.d.ts.map