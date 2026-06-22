import { LocalInputSource } from "@/input/index.js";
import { MindeeError } from "@/errors/index.js";
import { PdfExtractor } from "@/pdf/pdfExtractor.js";
import { logger } from "@/logger.js";
import { ExtractedPdf } from "@/pdf/extractedPdf.js";
import { ExtractedPdfs } from "@/pdf/extractedPdfs.js";

/**
 * Extracts a single specified split from a
 * @param inputSource
 * @param split
 */
export async function extractSingleSplit(inputSource: LocalInputSource, split: number[]) {
  return await extractMultipleSplits(inputSource, [split]);
}

/**
 * Extracts splits as complete PDFs from the document.
 * @param inputSource Local input source.
 * @param splits List of sub-lists of pages to keep.
 * @return a list of extracted files.
 * @throws MindeeError if no indexes are provided.
 */
export async function extractMultipleSplits(inputSource: LocalInputSource, splits: number[][]): Promise<ExtractedPdfs> {
  const pageGroups = splits.filter(e => e.length > 0);
  if (pageGroups.length === 0) {
    throw new MindeeError("No valid split indexes provided.");
  }
  await inputSource.init();
  logger.debug("Extracting splits: " + splits.join(", "));
  const pdfExtractor = new PdfExtractor(inputSource);
  await pdfExtractor.init();

  if (splits.length === 0) {
    return new ExtractedPdfs();
  }
  const pageCount = await pdfExtractor.getPageCount();
  if (splits.length === 1 && splits[0].at(-1) === pageCount-1) {
    return new ExtractedPdfs(new ExtractedPdf(inputSource.fileObject as Buffer, inputSource.filename, pageCount));
  }
  const subDocuments = await pdfExtractor.extractSubDocuments(pageGroups);
  return new ExtractedPdfs(...subDocuments);
}

/**
 * Expands a range of pages into a list of page indexes.
 * @param range start and end of the page range
 */
export function expandRange(range: [number, number]): number[] {
  if (range[0] > range[1]) {
    throw new MindeeError("Invalid page range provided.");
  }
  return Array.from({ length: range[1] - range[0] + 1 }, (_, i) => range[0] + i);
}
