import { Command, OptionValues } from "commander";
import * as console from "console";
import { Client, InputSource, PathInput, UrlInput } from "@/index.js";
import { BaseInference } from "@/v2/parsing/inference/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";
import {
  Classification,
  Crop,
  Extraction,
  Ocr,
  Split,
} from "@/v2/product/index.js";

interface CliProduct {
  name: string;
  description: string;
  productClass: typeof BaseProduct;
}

const program = new Command();

//
// EXECUTE THE COMMANDS
//

function initClient(options: OptionValues): Client {
  return new Client({
    apiKey: options.apiKey,
    debug: options.debug,
  });
}

async function enqueueAndGetInference(
  product: typeof BaseProduct,
  inputPath: string,
  options: OptionValues
): Promise<void> {
  const mindeeClient = initClient(options);
  let inputSource: InputSource;
  if (inputPath.startsWith("https://")) {
    inputSource = new UrlInput({ url: inputPath });
  } else {
    inputSource = new PathInput({ inputPath: inputPath });
  }
  const response = await mindeeClient.enqueueAndGetResult(
    product,
    inputSource,
    { modelId: options.model },
    {
      initialDelaySec: 2,
      delaySec: 1.5,
      maxRetries: 80,
    }
  );
  if (!response.inference) {
    throw Error("Inference could not be retrieved");
  }
  printResponse(response.inference);
}

function printResponse(
  document: BaseInference,
): void {
  if (document) {
    console.log(`\n${document}`);
  }
}

//
// BUILD THE COMMANDS
//

function addMainOptions(prog: Command) {
  prog.requiredOption(
    "-m, --model <model_id>",
    "Model ID (required)"
  );
  prog.argument("<input_path>", "full path or URL to the file");
}

export function cli() {
  program.name("mindee")
    .description("Command line interface for Mindee V2 products.")
    .option("-d, --debug", "high verbosity mode")
    .option("-k, --api-key <api_key>", "your Mindee API key");

  const inferenceTypes: CliProduct[] = [
    { name: "extraction", description: "Extract data from a document.", productClass: Extraction },
    { name: "crop", description: "Crop a document.", productClass: Crop },
    { name: "split", description: "Split a document into pages.", productClass: Split },
    { name: "ocr", description: "Read text from a document.", productClass: Ocr },
    { name: "classification", description: "Classify a document.", productClass: Classification },
  ];

  for (const inference of inferenceTypes) {
    const inferenceCmd: Command = program.command(inference.name)
      .description(inference.description);

    addMainOptions(inferenceCmd);

    inferenceCmd.action(function (
      inputPath: string,
      options: OptionValues,
    ) {
      const allOptions = { ...program.opts(), ...options };
      return enqueueAndGetInference(inference.productClass, inputPath, allOptions);
    });
  }

  program.parse(process.argv);
}
