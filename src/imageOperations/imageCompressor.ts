import sharp from "sharp";
import { Sharp, Metadata } from "sharp";
import { MindeeImageError } from "../errors/mindeeError";

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
