import { phantasmaJS } from "..";
import crypto from "crypto";

describe("Utils", () => {
  test("Get a new address", () => {
    let key = phantasmaJS.generateNewWif();
    let address = phantasmaJS.getAddressFromWif(key);
    console.log(address);
  });
});
