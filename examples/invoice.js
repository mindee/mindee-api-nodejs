const { Client } = require("mindee");

// Receipt token can be set by Env (MINDEE_INVOICE_TOKEN) or via params (Client({invoiceToken: "token"}))
const mindeeClient = new Client();

// parsing receipt from picture
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
