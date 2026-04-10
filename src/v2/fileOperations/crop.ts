import { LocalInputSource } from "@/input/index.js";
import { CropItem } from "@/v2/product/crop/index.js";
import { MindeeError } from "@/errors/index.js";
import { extractImagesFromPolygon } from "@/image/imageExtractor.js";
import { Polygon } from "@/geometry/index.js";
import { CropFiles } from "@/v2/fileOperations/cropFiles.js";
import { ExtractedImage } from "@/image/index.js";
import { logger } from "@/logger.js";


/**
 * Extracts a single specified crop from a given input source.
 * @param inputSource Local input source.
 * @param crop Crop to extract.
 */
export async function extractSingleCrop(inputSource: LocalInputSource, crop: CropItem): Promise<ExtractedImage> {
  return (await extractCrops(inputSource, [crop]))[0];
}


/**
 * Extracts a list of crops from a document.
 * @param inputSource Local input source.
 * @param crops List of crops to extract.
 * @param upscale Whether to upscale the extracted images.
 * @return a list of extracted files, as a CropFiles object.
 */
export async function extractCrops(
  inputSource: LocalInputSource,
  crops: CropItem[],
  upscale: boolean = false
): Promise<CropFiles> {
  if (crops.length === 0) {
    throw new MindeeError("No crop indexes provided.");
  }
  logger.debug("Extracting crops: " + crops.join(", "));
  const polygonsByPage = new Map<number, Polygon[]>();
  for (const crop of crops) {
    const pageId: number = crop.location.page;
    if (!polygonsByPage.has(pageId)) {
      polygonsByPage.set(pageId, []);
    }
    polygonsByPage.get(pageId)!.push(crop.location.polygon);
  }
  const extractedCrops = await extractImagesFromPolygon(inputSource, polygonsByPage, upscale);
  return new CropFiles(...extractedCrops);
}
