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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VMObject = void 0;
var VMType_1 = require("./VMType");
var Timestamp_1 = require("../types/Timestamp");
var types_1 = require("../types");
var interfaces_1 = require("../interfaces");
var utils_1 = require("../utils");
var VMObject = /** @class */ (function () {
    function VMObject() {
        this._localSize = 0;
        this.Type = VMType_1.VMType.None;
        this.Data = null;
    }
    Object.defineProperty(VMObject.prototype, "IsEmpty", {
        get: function () {
            return this.Data == null || this.Data == undefined;
        },
        enumerable: false,
        configurable: true
    });
    VMObject.prototype.GetChildren = function () {
        return this.Type == VMType_1.VMType.Struct
            ? this.Data
            : null;
    };
    Object.defineProperty(VMObject.prototype, "Size", {
        get: function () {
            var total = 0;
            if (this.Type == VMType_1.VMType.Object) {
                var children = this.GetChildren();
                var values = children === null || children === void 0 ? void 0 : children.values;
                for (var entry in values) {
                    total += entry.length;
                }
            }
            else {
                total = this._localSize;
            }
            return total;
        },
        enumerable: false,
        configurable: true
    });
    VMObject.prototype.AsTimestamp = function () {
        if (this.Type != VMType_1.VMType.Timestamp) {
            throw new Error("Invalid cast: expected timestamp, got ".concat(this.Type));
        }
        return this.Data;
    };
    VMObject.prototype.AsByteArray = function () {
        switch (this.Type) {
            case VMType_1.VMType.Bytes:
                return new Uint8Array(this.Data);
            case VMType_1.VMType.Bool:
                return new Uint8Array([this.Data ? 1 : 0]);
            case VMType_1.VMType.String:
                return new TextEncoder().encode(this.AsString());
            case VMType_1.VMType.Number:
            // Here you will have to convert BigInteger to Uint8Array manually
            case VMType_1.VMType.Enum:
                var num = this.AsNumber();
                var bytes = new Uint8Array(new ArrayBuffer(4));
                new DataView(bytes.buffer).setUint32(0, num);
                return bytes;
            case VMType_1.VMType.Timestamp:
                var time = this.AsTimestamp();
                var bytes = new Uint8Array(new ArrayBuffer(4));
                new DataView(bytes.buffer).setUint32(0, time.value);
                return bytes;
            case VMType_1.VMType.Struct:
            // Here you will have to convert struct to Uint8Array manually
            case VMType_1.VMType.Object:
            // here you will have to convert ISerializable to Uint8Array manually
            default:
                throw new Error("Invalid cast: expected bytes, got ".concat(this.Type));
        }
    };
    VMObject.prototype.AsString = function () {
        var _a, _b;
        switch (this.Type) {
            case VMType_1.VMType.String:
                return (_a = this.Data) === null || _a === void 0 ? void 0 : _a.toString();
            case VMType_1.VMType.Number:
                return this.Data.toString();
            case VMType_1.VMType.Bytes:
                return new TextDecoder().decode(this.Data);
            case VMType_1.VMType.Enum:
                return this.Data.toString();
            case VMType_1.VMType.Object:
                if (this.Data instanceof types_1.Address) {
                    return this.Data.Text;
                }
                /*if (this.Data instanceof Hash) {
                      return this.Data.toString();
                  }*/
                return "Interop:" + ((_b = this.Data) === null || _b === void 0 ? void 0 : _b.constructor.name);
            case VMType_1.VMType.Struct:
                var arrayType = this.GetArrayType();
                if (arrayType === VMType_1.VMType.Number) {
                    // convert array of unicode numbers into a string
                    var children = this.GetChildren();
                    var sb = "";
                    for (var i = 0; i < children.size; i++) {
                        var key = VMObject.FromObject(i);
                        var val = children === null || children === void 0 ? void 0 : children.get(key);
                        var ch = String.fromCharCode(val.AsNumber());
                        sb += ch;
                    }
                    return sb;
                }
                else {
                    /*const buffer = new ArrayBuffer(this.Data?.length as number);
                        const view = new DataView(buffer);
                        this.SerializeData(view);
                        return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));*/
                }
            case VMType_1.VMType.Bool:
                return this.Data ? "true" : "false";
            case VMType_1.VMType.Timestamp:
                return this.Data.value.toString();
            default:
                throw new Error("Invalid cast: expected string, got ".concat(this.Type));
        }
    };
    VMObject.prototype.ToString = function () {
        switch (this.Type) {
            case VMType_1.VMType.String:
                return this.Data;
            case VMType_1.VMType.Number:
                return this.Data.toString();
            case VMType_1.VMType.Bytes:
                return new TextDecoder().decode(this.Data);
            case VMType_1.VMType.Enum:
                return this.Data.toString();
            case VMType_1.VMType.Object:
                if (this.Data instanceof types_1.Address) {
                    return this.Data.Text;
                }
                /*if (this.Data instanceof Hash) {
                      return this.Data.toString();
                  }*/
                return "Interop:" + this.Data.constructor.name;
            case VMType_1.VMType.Struct:
                var arrayType = this.GetArrayType();
                if (arrayType === VMType_1.VMType.Number) {
                    // convert array of unicode numbers into a string
                    var children = this.GetChildren();
                    var sb = "";
                    for (var i = 0; i < children.size; i++) {
                        var key = VMObject.FromObject(i);
                        var val = children.get(key);
                        var ch = String.fromCharCode(val.AsNumber());
                        sb += ch;
                    }
                    return sb;
                }
                else {
                    /*const stream = new PMemoryStream();
                        const writer = new PBinaryWriter(stream);
                        this.SerializeData(writer);
                        return new TextDecoder().decode(stream.toArray());*/
                }
            case VMType_1.VMType.Bool:
                return this.Data ? "true" : "false";
            case VMType_1.VMType.Timestamp:
                return this.Data.value.toString();
            default:
                throw new Error("Invalid cast: expected string, got ".concat(this.Type));
        }
    };
    VMObject.prototype.AsNumber = function () {
        if ((this.Type === VMType_1.VMType.Object || this.Type === VMType_1.VMType.Timestamp) &&
            this.Data instanceof Timestamp_1.Timestamp) {
            return this.Data.value;
        }
        switch (this.Type) {
            case VMType_1.VMType.String: {
                var number = BigInt(this.Data);
                if (number.toString() === this.Data) {
                    return number;
                }
                else {
                    throw new Error("Cannot convert String '".concat(this.Data, "' to BigInteger."));
                }
            }
            case VMType_1.VMType.Bytes: {
                var bytes = new Uint8Array(this.Data);
                var num = BigInt("0x".concat(bytes.join("")));
                return num;
            }
            case VMType_1.VMType.Enum: {
                var num = Number(this.Data);
                return BigInt(num);
            }
            case VMType_1.VMType.Bool: {
                var val = this.Data;
                return val ? 1 : 0;
            }
            default: {
                if (this.Type !== VMType_1.VMType.Number) {
                    throw new Error("Invalid cast: expected number, got ".concat(this.Type));
                }
                return this.Data;
            }
        }
    };
    VMObject.prototype.AsEnum = function () {
        if (!VMObject.isEnum(this.Data)) {
            throw new Error("T must be an enumerated type");
        }
        if (this.Type !== VMType_1.VMType.Enum) {
            this.Data = new Number(this.AsNumber());
        }
        return this.Data;
    };
    VMObject.prototype.GetArrayType = function () {
        if (this.Type !== VMType_1.VMType.Struct) {
            return VMType_1.VMType.None;
        }
        var children = this.GetChildren();
        var result = VMType_1.VMType.None;
        for (var i = 0; i < children.size; i++) {
            var key = VMObject.FromObject(i);
            if (!children.has(key)) {
                return VMType_1.VMType.None;
            }
            var val = children.get(key);
            if (result === VMType_1.VMType.None) {
                result = val.Type;
            }
            else if (val.Type !== result) {
                return VMType_1.VMType.None;
            }
        }
        return result;
    };
    VMObject.prototype.AsType = function (type) {
        switch (type) {
            case VMType_1.VMType.Bool:
                return this.AsBool();
            case VMType_1.VMType.String:
                return this.AsString();
            case VMType_1.VMType.Bytes:
                return this.AsByteArray();
            case VMType_1.VMType.Number:
                return this.AsNumber();
            case VMType_1.VMType.Timestamp:
                return this.AsTimestamp();
            default:
                throw "Unsupported VM cast";
        }
    };
    VMObject.isEnum = function (instance) {
        var e_1, _a, e_2, _b;
        if (instance == null)
            return false;
        var keys = Object.keys(instance);
        var values = [];
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                var value = instance[key];
                if (typeof value === "number") {
                    value = value.toString();
                }
                values.push(value);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var keys_2 = __values(keys), keys_2_1 = keys_2.next(); !keys_2_1.done; keys_2_1 = keys_2.next()) {
                var key = keys_2_1.value;
                if (values.indexOf(key) < 0) {
                    return false;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (keys_2_1 && !keys_2_1.done && (_b = keys_2.return)) _b.call(keys_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return true;
    };
    /*public AsEnum<T>(): T {
          if (isEnum(this.Data)) {
              throw new ArgumentException("T must be an enumerated type");
          }
          if (this.Type != VMType.Enum) {
              const num = this.AsNumber();
              this.Data = Number(this.Data);
            }
            
            return (T) Enum.Parse(typeof T, this.Data.toString());
      }*/
    VMObject.prototype.AsBool = function () {
        switch (this.Type) {
            case VMType_1.VMType.String:
                return this.Data.toLowerCase() == "true";
            case VMType_1.VMType.Number:
                return this.Data != BigInt(0);
            case VMType_1.VMType.Bool:
                return this.Data ? true : false;
            default:
                throw new Error("Invalid cast: expected bool, got ".concat(this.Type));
        }
    };
    VMObject.isStructOrClass = function (type) {
        return ((!VMObject.isPrimitive(type) &&
            VMObject.isValueType(type) &&
            !VMObject.isEnum(type)) ||
            VMObject.isClass(type) ||
            VMObject.isInterface(type));
    };
    VMObject.isSerializable = function (type) {
        return (type instanceof interfaces_1.ISerializable ||
            VMObject.isPrimitive(type) ||
            VMObject.isStructOrClass(type) ||
            VMObject.isEnum(type));
    };
    VMObject.isPrimitive = function (type) {
        return (type === String || type === Number || type === Boolean || type === BigInt);
    };
    VMObject.isValueType = function (type) {
        return type === Object;
    };
    VMObject.isClass = function (type) {
        return (type === Array ||
            type === Map ||
            type === Set ||
            type instanceof Object ||
            (typeof type).toLowerCase() === "object");
    };
    VMObject.isInterface = function (type) {
        return type === Map;
    };
    VMObject.ConvertObjectInternal = function (fieldValue, fieldType) {
        if ((VMObject.isStructOrClass(fieldType) &&
            fieldValue instanceof Uint8Array) ||
            fieldValue instanceof Array) {
            var bytes = fieldValue;
            fieldValue = types_1.Serialization.Unserialize(bytes, typeof fieldType);
        }
        else if (VMObject.isEnum(fieldType)) {
            var tempValue = fieldValue;
            fieldValue = tempValue;
        }
        return fieldValue;
    };
    VMObject.prototype.ToArray = function (arrayElementType) {
        var e_3, _a, e_4, _b;
        if (this.Type !== VMType_1.VMType.Struct) {
            throw new Error("not a valid source struct");
        }
        var children = this.GetChildren();
        var maxIndex = -1;
        try {
            for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                var child = children_1_1.value;
                if (child[0].Type !== VMType_1.VMType.Number) {
                    throw new Error("source contains an element with invalid array index");
                }
                var temp = child[0].AsNumber();
                // TODO use a constant for VM max array size
                if (temp >= 1024) {
                    throw new Error("source contains an element with a very large array index");
                }
                var index = Math.floor(temp);
                if (index < 0) {
                    throw new Error("source contains an array index with negative value");
                }
                maxIndex = Math.max(index, maxIndex);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var length = maxIndex + 1;
        var array = new Array(length);
        try {
            for (var children_2 = __values(children), children_2_1 = children_2.next(); !children_2_1.done; children_2_1 = children_2.next()) {
                var child = children_2_1.value;
                var temp = child[0].AsNumber();
                var index = Math.floor(temp);
                var val = child[1].ToObjectType(arrayElementType);
                val = VMObject.ConvertObjectInternal(val, arrayElementType);
                array[index] = val;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (children_2_1 && !children_2_1.done && (_b = children_2.return)) _b.call(children_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return array;
    };
    VMObject.prototype.ToObjectType = function (type) {
        if (this.Type === VMType_1.VMType.Struct) {
            if (Array.isArray(type)) {
                var elementType = typeof type;
                return this.ToArray(elementType);
            }
            else if (VMObject.isStructOrClass(type)) {
                return this.ToStruct(type);
            }
            else {
                throw new Error("some stuff still missing: eg: lists, dictionaries..");
            }
        }
        else {
            var temp = this.ToObject();
            return temp;
        }
    };
    VMObject.prototype.ToObject = function () {
        if (this.Type === VMType_1.VMType.None) {
            throw new Error("not a valid object");
        }
        switch (this.Type) {
            case VMType_1.VMType.Bool:
                return this.AsBool();
            case VMType_1.VMType.Bytes:
                return this.AsByteArray();
            case VMType_1.VMType.String:
                return this.AsString();
            case VMType_1.VMType.Number:
                return this.AsNumber();
            case VMType_1.VMType.Timestamp:
                return this.AsTimestamp();
            case VMType_1.VMType.Object:
                return this.Data;
            case VMType_1.VMType.Enum:
                return this.Data;
            default:
                throw new Error("Cannot cast ".concat(this.Type, " to object"));
        }
    };
    VMObject.prototype.ToStruct = function (structType) {
        var e_5, _a;
        if (this.Type !== VMType_1.VMType.Struct) {
            throw new Error("not a valid source struct");
        }
        if (!VMObject.isStructOrClass(structType)) {
            throw new Error("not a valid destination struct");
        }
        var localType = Object.apply(typeof structType);
        var dict = this.GetChildren();
        var result = new structType();
        var fields = Object.keys(result);
        var myLocalFields = new structType();
        try {
            for (var fields_1 = __values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                var field = fields_1_1.value;
                var key = VMObject.FromObject(field);
                var dictKey = dict.keys().next().value;
                var val = void 0;
                if ((dictKey === null || dictKey === void 0 ? void 0 : dictKey.toString()) == key.toString()) {
                    val = dict.get(dictKey).ToObjectType(structType[field]);
                }
                else {
                    if (!VMObject.isStructOrClass(structType[field])) {
                        console.log("field not present in source struct: ".concat(field));
                        //throw new Error(`field not present in source struct: ${field}`);
                    }
                    //val = null;
                }
                /*if (val !== null && localType[field] !== "Uint8Array") {
                  if (VMObject.isSerializable(localType[field])) {
                    const temp = new structType[field]();
                    const stream = new Uint8Array(val);
                    const reader = new PBinaryReader(stream);
                    (temp as ISerializable).UnserializeData(reader);
                    val = temp;
                  }
                }*/
                if (VMObject.isEnum(typeof structType[field]) && !VMObject.isEnum(val)) {
                    val = localType[field][val === null || val === void 0 ? void 0 : val.toString()];
                }
                result[field] = val;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (fields_1_1 && !fields_1_1.done && (_a = fields_1.return)) _a.call(fields_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return result;
    };
    VMObject.GetVMType = function (type) {
        if (VMObject.isEnum(type)) {
            return VMType_1.VMType.Enum;
        }
        if (type === Boolean || type.toLowerCase() === "boolean") {
            return VMType_1.VMType.Bool;
        }
        if (typeof type == typeof String ||
            type === String ||
            type.toLowerCase() === "string") {
            return VMType_1.VMType.String;
        }
        if (typeof type === typeof Uint8Array ||
            type === Uint8Array ||
            type.toLowerCase() === "uint8array") {
            return VMType_1.VMType.Bytes;
        }
        if (type === "BigInt" ||
            type === Number ||
            type === BigInt ||
            type.toLowerCase() === "number") {
            return VMType_1.VMType.Number;
        }
        if (type === Timestamp_1.Timestamp || type === Number) {
            return VMType_1.VMType.Timestamp;
        }
        if (VMObject.isEnum(type)) {
            return VMType_1.VMType.Enum;
        }
        if (VMObject.isClass(type) || VMObject.isValueType(type)) {
            return VMType_1.VMType.Object;
        }
        return VMType_1.VMType.Struct;
    };
    VMObject.IsVMType = function (type) {
        var result = VMObject.GetVMType(type);
        return result !== VMType_1.VMType.None;
    };
    VMObject.prototype.SetValue = function (value) {
        this.Data = value;
        return this;
    };
    VMObject.prototype.setValue = function (val, type) {
        this.Type = type;
        this._localSize = val != null ? val.length : 0;
        switch (type) {
            case VMType_1.VMType.Bytes:
                this.Data = val;
                break;
            case VMType_1.VMType.Number:
                this.Data = val == null ? BigInt(0) : val;
                break;
            case VMType_1.VMType.String:
                this.Data = new String(val);
                break;
            case VMType_1.VMType.Enum:
                this.Data = val.slice(0, 4);
                break;
            case VMType_1.VMType.Timestamp:
                this.Data = new Timestamp_1.Timestamp(val.slice(0, 4));
                break;
            case VMType_1.VMType.Bool:
                this.Data = new Boolean(val[0] === 1);
                break;
            default:
                if (val instanceof Uint8Array) {
                    var len = val.length;
                    switch (len) {
                        case types_1.Address.LengthInBytes:
                            this.Data = types_1.Address.FromBytes(val);
                            break;
                        /*case Hash.Length:
                                    this.Data = Hash.fromBytes(val);
                                    break;*/
                        /*default:
                                    try {
                                        this.unserializeData(val);
                                    } catch (e) {
                                        throw new Error("Cannot decode interop object from bytes with length: " + len);
                                    }
                                    break;*/
                    }
                    break;
                }
                else {
                    throw new Error("Cannot set value for vmtype: " + type);
                }
        }
    };
    VMObject.ValidateStructKey = function (key) {
        if (key.Type == VMType_1.VMType.None ||
            key.Type == VMType_1.VMType.Struct ||
            key.Type == VMType_1.VMType.Object) {
            throw new Error("Cannot use value of type ".concat(key.Type, " as key for struct field"));
        }
    };
    VMObject.prototype.CastViaReflection = function (srcObj, level, dontConvertSerializables) {
        var _this = this;
        if (dontConvertSerializables === void 0) { dontConvertSerializables = true; }
        var srcType = srcObj.constructor.name;
        if (Array.isArray(srcObj)) {
            var children = new Map();
            var array = srcObj;
            for (var i = 0; i < array.length; i++) {
                var val = array[i];
                var key = new VMObject();
                key.SetValue(i);
                var vmVal = this.CastViaReflection(val, level + 1);
                children.set(key, vmVal);
            }
            var result = new VMObject();
            result.SetValue(children);
            return result;
        }
        else {
            var targetType = VMObject.GetVMType(srcType);
            var result = void 0;
            var isKnownType = srcType === VMType_1.VMType.Number || srcType === VMType_1.VMType.Timestamp;
            var localType = Object.apply(typeof srcType);
            if (!isKnownType &&
                dontConvertSerializables &&
                VMObject.isSerializable(localType)) {
                isKnownType = true;
            }
            if (VMObject.isStructOrClass(localType) && !isKnownType) {
                var children_3 = new Map();
                var fields = Object.keys(srcObj);
                if (fields.length > 0) {
                    fields.forEach(function (field) {
                        var key = VMObject.FromObject(field);
                        VMObject.ValidateStructKey(key);
                        var val = srcObj[field];
                        var vmVal = _this.CastViaReflection(val, level + 1, true);
                        children_3.set(key, vmVal);
                    });
                    result = new VMObject();
                    result.SetValue(children_3);
                    result.Type = VMType_1.VMType.Struct;
                    return result;
                }
            }
            result = VMObject.FromObject(srcObj);
            if (result != null) {
                return result;
            }
            throw new Error("invalid cast: Interop.".concat(srcType, " to vm object"));
        }
    };
    VMObject.prototype.SetKey = function (key, obj) {
        VMObject.ValidateStructKey(key);
        var children;
        var temp = new VMObject();
        temp.Copy(key);
        key = temp;
        if (this.Type == VMType_1.VMType.Struct) {
            children = this.GetChildren();
        }
        else if (this.Type == VMType_1.VMType.None) {
            this.Type = VMType_1.VMType.Struct;
            children = new Map();
            this.Data = children;
            this._localSize = 0;
        }
        else {
            throw new Error("Invalid cast from ".concat(this.Type, " to struct"));
        }
        var result = new VMObject();
        children === null || children === void 0 ? void 0 : children.set(key, result);
        result.Copy(obj);
    };
    VMObject.prototype.Copy = function (other) {
        if (!other || other.Type == VMType_1.VMType.None) {
            this.Type = VMType_1.VMType.None;
            this.Data = null;
            return;
        }
        this.Type = other.Type;
        if (other.Type == VMType_1.VMType.Struct) {
            var children_4 = new Map();
            var otherChildren = other.GetChildren();
            otherChildren === null || otherChildren === void 0 ? void 0 : otherChildren.forEach(function (val, key) {
                var temp = new VMObject();
                temp.Copy(val);
                children_4.set(key, temp);
            });
            this.Data = children_4;
        }
        else {
            this.Data = other.Data;
        }
    };
    VMObject.FromArray = function (array) {
        var result = new VMObject();
        for (var i = 0; i < array.length; i++) {
            var key = VMObject.FromObject(i);
            var val = VMObject.FromObject(array[i]);
            result.SetKey(key, val);
        }
        return result;
    };
    VMObject.CastTo = function (srcObj, type) {
        if (srcObj.Type == type) {
            var result_1 = new VMObject();
            result_1.Copy(srcObj);
            return result_1;
        }
        switch (type) {
            case VMType_1.VMType.None:
                return new VMObject();
            case VMType_1.VMType.String: {
                var result_2 = new VMObject();
                result_2.SetValue(srcObj.AsString());
                return result_2;
            }
            case VMType_1.VMType.Timestamp: {
                var result_3 = new VMObject();
                result_3.SetValue(srcObj.AsTimestamp());
                return result_3;
            }
            case VMType_1.VMType.Bool: {
                var result_4 = new VMObject();
                result_4.SetValue(srcObj.AsBool());
                return result_4;
            }
            case VMType_1.VMType.Bytes: {
                var result_5 = new VMObject();
                result_5.SetValue(srcObj.AsByteArray());
                return result_5;
            }
            case VMType_1.VMType.Number: {
                var result_6 = new VMObject();
                result_6.SetValue(srcObj.AsNumber());
                return result_6;
            }
            case VMType_1.VMType.Struct: {
                switch (srcObj.Type) {
                    case VMType_1.VMType.Enum: {
                        var result = new VMObject();
                        result.SetValue(srcObj.AsEnum()); // TODO does this work for all types?
                        return result;
                    }
                    case VMType_1.VMType.Object: {
                        var result = new VMObject();
                        result.SetValue(srcObj.CastViaReflection(srcObj.Data, 0)); // TODO does this work for all types?
                        return result;
                    }
                    default:
                        throw "invalid cast: ".concat(srcObj.Type, " to ").concat(type);
                }
            }
            default:
                throw "invalid cast: ".concat(srcObj.Type, " to ").concat(type);
        }
    };
    VMObject.FromObject = function (obj) {
        var objType = obj.constructor.name;
        var type = this.GetVMType(objType);
        if (type === VMType_1.VMType.None) {
            throw new Error("not a valid object");
        }
        var result = new VMObject();
        switch (type) {
            case VMType_1.VMType.Bool:
                result.setValue(obj, VMType_1.VMType.Bool);
                break;
            case VMType_1.VMType.Bytes:
                result.setValue(obj, VMType_1.VMType.Bytes);
                break;
            case VMType_1.VMType.String:
                result.setValue(obj, VMType_1.VMType.String);
                break;
            case VMType_1.VMType.Enum:
                result.setValue(obj, VMType_1.VMType.Enum);
                break;
            case VMType_1.VMType.Object:
                result.setValue(obj, VMType_1.VMType.Object);
                break;
            case VMType_1.VMType.Number:
                /*if (objType === Number) {
                  obj = BigInt(obj);
                }*/
                result.setValue(obj, VMType_1.VMType.Number);
                break;
            case VMType_1.VMType.Timestamp:
                /*if (objType === "Number") {
                  obj = new Timestamp(obj);
                }*/
                result.setValue(obj, VMType_1.VMType.Timestamp);
                break;
            case VMType_1.VMType.Struct:
                result.Type = VMType_1.VMType.Struct;
                if (Array.isArray(obj)) {
                    return this.FromArray(obj);
                }
                else {
                    return this.FromStruct(obj);
                }
                break;
            default:
                return null;
        }
        return result;
    };
    VMObject.FromStruct = function (obj) {
        var vm = new VMObject();
        return vm.CastViaReflection(obj, 0, false);
    };
    // Serialization
    VMObject.FromBytes = function (bytes) {
        var result = new VMObject();
        result.UnserializeData(bytes);
        return result;
    };
    VMObject.prototype.SerializeData = function (writer) {
        var e_6, _a;
        writer.writeByte(this.Type);
        if (this.Type == VMType_1.VMType.None) {
            return;
        }
        var dataType = typeof this.Data;
        switch (this.Type) {
            case VMType_1.VMType.Struct: {
                var children = this.GetChildren();
                writer.writeVarInt(children.size);
                try {
                    for (var children_5 = __values(children), children_5_1 = children_5.next(); !children_5_1.done; children_5_1 = children_5.next()) {
                        var child = children_5_1.value;
                        child[0].SerializeData(writer);
                        child[1].SerializeData(writer);
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (children_5_1 && !children_5_1.done && (_a = children_5.return)) _a.call(children_5);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                /*children.forEach((key, value) => {
                  key.SerializeData(writer);
                  value.SerializeData(writer);
                });*/
                break;
            }
            case VMType_1.VMType.Object: {
                var obj = this.Data;
                if (obj != null) {
                    var bytes = types_1.Serialization.Serialize(obj);
                    var uintBytes = (0, utils_1.uint8ArrayToBytes)(bytes);
                    writer.writeByteArray(uintBytes);
                }
                else {
                    throw "Objects of type ".concat(dataType, " cannot be serialized");
                }
                break;
            }
            case VMType_1.VMType.Enum: {
                var temp2 = 0;
                if (this.Data instanceof Enumerator) {
                    var temp1 = this.Data.item;
                    temp2 = temp1;
                }
                else {
                    temp2 = this.Data;
                }
                writer.writeVarInt(temp2);
                break;
            }
            default:
                var localBytes = types_1.Serialization.Serialize(this.Data);
                writer.writeByteArray((0, utils_1.uint8ArrayToBytes)(localBytes));
                break;
        }
        return writer.toUint8Array();
    };
    /*UnserializeData(reader: PBinaryReader) {
      this.Type = reader.readByte();
      if (this.Type == VMType.None) {
        return;
      }
  
      switch (this.Type) {
        case VMType.Struct: {
          let children = new Map<VMObject, VMObject>();
          let count = reader.readVarInt();
          for (let i = 0; i < count; i++) {
            let key = new VMObject();
            key.UnserializeData(reader);
            let value = new VMObject();
            value.UnserializeData(reader);
            children.set(key, value);
          }
          this.Data = children;
          break;
        }
  
        case VMType.Object: {
          var bytes = reader.readByteArray();
          var obj = Serialization.Unserialize(bytes);
          this.Data = obj as Object;
          break;
        }
  
        case VMType.Enum: {
          let temp = reader.readVarInt();
          this.Data = temp as unknown as Enumerator;
          break;
        }
  
        default:
          this.Data = Serialization.UnserializeObject(reader, null);
          break;
      }
    }*/
    VMObject.prototype.UnserializeData = function (reader) {
        this.Type = reader.readByte();
        switch (this.Type) {
            case VMType_1.VMType.Bool:
                this.Data = types_1.Serialization.Unserialize(reader, Boolean);
                break;
            case VMType_1.VMType.Bytes:
                this.Data = types_1.Serialization.Unserialize(reader, Uint8Array);
                break;
            case VMType_1.VMType.Number:
                this.Data = types_1.Serialization.Unserialize(reader, BigInt);
                break;
            case VMType_1.VMType.Timestamp:
                this.Data = types_1.Serialization.Unserialize(reader, Timestamp_1.Timestamp);
                break;
            case VMType_1.VMType.String:
                this.Data = types_1.Serialization.Unserialize(reader, String);
                break;
            case VMType_1.VMType.Struct:
                var childCount = reader.readVarInt();
                var children = new Map();
                while (childCount > 0) {
                    var key = new VMObject();
                    key.UnserializeData(reader);
                    VMObject.ValidateStructKey(key);
                    var val = new VMObject();
                    val.UnserializeData(reader);
                    children.set(key, val);
                    childCount--;
                }
                this.Data = children;
                break;
            case VMType_1.VMType.Object:
                var bytes = reader.readByteArray();
                if (bytes.length == 35) {
                    var addr = types_1.Serialization.Unserialize(bytes, types_1.Address);
                    this.Data = addr;
                    this.Type = VMType_1.VMType.Object;
                }
                else {
                    this.Type = VMType_1.VMType.Bytes;
                    this.Data = bytes;
                }
                break;
            case VMType_1.VMType.Enum:
                this.Type = VMType_1.VMType.Enum;
                this.Data = reader.readVarInt();
                break;
            case VMType_1.VMType.None:
                this.Type = VMType_1.VMType.None;
                this.Data = null;
                break;
            default:
                throw new Error("invalid unserialize: type ".concat(this.Type));
        }
    };
    VMObject.TimeFormat = "MM/dd/yyyy HH:mm:ss";
    return VMObject;
}());
exports.VMObject = VMObject;
