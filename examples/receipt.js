const { Client } = require("mindee");
const fs = require("fs");

// Receipt token can be set by Env (MINDEE_RECEIPT_TOKEN) or via params (Client({receiptToken: "token"}))
const mindeeClient = new Client();

// parsing receipt from picture
mindeeClient.receipt
  .parse({ input: "./documents/receipts/receipt.jpg" })
  .then((res) => {
    console.log("Success !");
    console.log(res.receipts);
    console.log(res.receipt);
  })
  .catch((err) => {
    console.error(err);
  });

// parsing receipt from base64 picture
const base64 = fs.readFileSync("./documents/receipts/receipt.jpg", {
  encoding: "base64",
});
mindeeClient.receipt
  .parse({ input: base64, inputType: "base64" })
  .then((res) => {
    console.log("Success !");
    console.log(res.receipts);
    console.log(res.receipt);
  })
  .catch((err) => {
    console.error(err);
  });

// parsing receipt from stream
const stream = fs.createReadStream("./documents/receipts/receipt.jpg");
mindeeClient.receipt
  .parse({ input: stream, inputType: "stream" })
  .then((res) => {
    console.log("Success !");
    console.log(res.receipts);
    console.log(res.receipt);
  })
  .catch((err) => {
    console.error(err);
  });
