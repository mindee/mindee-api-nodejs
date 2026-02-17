import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PollingOptions } from "@/v2/client/index.js";
import { MindeeConfigurationError } from "@/errors/index.js";

describe("MindeeV2 - Polling Options", () => {

  it("should provide sensible defaults", () => {
    const pollingOptions1 = new PollingOptions();
    assert.strictEqual(pollingOptions1.delaySec, 1.5);
    assert.strictEqual(pollingOptions1.initialDelaySec, 2);
    assert.strictEqual(pollingOptions1.maxRetries, 80);

    const pollingOptions2 = new PollingOptions({});
    assert.strictEqual(pollingOptions2.delaySec, 1.5);
    assert.strictEqual(pollingOptions2.initialDelaySec, 2);
    assert.strictEqual(pollingOptions2.maxRetries, 80);
  });

  it("should allow custom values", () => {
    const pollingOptions = new PollingOptions({
      delaySec: 2,
      initialDelaySec: 5,
      maxRetries: 90,
    });
    assert.strictEqual(pollingOptions.delaySec, 2);
    assert.strictEqual(pollingOptions.initialDelaySec, 5);
    assert.strictEqual(pollingOptions.maxRetries, 90);
  });

  it("should disallow ridiculous values", () => {
    assert.throws(
      () => {
        new PollingOptions({ delaySec: 0.01 });
      },
      MindeeConfigurationError
    );
    assert.throws(
      () => {
        new PollingOptions({ initialDelaySec: 0.01 });
      },
      MindeeConfigurationError
    );
    assert.throws(
      () => {
        new PollingOptions({ maxRetries: 1 });
      },
      MindeeConfigurationError
    );
  });
});
