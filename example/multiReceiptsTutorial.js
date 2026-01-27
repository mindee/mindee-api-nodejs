const { setTimeout } = require("node:timers/promises");
const mindee = require("mindee");

async function parseReceipts(inputPath) {
  // fill in your API key or add it as an environment variable
  const mindeeClient = new mindee.v1.Client();

  // Load a file from disk
  const inputSource = new mindee.PathInput(
    { inputPath: inputPath }
  );

  const resp = await mindeeClient.parse(
    mindee.v1.product.MultiReceiptsDetectorV1, inputSource
  );
  let receipts = await mindee.v1.extraction.extractReceipts(
    inputSource, resp.document.inference
  );
  for (const receipt of receipts) {
    const respReceipt = await mindeeClient.parse(
      mindee.v1.product.ReceiptV5, receipt.asSource()
    );
    console.log(respReceipt.document.toString());
    // optional: save to a file
    receipt.saveToFile(`/tmp/receipt_p${receipt.pageId}_${receipt.receiptId}.pdf`);

    // wait some time between requests as to not overload the server
    await setTimeout(1000);
  }
}

parseReceipts("/path/to/the/file.ext");
