import { Buffer } from "node:buffer";
import { BufferInput } from "../input/sources";


export interface ExtractedImage {
  readonly pageId: number;
  imageData: Buffer;

  asSource(): BufferInput;
}
