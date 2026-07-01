import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MockAgent } from "undici";
import { sendRequestAndReadResponse, RequestOptions } from "@/http/apiCore.js";

const HOST = "api-core-host";
const PATH = "/endiiiiives/will/always/love/you";
const SUCCESS_BODY = JSON.stringify({ result: "ok" });

const BASE_OPTIONS: RequestOptions = {
  hostname: HOST,
  path: PATH,
  method: "GET",
  headers: {},
  timeoutSecs: 10,
};

function socketError(code: string): Error {
  return Object.assign(new Error("socket closed"), { code });
}

type Interceptor =
  | { error: Error }
  | { statusCode: number; body: string };

function makeAgent(...interceptors: Interceptor[]): MockAgent {
  const mockAgent = new MockAgent();
  const pool = mockAgent.get(`https://${HOST}`);
  for (const interceptor of interceptors) {
    const mock = pool.intercept({ path: PATH, method: "GET" });
    if ("error" in interceptor) {
      mock.replyWithError(interceptor.error);
    } else {
      mock.reply(interceptor.statusCode, interceptor.body);
    }
  }
  return mockAgent;
}

async function sendRequest(agent: MockAgent): Promise<any> {
  return sendRequestAndReadResponse(agent, BASE_OPTIONS);
}

describe("sendRequestAndReadResponse – retry logic", () => {

  it("succeeds on first attempt when no error", async () => {
    const agent = makeAgent({ statusCode: 200, body: SUCCESS_BODY });
    const result = await sendRequest(agent);
    assert.deepStrictEqual(result.data, { result: "ok" });
  });

  it("retries once on UND_ERR_SOCKET and returns the retry response", async () => {
    const agent = makeAgent(
      { error: socketError("UND_ERR_SOCKET") },
      { statusCode: 200, body: SUCCESS_BODY }
    );
    const result = await sendRequest(agent);
    assert.deepStrictEqual(result.data, { result: "ok" });
  });

  it("retries once on ECONNRESET and returns the retry response", async () => {
    const agent = makeAgent(
      { error: socketError("ECONNRESET") },
      { statusCode: 200, body: SUCCESS_BODY }
    );
    const result = await sendRequest(agent);
    assert.deepStrictEqual(result.data, { result: "ok" });
  });

  it("retries once on UND_ERR_CONNECT_TIMEOUT and returns the retry response", async () => {
    const agent = makeAgent(
      { error: socketError("UND_ERR_CONNECT_TIMEOUT") },
      { statusCode: 200, body: SUCCESS_BODY }
    );
    const result = await sendRequest(agent);
    assert.deepStrictEqual(result.data, { result: "ok" });
  });

  it("propagates the error when the retry also fails", async () => {
    const agent = makeAgent(
      { error: socketError("UND_ERR_SOCKET") },
      { error: socketError("UND_ERR_SOCKET") }
    );
    await assert.rejects(
      sendRequest(agent),
      (err: any) => {
        assert.strictEqual(err.code, "UND_ERR_SOCKET");
        return true;
      }
    );
  });

  it("does not retry on unrelated errors and propagates immediately", async () => {
    const agent = makeAgent(
      { error: Object.assign(new Error("connection refused"), { code: "ECONNREFUSED" }) }
    );
    await assert.rejects(
      sendRequest(agent),
      (err: any) => {
        assert.strictEqual(err.code, "ECONNREFUSED");
        return true;
      }
    );
  });

});
