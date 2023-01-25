import { PhantasmaKeys } from "../../core";

describe("test Addresses", function () {
  test("test address", function (done) {
    let wif = "L5UEVHBjujaR1721aZM5Zm5ayjDyamMZS9W35RE9Y9giRkdf3dVx";
    let keys = PhantasmaKeys.fromWIF(wif);
    let address = keys.Address;

    expect(address.Text).toBe(
      "P2KFEyFevpQfSaW8G4VjSmhWUZXR4QrG9YQR1HbMpTUCpCL"
    );

    done();
  });
});
