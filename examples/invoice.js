const { Client } = require("mindee");
const fs = require("fs");

// Invoice token can be set by Env (MINDEE_INVOICE_TOKEN) or via params (Client({invoiceToken: "token"}))
const mindeeClient = new Client();

// parsing invoice from pdf
mindeeClient.invoice
  .parse("./documents/invoices/invoice.pdf")
  .then((res) => {
    console.log("Success !");
    console.log(res.invoices);
    console.log(res.invoice);
  })
  .catch((err) => {
    console.error(err);
  });

// // parsing invoice from multiple page pdf
mindeeClient.invoice
  .parse("./documents/invoices/invoice_6p.pdf")
  .then((res) => {
    console.log("Success !");
    console.log(res.invoices);
    console.log(res.invoice);
  })
  .catch((err) => {
    console.error(err);
  });

// parsing invoice from base64 file
const base64 = fs.readFileSync("./documents/invoices/invoice.pdf", {
  encoding: "base64",
});
mindeeClient.invoice
  .parse(base64, "base64")
  .then((res) => {
    console.log("Success !");
    console.log(res.invoices);
    console.log(res.invoice);
  })
  .catch((err) => {
    console.error(err);
  });

// parsing invoice from stream
const stream = fs.createReadStream("./documents/invoices/invoice.pdf");
mindeeClient.invoice
  .parse(stream, "stream")
  .then((res) => {
    console.log("Success !");
    console.log(res.invoices);
    console.log(res.invoice);
  })
  .catch((err) => {
    console.error(err);
  });
