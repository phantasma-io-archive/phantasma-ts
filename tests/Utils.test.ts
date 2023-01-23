import { phantasmaJS } from "..";
import crypto from "crypto";
import {
  Address,
  ConsensusMode,
  encodeBase16,
  PhantasmaKeys,
  PollChoice,
  Serialization,
  Timestamp,
  VMObject,
} from "../core";
import { Base16 } from "../src/core/types/Extensions/Base16";

describe("Utils", () => {
  test("Get a new address", () => {
    let key = phantasmaJS.generateNewWif();
    let address = phantasmaJS.getAddressFromWif(key);
  });

  test("Get a new address from private key", () => {
    let key = phantasmaJS.generateNewWif();
    let address = phantasmaJS.getAddressFromWif(key);
    let privateKey = phantasmaJS.getPrivateKeyFromWif(key);

    let wifFromPK = phantasmaJS.getWifFromPrivateKey(privateKey);
    let addressFromPK = phantasmaJS.getAddressFromWif(wifFromPK);
    expect(address).toBe(addressFromPK);
  });

  test("Get a new address from private key", () => {
    let key = PhantasmaKeys.generate();
    let address = key.Address;

    expect(address).toBeInstanceOf(Address);
  });

  test("test phantasma-ts.Base16.decode", function (done) {
    let result = Base16.decode("54657374206d657373616765");
    expect(result).toBe("Test message");
    done();
  });
});
