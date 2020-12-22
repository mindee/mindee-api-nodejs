const https = require("https");
const { version: sdkVersion } = require("../../package.json");

const request = (url, method, headers, body) => {
  headers["User-Agent"] = `mindee-node/${sdkVersion} node/${process.version}`;
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      { method: method, headers: headers },
      (res) => {
        res.setEncoding("utf8");
        let responseBody = "";

        res.on("data", (chunk) => {
          responseBody += chunk;
        });

        res.on("end", () => {
          resolve({
            ...res,
            data: JSON.parse(responseBody),
          });
        });
      }
    );

    req.on("error", (err) => {
      reject(err);
    });

    req.write(body);
    req.end();
  });
};

module.exports = request;
