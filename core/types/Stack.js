"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
var Stack = /** @class */ (function () {
    function Stack(capacity) {
        if (capacity === void 0) { capacity = Infinity; }
        this.capacity = capacity;
        this.storage = [];
    }
    Stack.prototype.push = function (item) {
        if (this.size() === this.capacity) {
            throw Error("Stack has reached max capacity, you cannot add more items");
        }
        this.storage.push(item);
    };
    Stack.prototype.pop = function () {
        return this.storage.pop();
    };
    Stack.prototype.peek = function () {
        return this.storage[this.size() - 1];
    };
    Stack.prototype.size = function () {
        return this.storage.length;
    };
    Stack.prototype.isEmpty = function () {
        return this.size() === 0;
    };
    Stack.prototype.toArray = function () {
        return this.storage;
    };
    Stack.prototype.clear = function () {
        this.storage = [];
    };
    Stack.prototype.toString = function () {
        return this.storage.toString();
    };
    Stack.prototype.isFull = function () {
        return this.capacity === this.size();
    };
    return Stack;
}());
exports.Stack = Stack;
