import { Command, OptionValues } from "commander";
import { Client } from "./client.js";
import { PathInput } from "../input/index.js";
import * as console from "console";
import {
  BaseInference,
  ClassificationInference,
  CropInference,
  ExtractionInference,
  OcrInference,
  SplitInference,
  InferenceResponseConstructor,
} from "@/v2/parsing/inference/index.js";

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
  responseType: InferenceResponseConstructor<any>,
  inputPath: string,
  options: OptionValues
): Promise<void> {
  const mindeeClient = initClient(options);
  const inputSource = new PathInput({ inputPath: inputPath });
  const response = await mindeeClient.enqueueAndGetInference(
    responseType,
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
    { name: "extract", description: "Extract data from a document.", responseType: ExtractionInference },
    { name: "crop", description: "Crop a document.", responseType: CropInference },
    { name: "split", description: "Split a document into pages.", responseType: SplitInference },
    { name: "ocr", description: "Read text from a document.", responseType: OcrInference },
    { name: "classify", description: "Classify a document.", responseType: ClassificationInference },
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
      return enqueueAndGetInference(inference.responseType, inputPath, allOptions);
    });
  }

  program.parse(process.argv);
}
