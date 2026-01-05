import sharp from "sharp";
import { Sharp, Metadata } from "sharp";
import { MindeeImageError } from "@/errors/index.js";

/**
 * Compresses an image with the given parameters.
 *
 * @param imageBuffer Buffer representation of an image.
 * @param quality Quality to apply to the image (JPEG).
 * @param maxWidth Maximum bound for width.
 * @param maxHeight Maximum bound for height.
 */
export async function compressImage(
  imageBuffer: Buffer,
  quality:number = 85,
  maxWidth:number|null = null,
  maxHeight:number|null = null,
) {
  let sharpImage: Sharp = sharp(imageBuffer);

  const metadata: Metadata = await sharpImage.metadata();
  if (metadata.width === undefined || metadata.height === undefined){
    throw new MindeeImageError("Source image has invalid dimensions.");
  }
  maxWidth ??= metadata.width;
  maxHeight ??= metadata.height;
  if (maxWidth || maxHeight) {
    sharpImage = sharpImage.resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  return await sharpImage
    .jpeg({ quality: quality })
    .toBuffer();
}
