"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractEvent = exports.ContractMethod = exports.ContractInterface = exports.ContractParameter = void 0;
var csharp_binary_stream_1 = require("csharp-binary-stream");
var utils_1 = require("../utils");
var Extensions_1 = require("./Extensions");
var ContractParameter = /** @class */ (function () {
    function ContractParameter(name, type) {
        this.name = name;
        this.type = type;
    }
    return ContractParameter;
}());
exports.ContractParameter = ContractParameter;
var ContractInterface = /** @class */ (function () {
    function ContractInterface(methods, events) {
        var e_1, _a;
        this._methods = new Map();
        this.Methods = Array.from(this._methods.values());
        this.MethodCount = this._methods.size;
        try {
            for (var methods_1 = __values(methods), methods_1_1 = methods_1.next(); !methods_1_1.done; methods_1_1 = methods_1.next()) {
                var entry = methods_1_1.value;
                this._methods.set(entry.name, entry);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (methods_1_1 && !methods_1_1.done && (_a = methods_1.return)) _a.call(methods_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this._events = events;
    }
    ContractInterface.prototype.Events = function () {
        return this._events;
    };
    ContractInterface.prototype.EventCount = function () {
        return this._events.length;
    };
    ContractInterface.prototype.newEmpty = function () {
        this._methods = new Map();
        this._events = [];
    };
    ContractInterface.prototype.get = function (name) {
        return this.FindMethod(name);
    };
    ContractInterface.prototype.HasMethod = function (name) {
        return this._methods.has(name);
    };
    ContractInterface.prototype.HasTokenTrigger = function (trigger) {
        var strName = trigger.toString();
        var name = strName[0].toLowerCase() + strName.slice(1);
        return this._methods.has(name);
    };
    ContractInterface.prototype.FindMethod = function (name) {
        if (this._methods.has(name)) {
            return this._methods.get(name);
        }
        return null;
    };
    ContractInterface.prototype.FindEvent = function (value) {
        var e_2, _a;
        try {
            for (var _b = __values(this._events), _c = _b.next(); !_c.done; _c = _b.next()) {
                var evt = _c.value;
                if (evt.value === value) {
                    return evt;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return null;
    };
    ContractInterface.prototype.ImplementsEvent = function (evt) {
        var e_3, _a;
        try {
            for (var _b = __values(this.Events()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entry = _c.value;
                if (entry.name === evt.name && entry.value === evt.value && entry.returnType === evt.returnType) {
                    return true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
    };
    ContractInterface.prototype.ImplementsMethod = function (method) {
        if (!this._methods.has(method.name)) {
            return false;
        }
        var thisMethod = this._methods.get(method.name);
        if (thisMethod.parameters.length !== method.parameters.length) {
            return false;
        }
        for (var i = 0; i < method.parameters.length; i++) {
            if (thisMethod.parameters[i].type !== method.parameters[i].type) {
                return false;
            }
        }
        return true;
    };
    ContractInterface.prototype.ImplementsInterface = function (other) {
        var e_4, _a, e_5, _b;
        try {
            for (var _c = __values(other.Methods), _d = _c.next(); !_d.done; _d = _c.next()) {
                var method = _d.value;
                if (!this.ImplementsMethod(method)) {
                    return false;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
        try {
            for (var _e = __values(other.Events()), _f = _e.next(); !_f.done; _f = _e.next()) {
                var evt = _f.value;
                if (!this.ImplementsEvent(evt)) {
                    return false;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return true;
    };
    ContractInterface.prototype.UnserializeData = function (reader) {
        var len = reader.readByte();
        this._methods.clear();
        for (var i = 0; i < len; i++) {
            var method = ContractMethod.Unserialize(reader);
            this._methods.set(method.name, method);
        }
        var eventLen = reader.readByte();
        this._events = [];
        for (var i = 0; i < eventLen; i++) {
            this._events.push(ContractEvent.Unserialize(reader));
        }
    };
    ContractInterface.prototype.SerializeData = function (writer) {
        var e_6, _a, e_7, _b;
        writer.writeByte(this._methods.size);
        try {
            for (var _c = __values(this._methods), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), _ = _e[0], value = _e[1];
                value.Serialize(writer);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_6) throw e_6.error; }
        }
        writer.writeByte(this._events.length);
        try {
            for (var _f = __values(this._events), _g = _f.next(); !_g.done; _g = _f.next()) {
                var entry = _g.value;
                entry.Serialize(writer);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_7) throw e_7.error; }
        }
    };
    ContractInterface.Empty = new ContractInterface([], []);
    return ContractInterface;
}());
exports.ContractInterface = ContractInterface;
var ContractMethod = /** @class */ (function () {
    function ContractMethod(name, returnType, offset, parameters) {
        this.name = name;
        this.offset = offset;
        this.returnType = returnType;
        this.parameters = parameters;
    }
    ContractMethod.prototype.SerializeData = function (writer) {
        this.Serialize(writer);
    };
    ContractMethod.prototype.UnserializeData = function (reader) {
        return ContractMethod.Unserialize(reader);
    };
    ContractMethod.prototype.constructorOne = function (name, returnType, labels, parameters) {
        if (!labels.has(name)) {
            throw new Error("Missing offset in label map for method " + name);
        }
        var offset = labels.get(name);
        this.name = name;
        this.offset = offset;
        this.returnType = returnType;
        this.parameters = parameters;
    };
    ContractMethod.prototype.isProperty = function () {
        if (this.name.length >= 4 && this.name.startsWith("get") && this.name[3] === this.name[3].toUpperCase()) {
            return true;
        }
        if (this.name.length >= 3 && this.name.startsWith("is") && this.name[2] === this.name[2].toUpperCase()) {
            return true;
        }
        return false;
    };
    ContractMethod.prototype.isTrigger = function () {
        if (this.name.length >= 3 && this.name.startsWith("on") && this.name[2] === this.name[2].toUpperCase()) {
            return true;
        }
        return false;
    };
    ContractMethod.prototype.toString = function () {
        return this.name + " : " + this.returnType;
    };
    ContractMethod.fromBytes = function (bytes) {
        var stream = new Uint8Array(bytes);
        var reader = new Extensions_1.PBinaryReader(stream);
        return ContractMethod.Unserialize(reader);
    };
    ContractMethod.Unserialize = function (reader) {
        var name = reader.readString();
        var returnType = reader.readByte();
        var offset = reader.readInt();
        var len = reader.readByte();
        var parameters = new Array(len);
        for (var i = 0; i < len; i++) {
            var pName = reader.readString();
            var pVMType = reader.readByte();
            parameters[i] = new ContractParameter(pName, pVMType);
        }
        return new ContractMethod(name, returnType, offset, parameters);
    };
    ContractMethod.prototype.Serialize = function (writer) {
        writer.writeString(this.name);
        writer.writeByte(this.returnType);
        writer.writeInt(this.offset);
        writer.writeByte(this.parameters.length);
        this.parameters.forEach(function (entry) {
            writer.writeString(entry.name);
            writer.writeByte(entry.type);
        });
    };
    ContractMethod.prototype.toArray = function () {
        var stream = new Uint8Array();
        var writer = new Extensions_1.PBinaryWriter(stream);
        this.Serialize(writer);
        return stream;
    };
    return ContractMethod;
}());
exports.ContractMethod = ContractMethod;
var ContractEvent = /** @class */ (function () {
    function ContractEvent(value, name, returnType, description) {
        this.value = value;
        this.name = name;
        this.returnType = returnType;
        this.description = description;
    }
    ContractEvent.prototype.SerializeData = function (writer) {
        this.Serialize(writer);
    };
    ContractEvent.prototype.UnserializeData = function (reader) {
        return ContractEvent.Unserialize(reader);
    };
    ContractEvent.prototype.toString = function () {
        return this.name + " : " + this.returnType + " => " + this.value;
    };
    ContractEvent.Unserialize = function (reader) {
        var value = reader.readByte();
        var name = reader.readString(csharp_binary_stream_1.Encoding.Utf8);
        var returnType = reader.readByte();
        var description = reader.readBytes(reader.readByte());
        return new ContractEvent(value, name, returnType, (0, utils_1.arrayNumberToUint8Array)(description));
    };
    ContractEvent.prototype.Serialize = function (writer) {
        writer.writeByte(this.value);
        writer.writeString(this.name, csharp_binary_stream_1.Encoding.Utf8);
        writer.writeByte(this.returnType);
        writer.writeByte(this.description.length);
        writer.writeBytes((0, utils_1.uint8ArrayToNumberArray)(this.description));
    };
    return ContractEvent;
}());
exports.ContractEvent = ContractEvent;
