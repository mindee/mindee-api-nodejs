const { Client } = require("src");
const fs = require("fs");

const mindeeClient = new Client();

// Receipt API key can also be set by envvar: MINDEE_RECEIPT_API_KEY
mindeeClient.configReceipt("my-receipt-api-key");

// parsing receipt from image
const pathDoc = mindeeClient.docFromPath("./documents/receipts/receipt.jpg");
pathDoc
  .parse("receipt")
  .then((res) => {
    console.log("Success!");
    console.log(res.pages);
    console.log(res.document);
  })
  .catch((err) => {
    console.error(err);
  });

// parsing receipt from base64-encoded image
const base64 = fs.readFileSync("./documents/receipts/receipt.jpg", {
  encoding: "base64",
});
const base64Doc = mindeeClient.docFromBase64(base64.toString(), "receipt.jpg");
base64Doc
  .parse("receipt")
  .then((res) => {
    console.log("Success!");
      console.log(res.pages);
      console.log(res.document);
  })
  .catch((err) => {
    console.error(err);
  });

// parsing receipt from stream
const stream = fs.createReadStream("./documents/receipts/receipt.jpg");
const streamDoc = mindeeClient.docFromStream(stream, "receipt.jpg");
streamDoc
  .parse("receipt")
  .then((res) => {
    console.log("Success !");
      console.log(res.pages);
      console.log(res.document);
  })
  .catch((err) => {
    console.error(err);
  });
