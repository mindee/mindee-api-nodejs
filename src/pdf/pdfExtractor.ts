// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type * as pdfLibTypes from "@cantoo/pdf-lib";
import { LocalInputSource, PageOptions, PageOptionsOperation, PathInput } from "@/input/index.js";
import { logger } from "@/logger.js";
import path from "path";
import { loadOptionalDependency } from "@/dependency/index.js";
import { MindeeInputSourceError, MindeePdfError } from "@/errors/index.js";
import { ExtractedPdf } from "@/pdf/extractedPdf.js";
import { createPdfFromInputSource, extractPages } from "@/pdf/pdfOperation.js";

let pdfLib: typeof pdfLibTypes | null = null;

async function getPdfLib(): Promise<typeof pdfLibTypes> {
  if (!pdfLib) {
    const pdfLibImport = await loadOptionalDependency<typeof pdfLibTypes>("@cantoo/pdf-lib", "Text Embedding");
    pdfLib = (pdfLibImport as any).default || pdfLibImport;
  }
  return pdfLib!;
}

export class PdfExtractor {
  /**
   * Buffer containing the PDF data.
   * @private
   */
  private sourcePdf: Buffer | null = null;
  /**
   * Filename of the PDF.
   * @private
   */
  private filename: string | null = null;
  /**
   * Input document.
   * @private
   */
  private readonly inputDocument: string | LocalInputSource;
  /**
   * Whether the extractor has been initialized.
   * @private
   */
  private initialized: boolean = false;
  /**
   * PDF library instance.
   * @private
   */
  private pdfLib: typeof pdfLibTypes | null = null;

  /**
   * List of extracted PDFs.
   * @private
   */
  private extractedPdfs: ExtractedPdf[] | null = null;

  constructor(inputDocument: string | LocalInputSource) {
    this.inputDocument = inputDocument;
  }

  async init() {
    this.pdfLib = await getPdfLib();
    if (typeof this.inputDocument === "string") {
      logger.debug(`Loading from path: ${this.inputDocument}`);
      try {
        const tempPathInput = new PathInput({ inputPath: this.inputDocument });
        await tempPathInput.init();
        if (tempPathInput.isPdf()) {
          this.sourcePdf = tempPathInput.fileObject;
        } else {
          const pdfObject = await createPdfFromInputSource(tempPathInput);
          this.sourcePdf = Buffer.from(await pdfObject.save());
        }
      } catch {
        throw new MindeeInputSourceError("Couldn't generate PDF from input.");
      }
      this.filename = path.basename(this.inputDocument);
    } else {
      logger.debug(`Loading document: ${this.inputDocument.filename}`);
      await this.inputDocument.init();
      if (this.inputDocument.isPdf()) {
        this.sourcePdf = this.inputDocument.fileObject as Buffer;
      } else {
        const pdfObject = await createPdfFromInputSource(this.inputDocument);
        const arrayBuffer = await pdfObject.save();
        this.sourcePdf = Buffer.from(arrayBuffer);
      }
      this.filename = this.inputDocument.filename;
    }
    this.initialized = true;
    if (!this.sourcePdf) {
      throw new MindeePdfError("Could not load PDF source.");
    }
  }

  /**
   * Gets the number of pages in the PDF.
   * @returns The number of pages in the PDF.
   */
  async getPageCount() {
    if (!this.initialized) {
      await this.init();
    }
    const currentPdf = await this.pdfLib!.PDFDocument.load(this.sourcePdf!, {
      ignoreEncryption: true,
      password: ""
    });
    return currentPdf.getPageCount();
  }

  /**
   * Extracts pages from the PDF.
   * @param pageIndexes
   */
  async extractSubDocuments(pageIndexes: number[][]): Promise<ExtractedPdf[]> {
    if (this.extractedPdfs && this.extractedPdfs.length > 0) {
      return this.extractedPdfs;
    }
    if (!this.initialized) {
      await this.init();
    }
    this.extractedPdfs = [];
    for (const pageRange of pageIndexes) {
      logger.debug(`Extracting pages ${pageRange.join(", ")}`);
      if (pageRange.length === 0) {
        throw new MindeeInputSourceError("Empty indexes not allowed for extraction.");
      }
      const pageOptions: PageOptions = {
        pageIndexes: pageRange,
        operation: PageOptionsOperation.KeepOnly,
        onMinPages: 1,
      };
      const splitName = path.basename(this.filename!, path.extname(this.filename!));

      const startPage = String(pageRange[0] + 1).padStart(3, "0");
      const endPage = String(pageRange[pageRange.length - 1] + 1).padStart(3, "0");

      const fieldFilename = `${splitName}_page${startPage}-${endPage}.pdf`;
      const page = await extractPages(this.sourcePdf!, pageOptions);
      this.extractedPdfs.push(new ExtractedPdf(page.file, fieldFilename, pageRange.length));
    }
    return this.extractedPdfs;
  }
}
