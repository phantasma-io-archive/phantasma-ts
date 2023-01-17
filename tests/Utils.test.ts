import { phantasmaJS } from "..";
import crypto from "crypto";

describe("Utils", () => {
  test("Get a new address", () => {
    let key = phantasmaJS.generateNewWif();
    let address = phantasmaJS.getAddressFromWif(key);
    console.log(address);
  });

  test("Get a new address from private key", () => {
    let key = phantasmaJS.generateNewWif();
    let address = phantasmaJS.getAddressFromWif(key);
    let privateKey = phantasmaJS.getPrivateKeyFromWif(key);

    let wifFromPK = phantasmaJS.getWifFromPrivateKey(privateKey);
    let addressFromPK = phantasmaJS.getAddressFromWif(wifFromPK);
    expect(address).toBe(addressFromPK);
  });
});
