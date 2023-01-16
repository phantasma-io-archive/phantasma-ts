export interface IStack<T> {
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    size(): number;
}
//# sourceMappingURL=IStack.d.ts.map