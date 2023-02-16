const mindee = require("../dist");
const fs = require("fs");

// The API key can also be set by envvar: MINDEE_API_KEY
const mindeeClient = new mindee.Client({apiKey: "my-api-key"});

// parsing invoice from PDF
const pathDoc = mindeeClient.docFromPath("./documents/invoices/invoice.pdf");
pathDoc
  .parse(mindee.InvoiceV4)
  .then((res) => {
    console.log("Success!");
    console.log(res.pages);
    console.log(res.document);
    console.log(res.document.toString());
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
  .parse(mindee.InvoiceV4)
  .then((res) => {
    console.log("Success!");
    console.log(res.pages);
    console.log(res.document);
    console.log(res.document.toString());
  })
  .catch((err) => {
    console.error(err);
  });

// parsing invoice from multi-page PDF stream
const stream = fs.createReadStream("./documents/invoices/invoice_10p.pdf");
const streamDoc = mindeeClient.docFromStream(stream, "invoice_10p.pdf");
streamDoc
  .parse(mindee.InvoiceV4, {
    pageOptions: {
      operation: mindee.PageOptionsOperation.KeepOnly,
      pageIndexes: [0, -2, -1],
      onMinPages: 5,
    },
  })
  .then((res) => {
    console.log("Success!");
    console.log(res.pages);
    console.log(res.document);
    console.log(res.document.toString());
  })
  .catch((err) => {
    console.error(err);
  });
