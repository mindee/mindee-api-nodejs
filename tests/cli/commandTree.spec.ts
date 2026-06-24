import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildCli } from "@/cli/index.js";

/**
 * Structural / help-text checks for the unified `mindee` CLI.
 *
 * These tests exercise the command tree built by `buildCli()` without
 * actually invoking the network — they validate the CLI surface alone.
 */
describe("Mindee CLI - command tree", () => {
  it("registers all V2 top-level commands plus the `v1` group", () => {
    const program = buildCli();
    const names = program.commands.map(c => c.name()).sort();
    assert.deepStrictEqual(names, [
      "classification",
      "crop",
      "extraction",
      "ocr",
      "search-models",
      "split",
      "v1",
    ]);
  });

  it("registers all V1 product subcommands under `v1`", () => {
    const program = buildCli();
    const v1 = program.commands.find(c => c.name() === "v1");
    assert.ok(v1, "v1 group should exist");
    const v1Names = v1.commands.map(c => c.name()).sort();
    assert.deepStrictEqual(v1Names, [
      "barcode-reader",
      "cropper",
      "driver-license",
      "financial-document",
      "fr-bank-account-details",
      "fr-carte-grise",
      "fr-carte-nationale-d-identite",
      "generated",
      "international-id",
      "invoice",
      "invoice-splitter",
      "multi-receipts-detector",
      "passport",
      "receipt",
      "resume",
      "us-bank-check",
    ]);
  });

  it("exposes a top-level `--verbose` option", () => {
    const program = buildCli();
    const optionNames = program.options.map(o => o.long);
    assert.ok(optionNames.includes("--verbose"));
  });

  describe("extraction command", () => {
    it("exposes the canonical V2 inference options", () => {
      const program = buildCli();
      const extraction = program.commands.find(c => c.name() === "extraction");
      assert.ok(extraction);
      const longs = extraction.options.map(o => o.long);
      for (const expected of [
        "--api-key",
        "--model-id",
        "--alias",
        "--rag",
        "--raw-text",
        "--confidence",
        "--polygon",
        "--text-context",
        "--output",
      ]) {
        assert.ok(longs.includes(expected), `extraction must expose ${expected}`);
      }
    });

    it("requires `--model-id`", () => {
      const program = buildCli();
      const extraction = program.commands.find(c => c.name() === "extraction");
      assert.ok(extraction);
      const modelId = extraction.options.find(o => o.long === "--model-id");
      assert.ok(modelId);
      assert.strictEqual(modelId.required, true);
    });
  });

  describe("non-extraction V2 commands", () => {
    for (const name of ["classification", "crop", "ocr", "split"]) {
      it(`${name} does not expose extraction-only flags`, () => {
        const program = buildCli();
        const cmd = program.commands.find(c => c.name() === name);
        assert.ok(cmd);
        const longs = cmd.options.map(o => o.long);
        for (const flag of ["--rag", "--raw-text", "--confidence", "--polygon", "--text-context"]) {
          assert.ok(!longs.includes(flag), `${name} must NOT expose ${flag}`);
        }
        assert.ok(longs.includes("--model-id"));
        assert.ok(longs.includes("--output"));
      });
    }
  });

  describe("search-models command", () => {
    it("exposes the canonical flags", () => {
      const program = buildCli();
      const search = program.commands.find(c => c.name() === "search-models");
      assert.ok(search);
      const longs = search.options.map(o => o.long).sort();
      assert.deepStrictEqual(longs, [
        "--api-key",
        "--model-type",
        "--name",
        "--raw-json",
      ]);
    });

    it("does not take a path argument", () => {
      const program = buildCli();
      const search = program.commands.find(c => c.name() === "search-models");
      assert.ok(search);
      assert.strictEqual(search.registeredArguments.length, 0);
    });
  });

  describe("V1 commands", () => {
    function v1(name: string) {
      const program = buildCli();
      const group = program.commands.find(c => c.name() === "v1");
      assert.ok(group);
      const cmd = group.commands.find(c => c.name() === name);
      assert.ok(cmd, `v1 ${name} should exist`);
      return cmd;
    }

    it("invoice exposes all-words, full-text and async flags", () => {
      const longs = v1("invoice").options.map(o => o.long);
      for (const flag of ["--api-key", "--all-words", "--full-text", "--async", "--output"]) {
        assert.ok(longs.includes(flag), `invoice must expose ${flag}`);
      }
    });

    it("barcode-reader is sync-only and does not expose --async or --all-words", () => {
      const longs = v1("barcode-reader").options.map(o => o.long);
      assert.ok(!longs.includes("--async"));
      assert.ok(!longs.includes("--all-words"));
      assert.ok(!longs.includes("--full-text"));
      assert.ok(longs.includes("--output"));
    });

    it("driver-license is async-only", () => {
      const longs = v1("driver-license").options.map(o => o.long);
      assert.ok(!longs.includes("--async"));
    });

    it("generated requires endpoint and account", () => {
      const cmd = v1("generated");
      const endpoint = cmd.options.find(o => o.long === "--endpoint");
      const account = cmd.options.find(o => o.long === "--account");
      assert.ok(endpoint);
      assert.ok(account);
      assert.strictEqual(endpoint.required, true);
      assert.strictEqual(account.required, true);
    });
  });
});
