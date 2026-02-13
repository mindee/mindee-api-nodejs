import path from "path";
import assert from "node:assert/strict";
import * as pdf from "@/pdf/index.js";
import { PageOptions } from "@/input/index.js";
import { PageOptionsOperation, PathInput } from "@/index.js";
import { RESOURCE_PATH } from "../index.js";

describe("Test pdf lib #includeOptionalDeps", () => {

  it("should open a simple XFA form PDF.", async () => {
    const inputDoc = new PathInput(
      { inputPath: path.join(RESOURCE_PATH, "file_types/pdf/XfaForm.pdf") }
    );
    await inputDoc.init();
    assert.strictEqual(await pdf.countPages(inputDoc.fileObject), 1);
  });

  it("should open an encrypted XFA form PDF.", async () => {
    const inputDoc = new PathInput(
      { inputPath: path.join(RESOURCE_PATH, "file_types/pdf/XfaForm_15p_encrypted.pdf") }
    );
    await inputDoc.init();
    assert.strictEqual(await pdf.countPages(inputDoc.fileObject), 15);
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
    assert.strictEqual(splitPdf.totalPagesRemoved, 13);
    assert.strictEqual(await pdf.countPages(splitPdf.file), 2);
  });
});
