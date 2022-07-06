const { Client } = require("src");

const mindeeClient = new Client();

// parsing receipt from PDF, will return invoice info
invoiceDoc = mindeeClient.docFromPath("./documents/invoices/invoice.pdf");
invoiceDoc
  .parse("financialDoc")
  .then((res) => {
    console.log("Success!");
    console.log(res.pages);
    console.log(res.document);
  })
  .catch((err) => {
    console.error(err);
  });

// parsing receipt from base64 image, will return receipt info
receiptDoc = mindeeClient.docFromPath("./documents/receipts/receipt.jpg");
receiptDoc
  .parse("financialDoc")
  .then((res) => {
    console.log("Success!");
    console.log(res.pages);
    console.log(res.document);
  })
  .catch((err) => {
    console.error(err);
  });
