import * as mindee from "@/index.js";
import path from "path";
import { expect } from "chai";
import * as pdf from "@/pdf/index.js";
import { PageOptions } from "@/input/index.js";
import { PageOptionsOperation, PathInput } from "@/index.js";
import { RESOURCE_PATH } from "../index.js";

describe("Test pdf lib", () => {
  let client: mindee.Client;

  beforeEach(async () => {
    client = new mindee.Client();
  });
  it("should open a simple XFA form PDF.", async () => {
    const inputDoc = new PathInput(
      { inputPath: path.join(RESOURCE_PATH, "file_types/pdf/XfaForm.pdf") }
    );
    await inputDoc.init();
    expect(await pdf.countPages(inputDoc.fileObject)).to.eq(1);
  });

  it("should open an encrypted XFA form PDF.", async () => {
    const inputDoc = new PathInput(
      { inputPath: path.join(RESOURCE_PATH, "file_types/pdf/XfaForm_15p_encrypted.pdf") }
    );
    await inputDoc.init();
    expect(await pdf.countPages(inputDoc.fileObject)).to.eq(15);
  });


  it("should be able to perform page operations on an encrypted XFA form PDF.", async () => {
    const inputDoc = new PathInput(
      { inputPath: path.join(RESOURCE_PATH, "file_types/pdf/XfaForm_15p_encrypted.pdf") }
    );
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
