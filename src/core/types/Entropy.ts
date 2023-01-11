
export class Entropy {
    //private static rnd = crypto.randomBytes(24);
    public static GetRandomBytes(targetLength: number): Buffer {
        const crypto = require('crypto');
        return crypto.randomBytes(targetLength);
    }
}
