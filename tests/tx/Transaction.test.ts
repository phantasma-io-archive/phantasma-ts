import { phantasmaJS } from "../..";
import Buffer from "Buffer";
import crypto from "crypto";
import { PhantasmaKeys } from "../../core";

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
});
