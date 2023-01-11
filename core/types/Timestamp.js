"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = void 0;
var Timestamp = /** @class */ (function () {
    function Timestamp(value) {
        this.value = value;
    }
    Timestamp.prototype.toString = function () {
        return new Date(this.value * 1000).toUTCString();
    };
    Timestamp.prototype.toStringFormat = function (format) {
        return new Date(this.value * 1000).toUTCString();
    };
    Timestamp.prototype.compareTo = function (other) {
        if (other.value === this.value) {
            return 0;
        }
        if (this.value < other.value) {
            return -1;
        }
        return 1;
    };
    Timestamp.prototype.equals = function (obj) {
        if (!(obj instanceof Timestamp)) {
            return false;
        }
        return this.value === obj.value;
    };
    Timestamp.prototype.getHashCode = function () {
        return this.value;
    };
    Timestamp.prototype.getSize = function () {
        return 4;
    };
    Timestamp.equal = function (A, B) { return A.value === B.value; };
    Timestamp.notEqual = function (A, B) { return !(A.value === B.value); };
    Timestamp.lessThan = function (A, B) { return A.value < B.value; };
    Timestamp.greaterThan = function (A, B) { return A.value > B.value; };
    Timestamp.lessThanOrEqual = function (A, B) { return A.value <= B.value; };
    Timestamp.greaterThanOrEqual = function (A, B) { return A.value >= B.value; };
    Timestamp.subtract = function (A, B) { return A.value - B.value; };
    Timestamp.fromNumber = function (ticks) {
        return new Timestamp(ticks);
    };
    Timestamp.fromDate = function (time) {
        return new Timestamp(time.getTime() / 1000);
    };
    Timestamp.addTimeSpan = function (A, B) { return A.value + B; };
    Timestamp.subtractTimeSpan = function (A, B) { return A.value - B; };
    Timestamp.Serialize = function () {
    };
    Timestamp.Unserialize = function () {
    };
    Timestamp.now = Date.now();
    Timestamp.null = new Timestamp(0);
    return Timestamp;
}());
exports.Timestamp = Timestamp;
