import BigInteger from "big-integer";
import { VMType } from "./VMType";
import { Timestamp } from "../types/Timestamp";
import { Address } from "../types";

export class VMObject {
  public Type: VMType;
  public Data: object | null | undefined;
  public get IsEmpty(): boolean {
    return this.Data == null || this.Data == undefined;
  }
  private _localSize = 0;
  private static readonly TimeFormat: string = "MM/dd/yyyy HH:mm:ss";

  public GetChildren(): Map<VMObject, VMObject> | null {
    return this.Type == VMType.Struct
      ? (this.Data as Map<VMObject, VMObject>)
      : null;
  }

  public get Size(): number {
    let total = 0;

    if (this.Type == VMType.Object) {
      const children = this.GetChildren();
      let values = children?.values;
      for (let entry in values) {
        total += entry.length;
      }
    } else {
      total = this._localSize;
    }

    return total;
  }

  constructor() {
    this.Type = VMType.None;
    this.Data = null;
  }

  public AsTimestamp(): Timestamp {
    if (this.Type != VMType.Timestamp) {
      throw new Error(`Invalid cast: expected timestamp, got ${this.Type}`);
    }

    return this.Data as Timestamp;
  }

  public AsByteArray(): Uint8Array {
    switch (this.Type) {
      case VMType.Bytes:
        return new Uint8Array(this.Data as ArrayBuffer);
      case VMType.Bool:
        return new Uint8Array([(this.Data as unknown as boolean) ? 1 : 0]);
      case VMType.String:
        return new TextEncoder().encode(this.AsString());
      case VMType.Number:
      // Here you will have to convert BigInteger to Uint8Array manually
      case VMType.Enum:
        var num = this.AsNumber() as unknown as number;
        var bytes = new Uint8Array(new ArrayBuffer(4));
        new DataView(bytes.buffer).setUint32(0, num);
        return bytes;
      case VMType.Timestamp:
        var time = this.AsTimestamp();
        var bytes = new Uint8Array(new ArrayBuffer(4));
        new DataView(bytes.buffer).setUint32(0, time.value);
        return bytes;
      case VMType.Struct:
      // Here you will have to convert struct to Uint8Array manually
      case VMType.Object:
      // here you will have to convert ISerializable to Uint8Array manually
      default:
        throw new Error(`Invalid cast: expected bytes, got ${this.Type}`);
    }
  }

  public AsString(): string {
    switch (this.Type) {
      case VMType.String:
        return this.Data as unknown as string;
      case VMType.Number:
        return (this.Data as BigInteger).toString();
      case VMType.Bytes:
        return new TextDecoder().decode(this.Data as Uint8Array);
      case VMType.Enum:
        return (this.Data as unknown as number).toString();
      case VMType.Object:
        if (this.Data instanceof Address) {
          return this.Data.Text;
        }
        /*if (this.Data instanceof Hash) {
              return this.Data.toString();
          }*/
        return "Interop:" + this.Data?.constructor.name;
      case VMType.Struct:
        const arrayType = this.GetArrayType();
        if (arrayType === VMType.Number) {
          // convert array of unicode numbers into a string
          const children = this.GetChildren();
          let sb = "";

          for (let i = 0; i < children!.size; i++) {
            const key = VMObject.FromObject(i);
            const val = children?.get(key);

            const ch = String.fromCharCode(
              val!.AsNumber() as unknown as number
            );
            sb += ch;
          }

          return sb;
        } else {
          /*const buffer = new ArrayBuffer(this.Data?.length as number);
              const view = new DataView(buffer);
              this.SerializeData(view);
              return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));*/
        }
      case VMType.Bool:
        return this.Data ? "true" : "false";
      case VMType.Timestamp:
        return (this.Data as Timestamp).value.toString();
      default:
        throw new Error(`Invalid cast: expected string, got ${this.Type}`);
    }
  }

  public ToString(): string {
    switch (this.Type) {
      case VMType.String:
        return this.Data as unknown as string;
      case VMType.Number:
        return (this.Data as BigInteger).toString();
      case VMType.Bytes:
        return new TextDecoder().decode(this.Data as Uint8Array);
      case VMType.Enum:
        return (this.Data as unknown as number).toString();
      case VMType.Object:
        if (this.Data instanceof Address) {
          return this.Data.Text;
        }
        /*if (this.Data instanceof Hash) {
              return this.Data.toString();
          }*/
        return "Interop:" + (this.Data as object).constructor.name;
      case VMType.Struct:
        const arrayType = this.GetArrayType();
        if (arrayType === VMType.Number) {
          // convert array of unicode numbers into a string
          const children = this.GetChildren();
          let sb = "";
          for (let i = 0; i < children!.size; i++) {
            const key = VMObject.FromObject(i);
            const val = children!.get(key);
            const ch = String.fromCharCode(
              val!.AsNumber() as unknown as number
            );
            sb += ch;
          }
          return sb;
        } else {
          /*const stream = new PMemoryStream();
              const writer = new PBinaryWriter(stream);
              this.SerializeData(writer);
              return new TextDecoder().decode(stream.toArray());*/
        }
      case VMType.Bool:
        return this.Data ? "true" : "false";
      case VMType.Timestamp:
        return (this.Data as Timestamp).value.toString();
      default:
        throw new Error(`Invalid cast: expected string, got ${this.Type}`);
    }
  }

  public AsNumber(): BigInt {
    if (
      (this.Type === VMType.Object || this.Type === VMType.Timestamp) &&
      this.Data instanceof Timestamp
    ) {
      return (this.Data as Timestamp).value as unknown as BigInt;
    }

    switch (this.Type) {
      case VMType.String: {
        let number: BigInt = BigInt(this.Data as unknown as string);
        if (number.toString() === (this.Data as unknown as string)) {
          return number;
        } else {
          throw new Error(
            `Cannot convert String '${this.Data}' to BigInteger.`
          );
        }
      }

      case VMType.Bytes: {
        const bytes = new Uint8Array(this.Data as ArrayBuffer);
        const num = BigInt(`0x${bytes.join("")}`);
        return num;
      }

      case VMType.Enum: {
        const num = Number(this.Data);
        return BigInt(num);
      }

      case VMType.Bool: {
        const val = this.Data as unknown as boolean;
        return val ? BigInt(1) : BigInt(0);
      }

      default: {
        if (this.Type !== VMType.Number) {
          throw new Error(`Invalid cast: expected number, got ${this.Type}`);
        }

        return this.Data as BigInt;
      }
    }
  }

  public AsEnum<T extends any>(): T {
    if (!VMObject.isEnum(this.Data as any)) {
      throw new Error("T must be an enumerated type");
    }

    if (this.Type !== VMType.Enum) {
      this.Data = new Number(this.AsNumber());
    }

    return this.Data as any as T;
  }

  public GetArrayType(): VMType {
    if (this.Type !== VMType.Struct) {
      return VMType.None;
    }

    const children = this.GetChildren();

    let result: VMType = VMType.None;

    for (let i = 0; i < children!.size; i++) {
      const key = VMObject.FromObject(i);

      if (!children!.has(key)) {
        return VMType.None;
      }

      const val = children!.get(key);

      if (result === VMType.None) {
        result = val!.Type;
      } else if (val!.Type !== result) {
        return VMType.None;
      }
    }

    return result;
  }

  /*
    public AsType(type: VMType): object {
        switch (type) {
            case VMType.Bool:
            return this.AsBool();
            case VMType.String:
            return this.AsString();
            case VMType.Bytes:
            return this.AsByteArray();
            case VMType.Number:
            return this.AsNumber();
            case VMType.Timestamp:
            return this.AsTimestamp();
            default:
            throw ("Unsupported VM cast");
        }
    }*/

  static isEnum(instance: Object): boolean {
    let keys = Object.keys(instance);
    let values: any[] = [];

    for (let key of keys) {
      let value = instance[key];

      if (typeof value === "number") {
        value = value.toString();
      }

      values.push(value);
    }

    for (let key of keys) {
      if (values.indexOf(key) < 0) {
        return false;
      }
    }

    return true;
  }

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

  public AsBool(): boolean {
    switch (this.Type) {
      case VMType.String:
        return (this.Data as unknown as string).toLowerCase() == "true";
      case VMType.Number:
        return (this.Data as BigInt) != BigInt(0);
      case VMType.Bool:
        return this.Data as unknown as boolean;
      default:
        throw new Error(`Invalid cast: expected bool, got ${this.Type}`);
    }
  }

  public static isStructOrClass(type: any): boolean {
    if (type === String) {
      return false;
    }
    return (
      (!VMObject.isPrimitive(type) &&
        VMObject.isValueType(type) &&
        !VMObject.isEnum(type)) ||
      VMObject.isClass(type) ||
      VMObject.isInterface(type)
    );
  }

  public static isSerializable(type: any): boolean {
    return (
      VMObject.isPrimitive(type) ||
      VMObject.isStructOrClass(type) ||
      VMObject.isEnum(type)
    );
  }

  public static isPrimitive(type: any): boolean {
    return (
      type === String || type === Number || type === Boolean || type === BigInt
    );
  }

  public static isValueType(type: any): boolean {
    return type === Object;
  }

  public static isClass(type: any): boolean {
    return type === Array;
  }

  public static isInterface(type: any): boolean {
    return type === Map;
  }

  public ToStruct(structType: any): any {
    if (this.Type !== VMType.Struct) {
      throw new Error("not a valid source struct");
    }
    if (!VMObject.isStructOrClass(structType)) {
      throw new Error("not a valid destination struct");
    }
    const dict = this.GetChildren();
    const fields = Object.getOwnPropertyNames(structType);
    const result = new structType();
    for (const field of fields) {
      const key = VMObject.FromObject(field);
      let val;
      if (dict?.hasOwnProperty(key)) {
        val = dict[key].toObject(structType[field]);
      } else {
        if (!VMObject.isStructOrClass(structType[field])) {
          throw new Error(`field not present in source struct: ${field}`);
        }
        val = null;
      }
      if (
        val !== null &&
        structType[field] !== "Uint8Array" &&
        val.constructor.name === "Uint8Array"
      ) {
        if (VMObject.isSerializable(structType[field])) {
          const temp = new structType[field]();
          const bytes = new Uint8Array(val);
          const stream = new Uint8Array(bytes);
          const reader = new Uint8Array(stream);
          temp.unserializeData(reader);
          val = temp;
        }
      }
      if (VMObject.isEnum(structType[field]) && !VMObject.isEnum(val)) {
        val = structType[field][val.toString()];
      }
      result[field] = val;
    }
    return result;
  }

  public static GetVMType(type: any): any {
    if (VMObject.isEnum(type)) {
      return VMType.Enum;
    }
    if (type === Boolean) {
      return VMType.Bool;
    }
    if (type === String) {
      return VMType.String;
    }
    if (type === "Uint8Array") {
      return VMType.Bytes;
    }
    if (type === "BigInt" || type === Number) {
      return VMType.Number;
    }
    if (type === Timestamp || type === Number) {
      return VMType.Timestamp;
    }
    if (VMObject.isEnum(type)) {
      return VMType.Enum;
    }
    if (VMObject.isClass(type) || VMObject.isValueType(type)) {
      return VMType.Object;
    }
    return VMType.Object;
  }

  public static IsVMType(type: any): boolean {
    const result = VMObject.GetVMType(type);
    return result !== VMType.None;
  }

  public SetValue(value: any): VMObject {
    this.Data = value;
    return this;
  }

  public setValue(val: any, type: VMType) {
    this.Type = type;
    this._localSize = val != null ? val.length : 0;

    switch (type) {
      case VMType.Bytes:
        this.Data = val;
        break;
      case VMType.Number:
        this.Data = val == null ? BigInt(0) : val;
        break;
      case VMType.String:
        this.Data = new String(val);
        break;
      case VMType.Enum:
        this.Data = val.slice(0, 4);
        break;
      case VMType.Timestamp:
        this.Data = new Timestamp(val.slice(0, 4));
        break;
      case VMType.Bool:
        this.Data = new Boolean(val[0] === 1);
        break;
      default:
        if (val instanceof Uint8Array) {
          const len = val.length;
          switch (len) {
            case Address.LengthInBytes:
              this.Data = Address.FromBytes(val);
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
        } else {
          throw new Error("Cannot set value for vmtype: " + type);
        }
    }
  }

  public static ValidateStructKey(key: VMObject) {
    if (
      key.Type == VMType.None ||
      key.Type == VMType.Struct ||
      key.Type == VMType.Object
    ) {
      throw new Error(
        `Cannot use value of type ${key.Type} as key for struct field`
      );
    }
  }

  public CastViaReflection(
    srcObj: any,
    level: number,
    dontConvertSerializables: boolean = true
  ): any {
    const srcType = srcObj.constructor.name;
    if (Array.isArray(srcObj)) {
      const children = new Map<any, any>();
      const array = srcObj;
      for (let i = 0; i < array.length; i++) {
        const val = array[i];
        const key = new VMObject();
        key.SetValue(i);
        const vmVal = this.CastViaReflection(val, level + 1);
        children.set(key, vmVal);
      }
      const result = new VMObject();
      result.SetValue(children);
      return result;
    } else {
      const targetType = VMObject.GetVMType(srcType);

      let result: any;
      let isKnownType =
        srcType === VMType.Number || srcType === VMType.Timestamp;
      if (
        !isKnownType &&
        dontConvertSerializables &&
        VMObject.isSerializable(srcObj)
      ) {
        isKnownType = true;
      }
      if (VMObject.isStructOrClass(srcType) && !isKnownType) {
        const children = new Map<any, any>();
        const fields = Object.keys(srcObj);
        if (fields.length > 0) {
          fields.forEach((field: any) => {
            const key = new VMObject();
            key.SetValue(field);
            VMObject.ValidateStructKey(key);
            const val = srcObj[field];
            const vmVal = this.CastViaReflection(val, level + 1, true);
            children.set(key, vmVal);
          });
          result = new VMObject();
          result.SetValue(children);
          return result;
        }
      }
      result = VMObject.FromObject(srcObj);
      if (result != null) {
        return result;
      }
      throw new Error(`invalid cast: Interop.${srcType} to vm object`);
    }
  }

  SetKey(key: VMObject, obj: VMObject) {
    VMObject.ValidateStructKey(key);
    let children: Map<VMObject, VMObject> | null;
    const temp = new VMObject();
    temp.Copy(key);
    key = temp;

    if (this.Type == VMType.Struct) {
      children = this.GetChildren();
    } else if (this.Type == VMType.None) {
      this.Type = VMType.Struct;
      children = new Map();
      this.Data = children;
      this._localSize = 0;
    } else {
      throw new Error(`Invalid cast from ${this.Type} to struct`);
    }
    const result = new VMObject();
    children?.set(key, result);
    result.Copy(obj);
  }

  Copy(other: VMObject) {
    if (!other || other.Type == VMType.None) {
      this.Type = VMType.None;
      this.Data = null;
      return;
    }
    this.Type = other.Type;
    if (other.Type == VMType.Struct) {
      const children = new Map<VMObject, VMObject>();
      const otherChildren = other.GetChildren();
      otherChildren?.forEach((val: VMObject, key: VMObject) => {
        const temp = new VMObject();
        temp.Copy(val);
        children.set(key, temp);
      });
      this.Data = children;
    } else {
      this.Data = other.Data;
    }
  }

  public static FromArray(array: any[]) {
    const result = new VMObject();
    for (let i = 0; i < array.length; i++) {
      const key = VMObject.FromObject(i);
      const val = VMObject.FromObject(array[i]);
      result.SetKey(key, val);
    }
    return result;
  }

  static CastTo(srcObj: VMObject, type: VMType): VMObject {
    if (srcObj.Type == type) {
      let result = new VMObject();
      result.Copy(srcObj);
      return result;
    }

    switch (type) {
      case VMType.None:
        return new VMObject();

      case VMType.String: {
        let result = new VMObject();
        result.SetValue(srcObj.AsString());
        return result;
      }

      case VMType.Timestamp: {
        let result = new VMObject();
        result.SetValue(srcObj.AsTimestamp());
        return result;
      }

      case VMType.Bool: {
        let result = new VMObject();
        result.SetValue(srcObj.AsBool());
        return result;
      }

      case VMType.Bytes: {
        let result = new VMObject();
        result.SetValue(srcObj.AsByteArray());
        return result;
      }

      case VMType.Number: {
        let result = new VMObject();
        result.SetValue(srcObj.AsNumber());
        return result;
      }

      case VMType.Struct: {
        switch (srcObj.Type) {
          case VMType.Enum: {
            var result = new VMObject();
            result.SetValue(srcObj.AsEnum()); // TODO does this work for all types?
            return result;
          }
          case VMType.Object: {
            var result = new VMObject();
            result.SetValue(srcObj.CastViaReflection(srcObj.Data, 0)); // TODO does this work for all types?
            return result;
          }
          default:
            throw `invalid cast: ${srcObj.Type} to ${type}`;
        }
      }
      default:
        throw `invalid cast: ${srcObj.Type} to ${type}`;
    }
  }

  public static FromObject(obj: any): any {
    const objType = obj.constructor.name;
    const type = this.GetVMType(objType);
    if (type === "None") {
      throw new Error("not a valid object");
    }
    const result = new VMObject();
    switch (type) {
      case VMType.Bool:
        result.SetValue(obj);
        break;
      case VMType.Bytes:
        result.setValue(new Uint8Array(obj), VMType.Bytes);
        break;
      case VMType.String:
        result.SetValue(obj);
        break;
      case VMType.Enum:
        result.SetValue(obj);
        break;
      case VMType.Object:
        result.SetValue(obj);
        break;
      case VMType.Number:
        if (objType === "Number") {
          obj = BigInt(obj);
        }
        result.SetValue(obj);
        break;
      case VMType.Timestamp:
        if (objType === "Number") {
          obj = new Timestamp(obj);
        }
        result.SetValue(obj);
        break;
      case "Struct":
        if (Array.isArray(obj)) {
          return this.FromArray(obj);
        }
        break;
      default:
        return null;
    }
    return result;
  }
}
