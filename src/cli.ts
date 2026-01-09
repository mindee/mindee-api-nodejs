import { Command, OptionValues, Option } from "commander";
import {
  Document, Inference, StringDict
} from "@/parsing/common/index.js";
import { Client, PredictOptions } from "./client.js";
import { PageOptions, PageOptionsOperation, PathInput } from "./input/index.js";
import * as console from "console";
import {
  CLI_COMMAND_CONFIG, COMMAND_GENERATED, ProductConfig
} from "./cliProducts.js";
import { Endpoint } from "./http/index.js";

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

function getConfig(command: string): ProductConfig {
  const conf = CLI_COMMAND_CONFIG.get(command);
  if (conf === undefined) {
    throw new Error(`Invalid document type ${command}`);
  }
  return conf;
}

function getPageOptions(options: any) {
  let pageOptions: PageOptions | undefined = undefined;
  if (options.cutPages) {
    pageOptions = {
      operation: PageOptionsOperation.KeepOnly,
      pageIndexes: [0, 1, 2, 3, 4],
      onMinPages: 5,
    };
  }
  return pageOptions;
}

function getPredictParams(options: any): PredictOptions {
  return {
    allWords: options.allWords,
    cropper: options.cropper,
  };
}

async function callParse<T extends Inference>(
  productClass: new (httpResponse: StringDict) => T,
  command: string,
  inputPath: string,
  options: any
): Promise<void> {
  const mindeeClient = initClient(options);
  const predictParams = getPredictParams(options);
  const pageOptions = getPageOptions(options);
  const inputSource = new PathInput({ inputPath: inputPath });
  let response;
  if (command === COMMAND_GENERATED) {
    const customEndpoint = mindeeClient.createEndpoint(
      options.endpoint,
      options.account,
      options.version
    );
    response = await mindeeClient.parse(productClass, inputSource, {
      endpoint: customEndpoint,
      pageOptions: pageOptions,
      allWords: predictParams.allWords,
      cropper: predictParams.cropper,
    });
  } else {
    response = await mindeeClient.parse(productClass, inputSource, {
      pageOptions: pageOptions,
      allWords: predictParams.allWords,
      cropper: predictParams.cropper,
    });
  }
  printResponse(response.document, options);
}

async function callEnqueueAndParse<T extends Inference>(
  productClass: new (httpResponse: StringDict) => T,
  command: string,
  inputPath: string,
  options: any
): Promise<void> {
  const mindeeClient = initClient(options);
  const predictParams = getPredictParams(options);
  const pageOptions = getPageOptions(options);
  const inputSource = new PathInput({ inputPath: inputPath });
  let customEndpoint: Endpoint | undefined = undefined;
  if (command === COMMAND_GENERATED) {
    customEndpoint = mindeeClient.createEndpoint(
      options.endpoint,
      options.account,
      options.version
    );
  }
  const response = await mindeeClient.enqueueAndParse(productClass, inputSource, {
    endpoint: customEndpoint,
    pageOptions: pageOptions,
    allWords: predictParams.allWords,
    cropper: predictParams.cropper,
    initialDelaySec: 2,
    delaySec: 1.5,
    maxRetries: 80,
  });
  if (!response.document) {
    throw Error("Document could not be retrieved");
  }
  printResponse(response.document, options);
}

async function callGetDocument<T extends Inference>(
  productClass: new (httpResponse: StringDict) => T,
  documentId: string, options: any
): Promise<void> {
  const mindeeClient = initClient(options);
  const response = await mindeeClient.getDocument(productClass, documentId);
  printResponse(response.document, options);
}

function printResponse<T extends Inference>(
  document: Document<T>,
  options: any
): void {
  if (options.allWords) {
    document.ocr?.mVisionV1.pages.forEach((page) => {
      console.log(page.allWords.toString());
    });
  }
  if (options.pages) {
    document.inference.pages.forEach((page) => {
      console.log(`\n${page}`);
    });
  }
  if (document) {
    console.log(`\n${document}`);
  }
}

//
// BUILD THE COMMANDS
//

function addMainOptions(prog: Command) {
  prog.option("-k, --api-key <api_key>", "API key for document endpoint");
}

function addPostOptions(prog: Command, info: ProductConfig) {
  prog.option("-c, --cut-pages", "keep only the first 5 pages of the document");
  if (info.allWords) {
    prog.option("-w, --all-words", "to get all the words in the current document. False by default.");
  }
  prog.argument("<input_path>", "full path to the file");
}

function addCustomPostOptions(prog: Command) {
  prog.requiredOption(
    "-e, --endpoint <endpoint_name>",
    "API endpoint name (required)"
  );
  prog.requiredOption(
    "-a, --account <account_name>",
    "API account name for the endpoint (required)"
  );
  prog.option(
    "-v, --version <version>",
    "version for the endpoint, use the latest version if not specified"
  );
}

function addDisplayOptions(prog: Command) {
  prog.option("-p, --pages", "show content of individual pages");
}

function routeSwitchboard(
  command: Command,
  inputPath: string,
  allOptions: any
): Promise<void> {
  if (command.parent === null || command.parent === undefined) {
    throw new Error(`Improperly configured command: ${command.name()}`);
  }
  const docClass = getConfig(command.parent.name()).docClass;
  if ("async" in command.opts() && command.opts()["async"]) {
    return callEnqueueAndParse(docClass, command.name(), inputPath, allOptions);
  }
  return callParse(docClass, command.name(), inputPath, allOptions);
}

function addPredictAction(prog: Command) {
  if (prog.name() === COMMAND_GENERATED) {
    prog.action(function (
      inputPath: string,
      options: OptionValues,
      command: Command
    ) {
      const allOptions = {
        ...prog.parent?.parent?.opts(),
        ...prog.parent?.opts(),
        ...prog.opts(),
        ...options,
      };
      return routeSwitchboard(command, inputPath, allOptions);
    });
  } else {
    prog.action(function (
      inputPath: string,
      options: OptionValues,
      command: Command
    ) {
      const allOptions = {
        ...prog.parent?.parent?.opts(),
        ...prog.parent?.opts(),
        ...prog.opts(),
        ...options,
      };
      return routeSwitchboard(command, inputPath, allOptions);
    });
  }
}

export function cli() {
  program.name("mindee")
    .description("Command line interface for Mindee products.")
    .option("-d, --debug", "high verbosity mode");

  CLI_COMMAND_CONFIG.forEach((info, name) => {
    const productCmd: Command = program.command(name)
      .description(info.displayName);

    if (info.async) {
      const getDocProductCmd: Command = productCmd.command("fetch")
        .description("Fetch previously parsed results.")
        .argument("<documentId>", "Unique ID of the document.")
        .action(async (documentId, options) => {
          const docClass = getConfig(name).docClass;
          await callGetDocument(
            docClass,
            documentId,
            { ...options, ...productCmd.opts(), ...program.opts() }
          );
        });
      addMainOptions(getDocProductCmd);
    }

    const predictProductCmd: Command = productCmd.command("parse")
      .description("Send a file for parsing.");

    if (info.async) {
      const asyncOpt = new Option("-A, --async", "Call asynchronously");
      if (info.sync) {
        asyncOpt.default(false);
      } else {
        asyncOpt.default(true);
        asyncOpt.hideHelp();
      }
      predictProductCmd.addOption(asyncOpt);
    }

    if (name === COMMAND_GENERATED) {
      addCustomPostOptions(predictProductCmd);
    }
    addMainOptions(predictProductCmd);
    addDisplayOptions(predictProductCmd);
    addPostOptions(predictProductCmd, info);
    addPredictAction(predictProductCmd);
  });
  program.parse(process.argv);
}
