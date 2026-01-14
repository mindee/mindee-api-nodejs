import { Command, OptionValues } from "commander";
import { Client } from "./client.js";
import { PathInput } from "../input/index.js";
import * as console from "console";
import { BaseInference } from "@/v2/parsing/inference/index.js";

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
  inputPath: string,
  options: OptionValues
): Promise<void> {
  const mindeeClient = initClient(options);
  const inputSource = new PathInput({ inputPath: inputPath });
  const response = await mindeeClient.enqueueAndGetExtraction(inputSource, {
    modelId: options.model,
    pollingOptions: {
      initialDelaySec: 2,
      delaySec: 1.5,
      maxRetries: 80,
    }
  });
  if (!response.inference) {
    throw Error("Inference could not be retrieved");
  }
  printResponse(response.inference);
}

async function enqueueAndGetUtility(
  inputPath: string,
  options: OptionValues
): Promise<void> {
  const mindeeClient = initClient(options);
  const inputSource = new PathInput({ inputPath: inputPath });
  const response = await mindeeClient.enqueueAndGetUtility(inputSource, {
    modelId: options.model,
    pollingOptions: {
      initialDelaySec: 2,
      delaySec: 1.5,
      maxRetries: 80,
    }
  });
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

  const inferenceCmd: Command = program.command("extract")
    .description("Send a file and extract results.");
  addMainOptions(inferenceCmd);

  const cropCmd: Command = program.command("crop")
    .description("Send a file and crop it.");
  addMainOptions(cropCmd);

  const splitCmd: Command = program.command("split")
    .description("Send a file and split it.");
  addMainOptions(splitCmd);

  const ocrCmd: Command = program.command("ocr")
    .description("Send a file and read its text content.");
  addMainOptions(ocrCmd);

  const classifyCmd: Command = program.command("classify")
    .description("Send a file and classify its content.");
  addMainOptions(classifyCmd);


  inferenceCmd.action(function (
    inputPath: string,
    options: OptionValues,
  ) {
    const allOptions = { ...program.opts(), ...options };
    return enqueueAndGetInference(inputPath, allOptions);
  });

  cropCmd.action(function (
    inputPath: string,
    options: OptionValues,
  ) {
    const allOptions = { ...program.opts(), ...options };
    return enqueueAndGetUtility(inputPath, allOptions);
  });

  program.parse(process.argv);
}
