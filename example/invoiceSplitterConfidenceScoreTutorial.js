const { Client, product, imageOperations } = require("mindee");
const { setTimeout } = require("node:timers/promises");

async function parseInvoicesWithConfidenceThreshold(confidence) {
    // fill in your API key or add it as an environment variable
    const mindeeClient = new Client();

    const invoiceFile = mindeeClient.docFromPath("path/to/your/file.ext");
    const resp = await mindeeClient.enqueueAndParse(product.InvoiceSplitterV1, invoiceFile);
    let invoices = await imageOperations.extractAllInvoices(invoiceFile, resp.document.inference);
    for (const invoice of invoices) {
        // optional: save the documents locally
        invoice.saveToFile(`/tmp/invoice_p${invoice.pageIdMin}-${invoice.pageIdMax}_${invoice.receiptId}.pdf`);
        const respInvoice = await mindeeClient.parse(product.InvoiceV4, invoice.asSource());
        console.log(respInvoice.document.toString());
        await setTimeout(1000); // wait some time between requests as to not overload the server
    }

}
parseInvoices();
