const { Client } = require("mindee");
const fs = require("fs");

// Receipt token can be set by Env (MINDEE_RECEIPT_TOKEN) or via params (Client({receiptToken: "token"}))
const mindeeClient = new Client();

// parsing receipt from picture
mindeeClient.receipt
  .parse("./documents/receipts/receipt.jpg")
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
  .parse(base64, "base64")
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
  .parse(stream, "stream")
  .then((res) => {
    console.log("Success !");
    console.log(res.receipts);
    console.log(res.receipt);
  })
  .catch((err) => {
    console.error(err);
  });
