import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { IncomingMessage } from "http";
import { Socket } from "net";
import { MindeeHttpError, MindeeHttpError400, MindeeHttpError401, MindeeHttpError429, MindeeHttpError500, handleError } from "../../src/http/error";
import { EndpointResponse } from "../../src/http/endpoint"

const dataPath = {
  error400: "tests/data/errors/error_400_from_mindeeapi_with_object_response_in_detail.json",
  error401: "tests/data/errors/error_401_from_mindeeapi.json",
  error429: "tests/data/errors/error_429_from_mindeeapi.json",
  error500: "tests/data/errors/error_500_from_mindeeapi.json",
  error50xhtml: "tests/data/errors/error_50x.html",
}

describe("A 400 HTTP error", async () => {
  it("should send a MindeeHttp400 response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.error400));
    const message = new IncomingMessage(new Socket());
    message.method = 'POST';
    const dummyEndpointResponse: EndpointResponse = {
      messageObj: message,
      data: JSON.parse(jsonData.toString()),
    };
    expect(() => handleError("dummy_url", dummyEndpointResponse, 400)).to.throw(MindeeHttpError400);
  });
});

describe("A 401 HTTP error", async () => {
  it("should send a MindeeHttp401 response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.error401));
    const message = new IncomingMessage(new Socket());
    message.method = 'POST';
    const dummyEndpointResponse: EndpointResponse = {
      messageObj: message,
      data: JSON.parse(jsonData.toString()),
    };
    expect(() => handleError("dummy_url", dummyEndpointResponse, 401)).to.throw(MindeeHttpError401);
  });
});

describe("A 429 HTTP error", async () => {
  it("should send a MindeeHttp429 response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.error429));
    const message = new IncomingMessage(new Socket());
    message.method = 'POST';
    const dummyEndpointResponse: EndpointResponse = {
      messageObj: message,
      data: JSON.parse(jsonData.toString()),
    };
    expect(() => handleError("dummy_url", dummyEndpointResponse, 429)).to.throw(MindeeHttpError429);
  });
});

describe("A 500 HTTP error", async () => {
  it("should send a MindeeHttp500 response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.error500));
    const message = new IncomingMessage(new Socket());
    message.method = 'POST';
    const dummyEndpointResponse: EndpointResponse = {
      messageObj: message,
      data: JSON.parse(jsonData.toString()),
    };
    expect(() => handleError("dummy_url", dummyEndpointResponse, 500)).to.throw(MindeeHttpError500);
  });
});

describe("A known 50x HTTP error", async () => {
  it("should send a corresponding MindeeHttp response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.error50xhtml));
    const message = new IncomingMessage(new Socket());
    message.method = 'POST';
    const dummyEndpointResponse: EndpointResponse = {
      messageObj: message,
      data: { reconstructed_response: jsonData.toString() },
    };
    expect(() => handleError("dummy_url", dummyEndpointResponse, 500)).to.throw(MindeeHttpError500);
  });
});