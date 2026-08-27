import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { Agent, Dispatcher, getGlobalDispatcher, setGlobalDispatcher } from "undici";
import { BaseSettings } from "@/http/baseSettings.js";
import { UrlInput } from "@/input/index.js";

class TestSettings extends BaseSettings {
  constructor(dispatcher?: Dispatcher) {
    super("dummy-key", dispatcher);
  }
  protected apiKeyFromEnv(): string {
    return "dummy-key";
  }
  protected hostnameFromEnv(): string {
    return "test-host";
  }
}

describe("BaseSettings – dispatcher resolution", () => {
  const originalDispatcher = getGlobalDispatcher();

  afterEach(() => {
    setGlobalDispatcher(originalDispatcher);
  });

  it("uses an explicitly provided dispatcher as-is", () => {
    const agent = new Agent();
    const settings = new TestSettings(agent);
    assert.strictEqual(settings.dispatcher, agent);
  });

  it("uses the global dispatcher when it comes from the same undici copy", () => {
    const agent = new Agent();
    setGlobalDispatcher(agent);
    const settings = new TestSettings();
    assert.strictEqual(settings.dispatcher, agent);
  });

  it("ignores a global dispatcher from a foreign undici instance", () => {
    // Simulates Node's built-in fetch (or another undici copy) having
    // registered its dispatcher on the shared global symbol: such objects are
    // not instances of this library's undici Dispatcher class.
    const foreignDispatcher = { dispatch: () => true } as unknown as Agent;
    setGlobalDispatcher(foreignDispatcher);
    const settings = new TestSettings();
    assert.notStrictEqual(settings.dispatcher, foreignDispatcher);
    assert.ok(settings.dispatcher instanceof Dispatcher);
  });

  it("reuses the same fallback dispatcher across instances", () => {
    const foreignDispatcher = { dispatch: () => true } as unknown as Agent;
    setGlobalDispatcher(foreignDispatcher);
    const first = new TestSettings();
    const second = new TestSettings();
    assert.strictEqual(first.dispatcher, second.dispatcher);
  });

  it("UrlInput ignores a foreign global dispatcher as well", () => {
    const foreignDispatcher = { dispatch: () => true } as unknown as Agent;
    setGlobalDispatcher(foreignDispatcher);
    const input = new UrlInput({ url: "https://example.com/file.pdf" });
    assert.notStrictEqual(input.dispatcher, foreignDispatcher);
    assert.ok(input.dispatcher instanceof Dispatcher);
  });

  it("UrlInput uses an explicitly provided dispatcher as-is", () => {
    const agent = new Agent();
    const input = new UrlInput({ url: "https://example.com/file.pdf", dispatcher: agent });
    assert.strictEqual(input.dispatcher, agent);
  });
});
