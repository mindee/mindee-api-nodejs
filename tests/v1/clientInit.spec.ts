import { Client } from "@/v1/index.js";
import { expect } from "chai";
import assert from "node:assert/strict";

describe("Test client initialization", () => {
  it("should not create an empty client", () => {
    assert.throws(
      () => {
        new Client({});
      }
    );
  });

  it("should create a client with an API key", () => {
    const client = new Client({ apiKey: "invalid-api-key" });
    expect(client).to.exist;
  });

  it("should create a client in debug mode", () => {
    const client = new Client({ apiKey: "invalid-api-key", debug: true });
    expect(client).to.exist;
  });
});
