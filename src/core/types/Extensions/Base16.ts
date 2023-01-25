export class Base16 {
  static encode(str: string) {
    if (!str) return "";

    return str
      .split("")
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  }

  static encodeUint8Array(arr: Uint8Array) {
    return Array.from(arr)
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  }

  static decode(str: string) {
    if (!str || str.length % 2 !== 0) return "";

    return (
      str
        .match(/.{1,2}/g)
        ?.map((c) => String.fromCharCode(parseInt(c, 16)))
        .join("") ?? ""
    );
  }
}
