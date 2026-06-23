import path from "path";
import assert from "node:assert/strict";
import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import { MockAgent, setGlobalDispatcher } from "undici";
import fs from "node:fs/promises";

import { buildCli } from "@/cli/index.js";
import { V2_RESOURCE_PATH } from "../index.js";

const mockAgent = new MockAgent();
setGlobalDispatcher(mockAgent);
const mockPool = mockAgent.get("https://v2-cli-host");

interface CapturedConsole {
  stdout: string[];
  restore(): void;
  text(): string;
}

function captureConsole(): CapturedConsole {
  const stdout: string[] = [];
  const orig = console.log;
  console.log = (...args: unknown[]) => {
    stdout.push(args.map(String).join(" "));
  };
  return {
    stdout,
    restore() {
      console.log = orig;
    },
    text() {
      return stdout.join("\n");
    },
  };
}

describe("Mindee CLI - end-to-end with mocked HTTP", () => {
  before(() => {
    process.env.MINDEE_V2_API_KEY = "dummy";
    process.env.MINDEE_V2_API_HOST = "v2-cli-host";
    process.env.MINDEE_API_KEY = "dummy-v1";
  });

  after(() => {
    delete process.env.MINDEE_V2_API_KEY;
    delete process.env.MINDEE_V2_API_HOST;
    delete process.env.MINDEE_API_KEY;
  });

  let capture: CapturedConsole;
  beforeEach(() => {
    capture = captureConsole();
  });
  afterEach(() => {
    capture.restore();
  });

  describe("search-models", () => {
    it("renders the human summary by default", async () => {
      mockPool
        .intercept({ path: /\/v2\/search\/models/, method: "GET" })
        .reply(
          200,
          await fs.readFile(path.join(V2_RESOURCE_PATH, "search/models.json"), { encoding: "utf-8" })
        );

      const program = buildCli();
      await program.parseAsync(
        ["search-models", "--api-key", "dummy"],
        { from: "user" }
      );

      const output = capture.text();
      assert.match(output, /Models\n######\n/);
      assert.match(output, /:Name: Extraction With Webhooks/);
      assert.match(output, /Pagination Metadata\n###################\n/);
    });

    it("renders raw JSON when --raw-json is passed", async () => {
      mockPool
        .intercept({ path: /\/v2\/search\/models/, method: "GET" })
        .reply(
          200,
          await fs.readFile(path.join(V2_RESOURCE_PATH, "search/models.json"), { encoding: "utf-8" })
        );

      const program = buildCli();
      await program.parseAsync(
        ["search-models", "--api-key", "dummy", "--raw-json"],
        { from: "user" }
      );

      const output = capture.text();
      const parsed = JSON.parse(output);
      assert.ok(Array.isArray(parsed.models));
      assert.strictEqual(parsed.models.length, 5);
    });

    it("forwards --name and --model-type as query parameters", async () => {
      mockPool
        .intercept({
          path: "/v2/search/models?name=invoice&model_type=extraction",
          method: "GET",
        })
        .reply(
          200,
          JSON.parse('{"models":[],"pagination":{"per_page":50,"page":1,"total_items":0,"total_pages":0}}')
        );

      const program = buildCli();
      await program.parseAsync(
        ["search-models",
          "--api-key", "dummy",
          "--name", "invoice",
          "--model-type", "extraction"],
        { from: "user" }
      );

      const output = capture.text();
      assert.match(output, /Pagination Metadata/);
    });
  });
});
