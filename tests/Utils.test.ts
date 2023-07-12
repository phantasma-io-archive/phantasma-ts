import {  } from "..";
import crypto from "crypto";
import {
  Address,
  ConsensusMode,
  encodeBase16,
  generateNewWif,
  getAddressFromWif,
  getPrivateKeyFromWif,
  getWifFromPrivateKey,
  PhantasmaKeys,
  PollChoice,
  Serialization,
  Timestamp,
  VMObject,
} from "../core";
import { Base16 } from "../src/core/types/Extensions/Base16";

describe("Utils", () => {
  test("Get a new address", () => {
    let key = generateNewWif();
    let address = getAddressFromWif(key);
  });

  test("Get a new address from private key", () => {
    let key = generateNewWif();
    let address = getAddressFromWif(key);
    let privateKey = getPrivateKeyFromWif(key);

    let wifFromPK = getWifFromPrivateKey(privateKey);
    let addressFromPK = getAddressFromWif(wifFromPK);
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
