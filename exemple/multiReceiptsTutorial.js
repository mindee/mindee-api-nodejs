const { Client, product, imageOperations } = require("./../dist/src");
const { setTimeout } = require("node:timers/promises");

async function parseReceipts() {
  // fill in your API key or add it as an environment variable
  const mindeeClient = new Client();

  const multiReceiptsFile = mindeeClient.docFromPath("path/to/your/file.ext");
  const resp = await mindeeClient.parse(product.MultiReceiptsDetectorV1, multiReceiptsFile);
  let receipts = await imageOperations.extractReceipts(multiReceiptsFile, resp.document.inference);
  for (const receipt of receipts) {
    const respReceipt = await mindeeClient.parse(product.ReceiptV5, receipt.asSource());
    console.log(respReceipt.document.toString());
    await setTimeout(1000); // wait some time between requests as to not overload the server
  }

}
parseReceipts();
