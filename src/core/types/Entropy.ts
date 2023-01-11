import crypto from 'crypto';

export class Entropy {
    //private static rnd = crypto.randomBytes(24);
    public static GetRandomBytes(targetLength: number): Buffer {
        return crypto.randomBytes(targetLength);
    }
}
