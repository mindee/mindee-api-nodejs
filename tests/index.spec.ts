import { Client } from "../src";
import { expect } from "chai";

describe("Test client initialization", () => {
  it("should create an empty client", () => {
    const client = new Client({});
    expect(client).to.exist;
  });

  it("should create a client with an API key", () => {
    const client = new Client({ apiKey: "invalid-api-key" });
    expect(client).to.exist;
  });

  it("should create a client in debug mode", () => {
    const client = new Client({ debug: true });
    expect(client).to.exist;
  });
});
