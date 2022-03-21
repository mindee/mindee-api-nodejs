import { Client } from "@mindee/index";
import { expect } from "chai";

describe("Test client initialization", () => {
  it("should create a client", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const client = new Client();
    expect(client).to.exist;
  });
});
