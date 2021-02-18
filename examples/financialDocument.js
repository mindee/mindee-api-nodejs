const { Client } = require("mindee");

// Receipt token can be set by Env (MINDEE_RECEIPT_TOKEN) or via params (Client({receiptToken: "token"}))
const mindeeClient = new Client();

// parsing receipt from picture
mindeeClient.financialDocument
  .parse({ input: "./documents/receipts/receipt.jpg" })
  .then((res) => {
    console.log("Success !");
    console.log(res.financialDocuments);
    console.log(res.financialDocument);
  })
  .catch((err) => {
    console.error(err);
  });

// parsing receipt from base64 picture
const fs = require("fs");
const base64 = fs.readFileSync("./documents/receipts/receipt.jpg", {
  encoding: "base64",
});
mindeeClient.financialDocument
  .parse({ input: base64, inputType: "base64" })
  .then((res) => {
    console.log("Success !");
    console.log(res.financialDocuments);
    console.log(res.financialDocument);
  })
  .catch((err) => {
    console.error(err);
  });
