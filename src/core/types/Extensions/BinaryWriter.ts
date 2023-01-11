import { BinaryWriter, BinaryReader, Encoding } from "csharp-binary-stream";
import { Timestamp } from "../Timestamp";

type byte = number;

export class PBinaryWriter extends BinaryWriter{
    public appendByte(value: number): this {
        this.writeByte(value);
        return this;
    }

    public appendBytes(bytes: byte[]) {
        for (let i = 0; i < bytes.length; i++) {
          this.appendByte(bytes[i]);
        }
    }

    writeBytes(bytes: byte[]): this {
        for (let i = 0; i < bytes.length; i++) this.appendByte(bytes[i]);
    
        // writer.Write(bytes);
        return this;
    }
    
    public writeVarInt(value: number): this {
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


    public writeTimestamp(obj: Timestamp): this {
        let num = obj.value;
    
        let a = (num & 0xff000000) >> 24;
        let b = (num & 0x00ff0000) >> 16;
        let c = (num & 0x0000ff00) >> 8;
        let d = num & 0x000000ff;
    
        let bytes = [d, c, b, a];
        this.appendBytes(bytes);
        return this;
    }

    public writeDateTime(obj: Date): this {
        let num = (obj.getTime() + obj.getTimezoneOffset() * 60 * 1000) / 1000;
    
        let a = (num & 0xff000000) >> 24;
        let b = (num & 0x00ff0000) >> 16;
        let c = (num & 0x0000ff00) >> 8;
        let d = num & 0x000000ff;
    
        let bytes = [d, c, b, a];
        this.appendBytes(bytes);
        return this;
    }

    rawString(value: string) {
        var data = [];
        for (var i = 0; i < value.length; i++) {
          data.push(value.charCodeAt(i));
        }
        return data;
    }

    public writeByteArray(bytes: number[]) {
        this.writeVarInt(bytes.length)
        this.writeBytes(bytes)
        return this
    }
    
    public writeString(text: string): this {
        let bytes = this.rawString(text);
        this.writeVarInt(bytes.length);
        this.writeBytes(bytes);
        return this;
    }
    
    
      public emitUInt32(value: number): this {
        if (value < 0) throw "negative value invalid";
    
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
        
        return this;
      }

    public writeBigInteger(value: BigInt){
        return this.writeBigIntegerString(value.toString());
    }

    public writeBigIntegerString(value: string) {

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
        return this.writeByteArray(bytes)
    }


}