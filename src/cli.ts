import { Command, OptionValues, Option } from "commander";
import * as product from "./product";
import { AsyncPredictResponse, Document, Inference, StringDict } from "./parsing/common";
import { Client, PredictOptions } from "./client";
import { PageOptions, PageOptionsOperation } from "./input";
import * as console from "console";

const program = new Command();

const COMMAND_CUSTOM = "custom";
const COMMAND_GENERATED = "generated";

interface ProductConfig<T extends Inference = Inference> {
  displayName: string;
  docClass: new (rawPrediction: StringDict) => T;
  allWords: boolean;
  async: boolean;
  sync: boolean;
}

//
// PRODUCT CONFIGURATION
//
// The Map's key is the command name as it will appear on the console.
//

const CLI_COMMAND_CONFIG = new Map<string, ProductConfig>([
  [
    COMMAND_CUSTOM,
    {
      displayName: "Custom Document",
      docClass: product.CustomV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    COMMAND_GENERATED,
    {
      displayName: "Generated Document",
      docClass: product.GeneratedV1,
      allWords: true,
      async: true,
      sync: true,
    },
  ],
  [
    "cropper",
    {
      displayName: "Cropper",
      docClass: product.CropperV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "international-id",
    {
      displayName: "International Id",
      docClass: product.InternationalIdV2,
      allWords: false,
      async: true,
      sync: false,
    },
  ],
  [
    "invoice",
    {
      displayName: "Invoice",
      docClass: product.InvoiceV4,
      allWords: true,
      async: false,
      sync: true,
    },
  ],
  [
    "invoice-splitter",
    {
      displayName: "Invoice Splitter",
      docClass: product.InvoiceSplitterV1,
      allWords: false,
      async: true,
      sync: false,
    },
  ],
  [
    "receipt",
    {
      displayName: "Expense Receipt",
      docClass: product.ReceiptV5,
      allWords: true,
      async: false,
      sync: true,
    },
  ],
  [
    "passport",
    {
      displayName: "Passport",
      docClass: product.PassportV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "financial",
    {
      displayName: "Financial Document",
      docClass: product.FinancialDocumentV1,
      allWords: true,
      async: false,
      sync: true,
    },
  ],
  [
    "fr-id-card",
    {
      displayName: "FR ID Card",
      docClass: product.fr.IdCardV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "fr-bank-account-details",
    {
      displayName: "FR Bank Account Details",
      docClass: product.fr.BankAccountDetailsV2,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "fr-carte-vitale",
    {
      displayName: "FR Carte Vitale",
      docClass: product.fr.CarteVitaleV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "eu-license-plate",
    {
      displayName: "EU License Plate",
      docClass: product.eu.LicensePlateV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "eu-driver-license",
    {
      displayName: "EU Driver License",
      docClass: product.eu.DriverLicenseV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "us-bank-check",
    {
      displayName: "US Bank Check",
      docClass: product.us.BankCheckV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "us-driver-license",
    {
      displayName: "US Driver License",
      docClass: product.us.DriverLicenseV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
]);

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
  const inputSource = mindeeClient.docFromPath(inputPath);
  let response;
  if (command === COMMAND_CUSTOM || command === COMMAND_GENERATED) {
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
  const inputSource = mindeeClient.docFromPath(inputPath);
  let response: AsyncPredictResponse<T>;
  if (command === COMMAND_CUSTOM || command === COMMAND_GENERATED) {
    const customEndpoint = mindeeClient.createEndpoint(
      options.endpoint,
      options.account,
      options.version
    );
    response = await mindeeClient.enqueueAndParse(productClass, inputSource, {
      endpoint: customEndpoint,
      pageOptions: pageOptions,
      allWords: predictParams.allWords,
      cropper: predictParams.cropper,
      initialDelaySec: 4,
      delaySec: 2,
      maxRetries: 60,
    });
  } else {
    response = await mindeeClient.enqueueAndParse(productClass, inputSource, {
      pageOptions: pageOptions,
      allWords: predictParams.allWords,
      cropper: predictParams.cropper,
      initialDelaySec: 4,
      delaySec: 2,
      maxRetries: 60,
    });
    if (!response.document) {
      throw Error("Document could not be retrieved");
    }
    printResponse(response.document, options);
  }
}

async function callGetDocument<T extends Inference>(
  productClass: new (httpResponse: StringDict) => T,
  documentId: string, options: any
): Promise<void> {
  const mindeeClient = initClient(options);
  const response = await mindeeClient.getDocument(productClass, documentId)
  printResponse(response.document, options);
}

async function callSendFeedback<T extends Inference>(
  productClass: new (httpResponse: StringDict) => T,
  documentId: string,
  feedbackStr: string,
  options: any
): Promise<void> {
  const mindeeClient = initClient(options);
  const feedback = {
    feedback: JSON.parse(feedbackStr),
  };
  const response = await mindeeClient.sendFeedback(
    productClass,
    documentId,
    feedback
  );
  console.log(response.feedback);
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
  if (prog.name() === COMMAND_CUSTOM || prog.name() === COMMAND_GENERATED) {
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
            {...options, ...productCmd.opts(), ...program.opts()}
          );
        });
      addMainOptions(getDocProductCmd);
    }

    const feedbackProductCmd: Command = productCmd.command("feedback")
      .description("Send feedback for a document.")
      .argument("<documentId>", "Unique ID of the document.")
      .argument("<feedback>", "Feedback to send, ex '{\"key\": \"value\"}'.")
      .action(async (documentId, feedback, options) => {
        const docClass = getConfig(name).docClass;
        await callSendFeedback(
          docClass,
          documentId,
          feedback,
          {...options, ...productCmd.opts(), ...program.opts()}
        );
      });
    addMainOptions(feedbackProductCmd);

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

    if (name === COMMAND_CUSTOM || name === COMMAND_GENERATED) {
      addCustomPostOptions(predictProductCmd);
    }
    addMainOptions(predictProductCmd);
    addDisplayOptions(predictProductCmd);
    addPostOptions(predictProductCmd, info);
    addPredictAction(predictProductCmd);
  });
  program.parse(process.argv);
}
