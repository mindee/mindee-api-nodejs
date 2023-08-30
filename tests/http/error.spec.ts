import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { IncomingMessage } from "http";
import { Socket } from "net";
import { MindeeHttpError, MindeeHttp400Error, MindeeHttp401Error, MindeeHttp429Error, MindeeHttp500Error, handleError } from "../../src/http/error";
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
    expect(() => handleError("dummy_url", dummyEndpointResponse, 400)).to.throw(MindeeHttp400Error);
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
    expect(() => handleError("dummy_url", dummyEndpointResponse, 401)).to.throw(MindeeHttp401Error);
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
    expect(() => handleError("dummy_url", dummyEndpointResponse, 429)).to.throw(MindeeHttp429Error);
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
    expect(() => handleError("dummy_url", dummyEndpointResponse, 500)).to.throw(MindeeHttp500Error);
  });
});

describe("A known 50x HTTP error", async () => {
  it("should send a corresponding MindeeHttp response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.error50xhtml));
    const message = new IncomingMessage(new Socket());
    message.method = 'POST';
    const dummyEndpointResponse: EndpointResponse = {
      messageObj: message,
      data: { reconstructedResponse: jsonData.toString() },
    };
    expect(() => handleError("dummy_url", dummyEndpointResponse, 503)).to.throw(MindeeHttpError);
    expect(() => handleError("dummy_url", dummyEndpointResponse, 503)).to.not.throw(MindeeHttp500Error);
  });
});
