import * as mindee from "../../src";
import path from "path";
import { expect } from "chai";
import * as pdf from "../../src/pdf";
import { PageOptions } from "../../src/input";
import { PageOptionsOperation } from "../../src";
import * as fs from "node:fs";

describe("Test pdf lib", () => {
  let client: mindee.Client;
  beforeEach(async () => {
    client = new mindee.Client();
  });
  it("should open a simple XFA form PDF.", async () => {
    const inputDoc = client.docFromPath(path.join(__dirname, "../data/file_types/pdf/XfaForm.pdf"));

    await inputDoc.init();
    expect(await pdf.countPages(inputDoc.fileObject)).to.eq(1);
  });

  it("should open an encrypted XFA form PDF.", async () => {
    const inputDoc = client.docFromPath(path.join(__dirname, "../data/file_types/pdf/XfaForm_15p_encrypted.pdf"));

    await inputDoc.init();
    expect(await pdf.countPages(inputDoc.fileObject)).to.eq(15);
  });


  it("should be able to perform page operations on an encrypted XFA form PDF.", async () => {
    const inputDoc = client.docFromPath(path.join(__dirname, "../data/file_types/pdf/XfaForm_15p_encrypted.pdf"));

    await inputDoc.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0, 1],
      operation: PageOptionsOperation.KeepOnly,
      onMinPages: 1,
    };
    const splitPdf = await pdf.extractPages(inputDoc.fileObject, pageOptions);
    expect(splitPdf.totalPagesRemoved).to.eq(13);
    expect(await pdf.countPages(splitPdf.file)).to.eq(2);
  });
});
