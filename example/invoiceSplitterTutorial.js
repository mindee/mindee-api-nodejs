const { Client, product, imageOperations, PathInput } = require("mindee");
const { setTimeout } = require("node:timers/promises");

async function parseInvoices() {
  // fill in your API key or add it as an environment variable
  const mindeeClient = new Client();

  // Load a file from disk
  const inputSource = new PathInput(
    { inputPath: "/path/to/the/file.ext" }
  );

  const resp = await mindeeClient.enqueueAndParse(
    product.InvoiceSplitterV1, inputSource
  );
  let invoices = await imageOperations.extractInvoices(inputSource, resp.document.inference);
  for (const invoice of invoices) {
    // optional: save the documents locally
    invoice.saveToFile(`/tmp/invoice_p_${invoice.pageIdMin}-${invoice.pageIdMax}.pdf`);
    const respInvoice = await mindeeClient.parse(product.InvoiceV4, invoice.asSource());
    console.log(respInvoice.document.toString());
    await setTimeout(1000); // wait some time between requests as to not overload the server
  }

}

parseInvoices();
