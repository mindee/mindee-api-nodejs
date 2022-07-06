const { Client } = require("src");
const fs = require("fs");

const mindeeClient = new Client();

// Receipt API key can also be set by envvar: MINDEE_INVOICE_API_KEY
mindeeClient.configInvoice("my-receipt-api-key");

// parsing invoice from PDF
const pathDoc = mindeeClient.docFromPath("./documents/invoices/invoice.pdf");
pathDoc
  .parse("invoice")
  .then((res) => {
    console.log("Success!");
    console.log(res.pages);
    console.log(res.document);
    console.log(res.documentType);
  })
  .catch((err) => {
    console.error(err);
  });

// parsing invoice from base64-encoded credit note
const base64 = fs.readFileSync("./documents/invoices/credit_note.pdf", {
  encoding: "base64",
});
const base64Doc = mindeeClient.docFromBase64(base64.toString(), "credit_note.pdf");
base64Doc
  .parse("invoice")
  .then((res) => {
    console.log("Success!");
    console.log(res.documentType);
    console.log(res.pages);
    console.log(res.document);
  })
  .catch((err) => {
    console.error(err);
  });

// parsing invoice from multi-page PDF stream
const stream = fs.createReadStream("./documents/invoices/invoice_10p.pdf");
const streamDoc = mindeeClient.docFromStream(stream, "receipt.jpg");
streamDoc
  .parse("invoice")
  .then((res) => {
    console.log("Success!");
    console.log(res.documentType);
    console.log(res.pages);
    console.log(res.document);
  })
  .catch((err) => {
    console.error(err);
  });
