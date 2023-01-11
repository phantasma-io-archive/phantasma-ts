
export class Entropy {
    //private static rnd = crypto.randomBytes(24);
    public static GetRandomBytes(targetLength: number): Buffer {
        const rnd = new Uint8Array(targetLength);
        return this.ToBuffer(self.crypto.getRandomValues(rnd).buffer);
    }

    public static ToBuffer(ab) : Buffer{
        const buf = Buffer.alloc(ab.byteLength);
        const view = new Uint8Array(ab);
        for (let i = 0; i < buf.length; ++i) {
            buf[i] = view[i];
        }
        return buf;
    }
}
