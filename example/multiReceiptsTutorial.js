const { Client, product, imageOperations, PathInput } = require("mindee");
const { setTimeout } = require("node:timers/promises");

async function parseReceipts() {
  // fill in your API key or add it as an environment variable
  const mindeeClient = new Client();

  // Load a file from disk
  const inputSource = new PathInput(
    { inputPath: "/path/to/the/file.ext" }
  );

  const resp = await mindeeClient.parse(product.MultiReceiptsDetectorV1, inputSource);
  let receipts = await imageOperations.extractReceipts(inputSource, resp.document.inference);
  for (const receipt of receipts) {
    const respReceipt = await mindeeClient.parse(product.ReceiptV5, receipt.asSource());
    console.log(respReceipt.document.toString());
    receipt.saveToFile(`/tmp/receipt_p${receipt.pageId}_${receipt.receiptId}.pdf`); //optional: save to a file
    await setTimeout(1000); // wait some time between requests as to not overload the server
  }

}

parseReceipts();
