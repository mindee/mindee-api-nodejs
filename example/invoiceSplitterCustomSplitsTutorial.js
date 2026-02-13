const { setTimeout } = require("node:timers/promises");
const mindee = require("mindee");

async function parseInvoicesWithCustomSplitsThreshold(inputPath, customSplits) {
  // fill in your API key or add it as an environment variable
  const mindeeClient = new mindee.v1.Client();

  // Load a file from disk
  const inputSource = new mindee.PathInput(
    { inputPath: inputPath }
  );

  let invoices = await mindee.v1.extraction.extractInvoices(inputSource, customSplits);
  for (const invoice of invoices) {
    // optional: save the documents locally
    invoice.saveToFile(`/tmp/invoice_p_${invoice.pageIdMin}-${invoice.pageIdMax}.pdf`);
    const respInvoice = await mindeeClient.parse(
      mindee.v1.product.InvoiceV4, invoice.asSource()
    );
    console.log(respInvoice.document.toString());
    // wait some time between requests as to not overload the server
    await setTimeout(1000);
  }
}

const customSplits = [[0, 1], [1, 2]];

parseInvoicesWithCustomSplitsThreshold(
  "/path/to/the/file.ext",
  customSplits
);
