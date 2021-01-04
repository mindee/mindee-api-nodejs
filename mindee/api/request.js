const https = require("https");
const { version: sdkVersion } = require("../../package.json");
const { URL } = require("url");
const FormData = require("form-data");

const request = (url, method, headers, input) => {
  return new Promise(function (resolve, reject) {
    const form = new FormData();
    const fileParams = { filename: input.filename };
    form.append("file", input.fileObject, fileParams);

    headers["User-Agent"] = `mindee-node/${sdkVersion} node/${process.version}`;
    headers = { ...headers, ...form.getHeaders() };
    const uri = new URL(url);
    const options = {
      method: method,
      headers: headers,
      hostname: uri.hostname,
      path: `${uri.pathname}${uri.search}`,
    };

    const req = https.request(options);

    form.pipe(req);

    req.on("response", function (res) {
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
  });
};

module.exports = request;
