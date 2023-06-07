const mindee = require("../dist");
const fs = require("fs");

// The API key can also be set by envvar: MINDEE_API_KEY
const mindeeClient = new mindee.Client({apiKey: "my-api-key"});

// parsing receipt from image
const pathDoc = mindeeClient.docFromPath("./documents/receipts/receipt.jpg");
pathDoc
  .parse(mindee.product.ReceiptV4)
  .then((res) => {
    console.log("Success!");
    console.log(res.pages);
    console.log(res.document);
    console.log(res.document.toString());
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
  .parse(mindee.product.ReceiptV4)
  .then((res) => {
    console.log("Success!");
    console.log(res.pages);
    console.log(res.document);
    console.log(res.document.toString());
  })
  .catch((err) => {
    console.error(err);
  });

// parsing receipt from stream
const stream = fs.createReadStream("./documents/receipts/receipt.jpg");
const streamDoc = mindeeClient.docFromStream(stream, "receipt.jpg");
streamDoc
  .parse(mindee.product.ReceiptV4)
  .then((res) => {
    console.log("Success!");
    console.log(res.pages);
    console.log(res.document);
    console.log(res.document.toString());
  })
  .catch((err) => {
    console.error(err);
  });
