import base58 from "bs58";
import { Opcode } from "./Opcode";
import { VMType } from "./VMType";

type byte = number;

const MaxRegisterCount = 32;

export enum Contracts {
  GasContractName = "gas",
  BlockContractName = "block",
  StakeContractName = "stake",
  SwapContractName = "swap",
  AccountContractName = "account",
  ConsensusContractName = "consensus",
  GovernanceContractName = "governance",
  StorageContractName = "storage",
  ValidatorContractName = "validator",
  InteropContractName = "interop",
  ExchangeContractName = "exchange",
  PrivacyContractName = "privacy",
  RelayContractName = "relay",
  RankingContractName = "ranking",
}

export class ScriptBuilder {
  _labelLocations: { [id: string]: number } = {};
  _jumpLocations: { [id: number]: string } = {};

  public str: string;

  public nullAddress = "S1111111111111111111111111111111111";

  public constructor() {
    this.str = "";
  }

  public beginScript() {
    this.str = "";
  }

  public getScript(): string {
    return this.str;
  }

  public endScript(): string {
    this.emit(Opcode.RET);
    return this.str;
  }

  public emit(opcode: Opcode, bytes?: number[]): this {
    this.appendByte(opcode);
    if (bytes) {
      this.emitBytes(bytes);
    }
    return this;
  }

  public emitPush(reg: byte): this {
    this.emit(Opcode.PUSH);
    this.appendByte(reg);
    return this;
  }

  public emitPop(reg: byte): this {
    this.emit(Opcode.POP);
    this.appendByte(reg);
    return this;
  }

  public emitExtCall(method: string, reg: byte = 0): this {
    this.emitLoad(reg, method);
    this.emit(Opcode.EXTCALL);
    this.appendByte(reg);
    return this;
  }

  public emitBigInteger(value: string) {

    let bytes: number[] = []

    if (value == '0') {
      bytes = [0]
    }
    else if (value.startsWith('-1'))
    {
      throw new Error('Unsigned bigint serialization not suppoted')
    }
    else {
      let hex = BigInt(value).toString(16)
      if (hex.length % 2) hex = '0' + hex
      const len = hex.length / 2
      var i = 0;
      var j = 0;
      while (i < len) {
        bytes.unshift(parseInt(hex.slice(j, j+2), 16));  // little endian
        i += 1;
        j += 2;
      }
      bytes.push(0)  // add sign at the end
    }
    return this.emitByteArray(bytes)
  }

  public emitAddress(textAddress: string) {
    const bytes = [...base58.decode(textAddress.substring(1))]
    return this.emitByteArray(bytes)
  }

  rawString(value: string) {
    var data = [];
    for (var i = 0; i < value.length; i++) {
      data.push(value.charCodeAt(i));
    }
    return data;
  }

  public emitLoad(reg: number, obj: any): this {
    switch (typeof obj) {
      case "string": {
        let bytes = this.rawString(obj);
        this.emitLoadBytes(reg, bytes, VMType.String);
        break;
      }

      case "boolean": {
        let bytes = [(obj as boolean) ? 1 : 0];
        this.emitLoadBytes(reg, bytes, VMType.Bool);
        break;
      }

      case "number": {
        // obj is BigInteger
        // var bytes = val.ToSignedByteArray();
        // this.emitLoadBytes(reg, bytes, VMType.Number);
        let bytes = this.rawString(BigInt(obj).toString());
        this.emitLoadBytes(reg, bytes, VMType.String);
        break;
      }

      case "object":
        if (Array.isArray(obj)) {
          this.emitLoadBytes(reg, obj as number[]);
        } else if (obj instanceof Date) {
          this.emitLoadTimestamp(reg, obj);
        } else throw Error("Load type " + typeof obj + " not supported");
        break;
      default:
        throw Error("Load type " + typeof obj + " not supported");
    }
    return this;
  }

  public emitLoadBytes(
    reg: number,
    bytes: byte[],
    type: VMType = VMType.Bytes
  ): this {
    if (bytes.length > 0xffff) throw new Error("tried to load too much data");

    this.emit(Opcode.LOAD);
    this.appendByte(reg);
    this.appendByte(type);

    this.emitVarInt(bytes.length);
    this.emitBytes(bytes);
    return this;
  }

  public emitLoadEnum(reg: number, enumVal: number): this {
    // var temp = Convert.ToUInt32(enumVal);
    // var bytes = BitConverter.GetBytes(temp);

    let bytes = [0, 0, 0, 0];

    for (let i = 0; i < bytes.length; i++) {
      var byte = enumVal & 0xff;
      bytes[i] = byte;
      enumVal = (enumVal - byte) / 256;
    }

    this.emitLoadBytes(reg, bytes, VMType.Enum);
    return this;
  }

  public emitLoadTimestamp(reg: number, obj: Date): this {
    let num = (obj.getTime() + obj.getTimezoneOffset() * 60 * 1000) / 1000;

    let a = (num & 0xff000000) >> 24;
    let b = (num & 0x00ff0000) >> 16;
    let c = (num & 0x0000ff00) >> 8;
    let d = num & 0x000000ff;

    let bytes = [d, c, b, a];
    this.emitLoadBytes(reg, bytes, VMType.Timestamp);
    return this;
  }

  public emitMove(src_reg: number, dst_reg: number): this {
    this.emit(Opcode.MOVE);
    this.appendByte(src_reg);
    this.appendByte(dst_reg);
    return this;
  }

  public emitCopy(src_reg: number, dst_reg: number): this {
    this.emit(Opcode.COPY);
    this.appendByte(src_reg);
    this.appendByte(dst_reg);
    return this;
  }

  public emitLabel(label: string): this {
    this.emit(Opcode.NOP);
    this._labelLocations[label] = this.str.length;
    return this;
  }

  public emitJump(opcode: Opcode, label: string, reg: number = 0): this {
    switch (opcode) {
      case Opcode.JMP:
      case Opcode.JMPIF:
      case Opcode.JMPNOT:
        this.emit(opcode);
        break;

      default:
        throw new Error("Invalid jump opcode: " + opcode);
    }

    if (opcode != Opcode.JMP) {
      this.appendByte(reg);
    }

    var ofs = this.str.length;
    this.appendUshort(0);
    this._jumpLocations[ofs] = label;
    return this;
  }

  public emitCall(label: string, regCount: byte): this {
    if (regCount < 1 || regCount > MaxRegisterCount) {
      throw new Error("Invalid number of registers");
    }

    var ofs = this.str.length; //(int)stream.Position;
    ofs += 2;
    this.emit(Opcode.CALL);
    this.appendByte(regCount);
    this.appendUshort(0);

    this._jumpLocations[ofs] = label;
    return this;
  }

  public emitConditionalJump(
    opcode: Opcode,
    src_reg: byte,
    label: string
  ): this {
    if (opcode != Opcode.JMPIF && opcode != Opcode.JMPNOT) {
      throw new Error("Opcode is not a conditional jump");
    }

    var ofs = this.str.length;
    ofs += 2;

    this.emit(opcode);
    this.appendByte(src_reg);
    this.appendUshort(0);
    this._jumpLocations[ofs] = label;
    return this;
  }

  public insertMethodArgs(args: any[]) {
    let temp_reg = 0;
    for (let i = args.length - 1; i >= 0; i--) {
      let arg = args[i];
      this.emitLoad(temp_reg, arg);
      this.emitPush(temp_reg);
    }
  }

  public callInterop(method: string, args: any[]): this {
    this.insertMethodArgs(args);

    let dest_reg = 0;
    this.emitLoad(dest_reg, method);

    this.emit(Opcode.EXTCALL, [dest_reg]);
    return this;
  }

  public callContract(contractName: string, method: string, args: any[]) {
    this.insertMethodArgs(args);

    let temp_reg = 0;
    this.emitLoad(temp_reg, method);
    this.emitPush(temp_reg);

    let src_reg = 0;
    let dest_reg = 1;
    this.emitLoad(src_reg, contractName);
    this.emit(Opcode.CTX, [src_reg, dest_reg]);

    this.emit(Opcode.SWITCH, [dest_reg]);
    return this;
  }

  //#region ScriptBuilderExtensions

  public allowGas(
  ): this {
    return this.callContract(Contracts.GasContractName, "AllowGas", []);
  }

  public spendGas(): this {
    return this.callContract(Contracts.GasContractName, "SpendGas", []);
  }

  async callRPC<T>(methodName: string, params: any[]): Promise<T> {
    return ("bla" as unknown) as T;
  }

  async getAddressTransactionCount(
    address: string,
    chainInput: string
  ): Promise<number> {
    let params = [address, chainInput];
    return await this.callRPC<number>("getAddressTransactionCount", params);
  }

  //#endregion

  public emitByteArray(bytes: number[]) {
    this.emitVarInt(bytes.length)
    this.emitBytes(bytes)
    return this
  }

  public emitVarString(text: string): this {
    let bytes = this.rawString(text);
    this.emitVarInt(bytes.length);
    this.emitBytes(bytes);
    return this;
  }

  public emitVarInt(value: number): this {
    if (value < 0) throw "negative value invalid";

    if (value < 0xfd) {
      this.appendByte(value);
    } else if (value <= 0xffff) {
      let B = (value & 0x0000ff00) >> 8;
      let A = value & 0x000000ff;

      // TODO check if the endianess is correct, might have to reverse order of appends
      this.appendByte(0xfd);
      this.appendByte(A);
      this.appendByte(B);
    } else if (value <= 0xffffffff) {
      let C = (value & 0x00ff0000) >> 16;
      let B = (value & 0x0000ff00) >> 8;
      let A = value & 0x000000ff;

      // TODO check if the endianess is correct, might have to reverse order of appends
      this.appendByte(0xfe);
      this.appendByte(A);
      this.appendByte(B);
      this.appendByte(C);
    } else {
      let D = (value & 0xff000000) >> 24;
      let C = (value & 0x00ff0000) >> 16;
      let B = (value & 0x0000ff00) >> 8;
      let A = value & 0x000000ff;

      // TODO check if the endianess is correct, might have to reverse order of appends
      this.appendByte(0xff);
      this.appendByte(A);
      this.appendByte(B);
      this.appendByte(C);
      this.appendByte(D);
    }
    return this;
  }

  emitBytes(bytes: byte[]): this {
    for (let i = 0; i < bytes.length; i++) this.appendByte(bytes[i]);

    // writer.Write(bytes);
    return this;
  }

  //Custom Modified
  byteToHex(byte: number) {
    let result = ('0' + (byte & 0xFF).toString(16)).slice(-2);
    return result;
  }

  appendByte(byte: number) {
    this.str += this.byteToHex(byte);
  }

  //Custom Modified
  appendBytes(bytes: byte[]) {
    for (let i = 0; i < bytes.length; i++) {
      this.appendByte(bytes[i]);
    }
  }

  appendUshort(ushort: number) {
    this.str +=
      this.byteToHex(ushort & 0xff) + this.byteToHex((ushort >> 8) & 0xff);
  }

  appendHexEncoded(bytes: string): this {
    this.str += bytes;
    return this;
  }
}