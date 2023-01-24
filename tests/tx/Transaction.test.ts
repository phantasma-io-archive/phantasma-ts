import { phantasmaJS } from "../..";
import Buffer from "Buffer";
import crypto from "crypto";
import {
  getAddressFromWif,
  getWifFromPrivateKey,
  PBinaryReader,
  PhantasmaKeys,
  stringToUint8Array,
  uint8ArrayToHex,
  uint8ArrayToString,
} from "../../core";

describe("test phantasma_ts", function () {
  test("test phantasma-ts.Transaction.SerializeData", function (done) {
    let writer = new phantasmaJS.PBinaryWriter();
    let keys = PhantasmaKeys.generate();

    let nexusName = "nexus";
    let chainName = "main";
    let script = "script";
    let expiration = new Date(17898129498);
    let payload = "payload";
    let signatures = [new phantasmaJS.Ed25519Signature()];
    writer.writeString(nexusName);
    let tx = new phantasmaJS.Transaction(
      nexusName,
      chainName,
      script,
      expiration,
      payload
    );
    tx.signWithKeys(keys);
    tx.SerializeData(writer);
    /*expect(writer.toUint8Array()).toBe([
      5, 110, 101, 120, 117, 115, 5, 110, 101, 120, 117, 115, 5, 109, 97, 105,
      110,
    ]);*/
    done();
  });

  test("sginature", function (done) {
    let writer = new phantasmaJS.PBinaryWriter();
    let keys = PhantasmaKeys.generate();

    let wifTest = "L5UEVHBjujaR1721aZM5Zm5ayjDyamMZS9W35RE9Y9giRkdf3dVx";
    let keyFromWif = PhantasmaKeys.fromWIF(wifTest);

    expect(keyFromWif.toWIF()).toBe(wifTest);

    let nexusName = "nexus";
    let chainName = "main";
    let script = "script";
    let expiration = new Date(17898129498);
    let payload = "payload";
    let tx = new phantasmaJS.Transaction(
      nexusName,
      chainName,
      script,
      expiration,
      payload
    );

    let wif = keys.toWIF();
    let pk = uint8ArrayToHex(keys.PrivateKey);

    tx.sign(wif);

    tx.signWithPrivateKey(pk);

    /*let wif = getWifFromPrivateKey(
      uint8ArrayToString(Array.from(keys.PrivateKey) as Uint8Array)
    );
    let pk = uint8ArrayToString(Array.from(keys.PrivateKey));

    console.log(wif, getAddressFromWif(wif), pk);

    tx.sign(pk);
    tx.SerializeData(writer);*/
    done();
  });

  test("Test signature ts and c#", function (done) {
    let nexusName = "testnet";
    let chainName = "main";
    let wif = "L5UEVHBjujaR1721aZM5Zm5ayjDyamMZS9W35RE9Y9giRkdf3dVx";
    let uintArray = Uint8Array.from([0x01, 0x02, 0x03]);
    let script = uint8ArrayToHex(uintArray);
    let time = new phantasmaJS.Timestamp(1234567890);
    let date = new Date(time.toString());
    let payload = "payload";
    let keys = phantasmaJS.PhantasmaKeys.fromWIF(wif);
    let tx = new phantasmaJS.Transaction(
      nexusName,
      chainName,
      script,
      date,
      payload
    );

    console.log(script);
    tx.signWithKeys(keys);

    let fromCsharp =
      "07746573746E6574046D61696E03010203D2029649077061796C6F61640101404C033859A20A4FC2E469B3741FB05ACEDFEC24BFE92E07633680488665D79F916773FF40D0E81C4468E1C1487E6E1E6EEFDA5C5D7C53C15C4FB349C2349A1802";
    let fromCsharpBytes = Buffer.Buffer.from(fromCsharp, "hex");
    let bytes = stringToUint8Array(fromCsharp);
    let fromCsharpTx = phantasmaJS.Transaction.Unserialize(fromCsharpBytes);

    console.log(tx.ToByteAray(true));
    expect(fromCsharpTx.chainName).toBe(tx.chainName);
    expect(fromCsharpTx.nexusName).toBe(tx.nexusName);
    expect(fromCsharpTx.script).toBe(tx.script);
    //expect(fromCsharpTx.payload).toBe(tx.payload);
    expect(fromCsharpTx.expiration).toStrictEqual(tx.expiration);
    expect(fromCsharpTx.signatures.length).toBe(tx.signatures.length);
    expect(fromCsharpTx.signatures[0].Kind).toBe(tx.signatures[0].Kind);
    expect(fromCsharpTx.signatures[0].ToByteArray()).toStrictEqual(
      tx.signatures[0].ToByteArray()
    );

    done();
  });
});
