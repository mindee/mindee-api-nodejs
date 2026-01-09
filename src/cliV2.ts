import { Command, OptionValues } from "commander";
import { ClientV2 } from "./clientV2.js";
import { PathInput } from "./input/index.js";
import * as console from "console";
import { Inference } from "@/parsing/v2/index.js";

const program = new Command();


//
// EXECUTE THE COMMANDS
//

function initClient(options: OptionValues): ClientV2 {
  return new ClientV2({
    apiKey: options.apiKey,
    debug: options.debug,
  });
}

async function callEnqueueAndGetInference(
  inputPath: string,
  options: any
): Promise<void> {
  const mindeeClient = initClient(options);
  const inputSource = new PathInput({ inputPath: inputPath });
  const response = await mindeeClient.enqueueAndGetInference(inputSource, {
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
  document: Inference,
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
  prog.option("-k, --api-key <api_key>", "API key for document endpoint");
  prog.argument("<input_path>", "full path to the file");
}

export function cliV2() {
  program.name("mindee")
    .description("Command line interface for Mindee products.")
    .option("-d, --debug", "high verbosity mode");

  const inferenceCmd: Command = program.command("parse")
    .description("Send a file and retrieve the inference results.");

  addMainOptions(inferenceCmd);

  inferenceCmd.action(function (
    inputPath: string,
    options: OptionValues,
  ) {
    return callEnqueueAndGetInference(inputPath, options);
  });

  program.parse(process.argv);
}
