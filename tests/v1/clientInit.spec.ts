import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Client } from "@/v1/index.js";
import { MindeeError } from "@/errors/index.js";

describe("Test client initialization", () => {
  it("should not create a client without an API key", () => {
    delete process.env.MINDEE_API_KEY;
    assert.throws(
      () => {
        new Client({});
      },
      MindeeError
    );
  });

  it("should create a client with an API key", () => {
    const client = new Client({ apiKey: "invalid-api-key" });
    assert.ok(client);
  });

  it("should create a client in debug mode", () => {
    const client = new Client({ apiKey: "invalid-api-key", debug: true });
    assert.ok(client);
  });
});
