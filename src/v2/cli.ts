import { Command, OptionValues } from "commander";
import { Client } from "./client.js";
import { PathInput } from "../input/index.js";
import * as console from "console";
import { BaseInference } from "@/v2/parsing/inference/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";
import {
  Classification,
  Crop,
  Extraction,
  Ocr,
  Split,
} from "@/v2/product/index.js";

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
  const inputSource = new PathInput({ inputPath: inputPath });
  const response = await mindeeClient.enqueueAndGetResult(
    product,
    inputSource,
    {
      modelId: options.model,
      pollingOptions: {
        initialDelaySec: 2,
        delaySec: 1.5,
        maxRetries: 80,
      }
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
  prog.argument("<input_path>", "full path to the file");
}

export function cli() {
  program.name("mindee")
    .description("Command line interface for Mindee V2 products.")
    .option("-d, --debug", "high verbosity mode")
    .option("-k, --api-key <api_key>", "your Mindee API key");

  const inferenceTypes = [
    { name: "extract", description: "Extract data from a document.", product: Extraction },
    { name: "crop", description: "Crop a document.", product: Crop },
    { name: "split", description: "Split a document into pages.", product: Split },
    { name: "ocr", description: "Read text from a document.", product: Ocr },
    { name: "classify", description: "Classify a document.", product: Classification },
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
      return enqueueAndGetInference(inference.product, inputPath, allOptions);
    });
  }

  program.parse(process.argv);
}
