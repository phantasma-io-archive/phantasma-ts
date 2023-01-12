export function hexToByteArray(hexBytes: string) {
  const res = [hexBytes.length / 2];
  for (let i = 0; i < hexBytes.length; i += 2) {
    const hexdig = hexBytes.substr(i, 2);
    if (hexdig == "") {
      res.push(0);
    } else res.push(parseInt(hexdig, 16));
  }
  return res;
}

export function hexStringToBytes(hexString: string) {
  for (var bytes = [], c = 0; c < hexString.length; c += 2)
    bytes.push(parseInt(hexString.substr(c, 2), 16));
  return bytes;
}

export function byteArrayToHex(arr: ArrayBuffer | ArrayLike<number>): string {
  if (typeof arr !== "object") {
    throw new Error(`ba2hex expects an array.Input was ${arr}`);
  }
  let result = "";
  const intArray = new Uint8Array(arr);
  for (const i of intArray) {
    let str = i.toString(16);
    str = str.length === 0 ? "00" : str.length === 1 ? "0" + str : str;
    result += str;
  }
  return result;
}

export function reverseHex(hex: string): string {
  let out = "";
  for (let i = hex.length - 2; i >= 0; i -= 2) {
    out += hex.substr(i, 2);
  }
  return out;
}

export function getDifficulty(transactionHash: string) {
  let bytes = hexStringToBytes(transactionHash).reverse();
  let result = 0;

  for (let i = 0; i < bytes.length; i++) {
    var n = bytes[i];
    for (let j = 0; j < 8; j++) {
      if ((bytes[i] & (1 << j)) != 0) {
        result = 1 + (i << 3) + j;
      }
    }
  }

  return 256 - result;
}

export function decodeBase16(hex: string) {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

export function encodeBase16(str: string) {
  return str
    .split("")
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

export function uint8ArrayToString(array: Uint8Array): string {
  let result = "";
  for (let i = 0; i < array.length; i++) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}

export function uint8ArrayToNumberArray(array: Uint8Array): number[] {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(array[i]);
  }
  return result;
}

export function stringToUint8Array(str: string): Uint8Array {
  let result = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    result[i] = str.charCodeAt(i);
  }
  return result;
}

export function arrayNumberToUint8Array(arr: number[]): Uint8Array {
  let result = new Uint8Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[i];
  }
  return result;
}

export function uint8ArrayToBytes(array: Uint8Array): number[] {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(array[i]);
  }
  return result;
}
