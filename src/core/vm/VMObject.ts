import BigInteger from "big-integer";
import { VMType } from "./VMType";
import { Timestamp } from "../types/Timestamp";

export class VMObject {
    public Type: VMType;
    public Data: object | null | undefined;
    public get IsEmpty(): boolean {
      return this.Data == null || this.Data == undefined;
    }
    private _localSize = 0;
    private static readonly TimeFormat: string = "MM/dd/yyyy HH:mm:ss";
  
    public GetChildren(): Map<VMObject, VMObject> | null {
      return this.Type == VMType.Struct ? (this.Data as Map<VMObject, VMObject>) : null;
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

    /*public AsNumber(): BigInteger {
        if ((this.Type == VMType.Object || this.Type == VMType.Timestamp) && (this.Data instanceof Timestamp)) {
            return (this.Data as Timestamp).Value;
        }

        switch (this.Type) {
            case VMType.String:
            {
                if (BigInteger.TryParse(this.Data as string, out const number))
                {
                    return number;
                } else {
                    throw new Error(`Cannot convert String ${this.Data} to BigInteger.`);
                }
            }

            case VMType.Bytes:
            {
                const bytes = this.Data as Uint8Array;
                const num = new BigInteger(bytes);
                return num;
            }

            case VMType.Enum:
            {
                const num = Number(this.Data);
                return num;
            }

            case VMType.Bool:
            {
                const val = this.Data as boolean;
                return val ? 1 : 0;
            }

            case default:
            {
                if (this.Type != VMType.Number) 
                {
                    throw new Error(`Invalid cast: expected number, got ${this.Type}`);
                }

                return this.Data as BigInteger;
            }
        }
    }

    

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
            throw new ArgumentException("Unsupported VM cast");
        }
    }*/
    
    isEnum(instance: Object): boolean {
        let keys = Object.keys(instance);
        let values : any[] = [];
    
        for (let key of keys) {
          let value = instance[key];
    
          if (typeof value === 'number') {
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

    /*public AsString(): string {
        switch (this.Type) {
            case VMType.String:
            return this.Data as unknown as string;
            case VMType.Object:
            {
                const sb = new StringBuilder();
                sb.AppendLine("{");
                const children = this.GetChildren();
                for (const [key, value] of children) {
                    sb.AppendLine($"  {key.AsString()}: {value.AsString()}");
                }
                sb.AppendLine("}");
                return sb.toString();
            }
            case VMType.Timestamp:
                return (this.Data as Timestamp).ToString(VMObject.TimeFormat);
            case VMType.Bytes:
                return Convert.ToBase64String(this.Data as Uint8Array);
            case VMType.Enum:
                return this.Data.toString();
            case VMType.Number:
                return (this.Data as BigInteger).toString();
            case VMType.Bool:
                return (this.Data as boolean).toString();
            default:
                return this.Data.toString();
        }
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

    /*public AsByteArray(): Uint8Array {
        switch (this.Type) {
            case VMType.Bytes:
                return this.Data as Uint8Array;
            case VMType.String:
                return Convert.FromBase64String(this.Data as string);
            default:
                throw new Error(Invalid cast: expected bytes, got ${this.Type});
        }
    }*/
}  