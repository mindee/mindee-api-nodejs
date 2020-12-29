const https = require("https");
const { version: sdkVersion } = require("../../package.json");
const { URL } = require("url");
const FormData = require("form-data");

const request = (url, method, headers, input) => {
  return new Promise(function (resolve, reject) {
    const form = new FormData();
    const body = JSON.stringify({ file: input.fileObject });
    headers["User-Agent"] = `mindee-node/${sdkVersion} node/${process.version}`;

    if (input.inputType === "path") {
      const fileParams = { filename: input.filename };
      form.append("file", input.fileObject, fileParams);
      headers = { ...headers, ...form.getHeaders() };
    } else if (input.inputType === "base64") {
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = body.length;
    }

    const uri = new URL(url);
    const options = {
      method: method,
      headers: headers,
      hostname: uri.hostname,
      path: `${uri.pathname}${uri.search}`,
    };

    console.log(options);

    const req = https.request(options, function (res) {
      let responseBody = [];

      res.on("data", function (chunk) {
        responseBody += chunk;
      });

      res.on("end", function () {
        resolve({
          ...res,
          data: JSON.parse(responseBody),
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (input.inputType === "path") {
      form.pipe(req);
    }

    if (input.inputType === "base64") {
      req.write(body);
      req.end();
    }
  });
};

module.exports = request;
