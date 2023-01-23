import crypto from "crypto";
export class Entropy {
  //private static rnd = crypto.randomBytes(24);
  public static GetRandomBytes(targetLength: number): Buffer {
    let rnd = new Uint8Array(targetLength);
    const privateKey = Buffer.alloc(rnd.byteLength);

    crypto.getRandomValues(rnd);

    for (let i = 0; i < 32; ++i) {
      privateKey.writeUInt8(rnd[i], i);
    }
    //let pk = this.ToBuffer(rnd);
    return privateKey;
  }
}
