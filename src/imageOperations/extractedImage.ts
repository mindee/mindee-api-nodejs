import { Buffer } from "node:buffer";
import { BufferInput } from "../input/sources";


export interface ExtractedImage {
  imageData: Buffer;

  asSource(): BufferInput;
}
