const mindee = require("../dist");

// The API key can also be set by envvar: MINDEE_API_KEY
const mindeeClient = new mindee.Client({apiKey: "my-api-key"});

// parsing receipt from PDF, will return invoice info
invoiceDoc = mindeeClient.docFromPath("./documents/invoices/invoice.pdf");
invoiceDoc
  .parse(mindee.FinancialDocumentV1)
  .then((res) => {
    console.log("Success!");
    console.log(res.pages);
    console.log(res.document);
    console.log(res.document.toString());
  })
  .catch((err) => {
    console.error(err);
  });

// parsing receipt from image, will return receipt info
receiptDoc = mindeeClient.docFromPath("./documents/receipts/receipt.jpg");
receiptDoc
  .parse(mindee.FinancialDocumentV1)
  .then((res) => {
    console.log("Success!");
    console.log(res.pages);
    console.log(res.document);
    console.log(res.document.toString());
  })
  .catch((err) => {
    console.error(err);
  });
