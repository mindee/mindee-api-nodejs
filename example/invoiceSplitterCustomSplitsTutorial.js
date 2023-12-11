const { Client, product, imageOperations } = require("mindee");
const { setTimeout } = require("node:timers/promises");

async function parseInvoicesWithCustomSplitsThreshold(customSplits) {
    // fill in your API key or add it as an environment variable
    const mindeeClient = new Client();

    const invoiceFile = mindeeClient.docFromPath("path/to/your/file.ext");
    let invoices = await imageOperations.extractInvoices(invoiceFile, customSplits);
    for (const invoice of invoices) {
        // optional: save the documents locally
        invoice.saveToFile(`/tmp/invoice_p_${invoice.pageIdMin}-${invoice.pageIdMax}.pdf`);
        const respInvoice = await mindeeClient.parse(product.InvoiceV4, invoice.asSource());
        console.log(respInvoice.document.toString());
        await setTimeout(1000); // wait some time between requests as to not overload the server
    }

}

const customSplits = [[0, 1], [1, 2]];

parseInvoicesWithCustomSplitsThreshold(customSplits);
