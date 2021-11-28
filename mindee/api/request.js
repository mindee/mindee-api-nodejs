const https = require("https");
const { version: sdkVersion } = require("../../package.json");
const { URL } = require("url");
const FormData = require("form-data");

const request = (url, method, headers, input, includeWords = false) => {
  return new Promise(function (resolve, reject) {
    const form = new FormData();
    let body;
    headers["User-Agent"] = `mindee-node/${sdkVersion} node/${process.version}`;

    if (["path", "stream"].includes(input.inputType)) {
      const fileParams = { filename: input.filename };
      form.append("file", input.fileObject, fileParams);
      if (includeWords) form.append("include_mvision", "true");
      headers = { ...headers, ...form.getHeaders() };
    } else if (input.inputType === "base64") {
      let body_obj = { file: input.fileObject };
      if (includeWords) body_obj["include_mvision"] = "true";
      body = JSON.stringify(body_obj);
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

    const req = https.request(options, function (res) {
      let responseBody = [];

      res.on("data", function (chunk) {
        responseBody += chunk;
      });

      res.on("end", function () {
        try {
          resolve({
            ...res,
            data: JSON.parse(responseBody),
          });
        } catch (error) {
          console.log(responseBody);
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (["path", "stream"].includes(input.inputType)) {
      form.pipe(req);
    }

    if (input.inputType === "base64") {
      req.write(body);
      req.end();
    }
  });
};

module.exports = request;
