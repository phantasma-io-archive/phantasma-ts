import { phantasmaJS } from "../..";
import Buffer from "Buffer";
import crypto from "crypto";
import {
  getAddressFromWif,
  getWifFromPrivateKey,
  PhantasmaKeys,
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
});
