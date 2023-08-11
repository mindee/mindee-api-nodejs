import { Command, OptionValues } from "commander";
import * as product from "./product";
import { Document, Inference, StringDict } from "./parsing/common";
import { Client, PredictOptions } from "./client";
import { PageOptions, PageOptionsOperation } from "./input";
import * as console from "console";

const program = new Command();

const COMMAND_CUSTOM = "custom";

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
    "us-bank-check",
    {
      displayName: "US Bank Check",
      docClass: product.us.BankCheckV1,
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
  const mindeeClient = new Client({
    apiKey: options.apiKey,
    debug: options.debug,
  });
  return mindeeClient;
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

function getPredictParams(options: any) {
  const predictParams: PredictOptions = {
    allWords: options.allWords,
    cropper: options.cropper,
  };
  return predictParams;
}

async function callParse(command: string, inputPath: string, options: any) {
  const conf = getConfig(command);
  const mindeeClient = initClient(options);
  const predictParams = getPredictParams(options);
  const pageOptions = getPageOptions(options);
  const inputSource = mindeeClient.docFromPath(inputPath);
  let response;
  if (command === COMMAND_CUSTOM) {
    const customEndpoint = mindeeClient.createEndpoint(
      options.endpoint,
      options.account,
      options.version
    );
    response = await mindeeClient.parse(conf.docClass, inputSource, {
      endpoint: customEndpoint,
      pageOptions: pageOptions,
      allWords: predictParams.allWords,
      cropper: predictParams.cropper,
    });
  } else {
    response = await mindeeClient.parse(conf.docClass, inputSource, {
      pageOptions: pageOptions,
      allWords: predictParams.allWords,
      cropper: predictParams.cropper,
    });
  }
  printResponse(response.document, options);
}

async function callEnqueue(command: string, inputPath: string, options: any) {
  const conf = getConfig(command);
  const mindeeClient = initClient(options);
  const predictParams = getPredictParams(options);
  const pageOptions = getPageOptions(options);
  const inputSource = mindeeClient.docFromPath(inputPath);

  let response;
  if (command === COMMAND_CUSTOM) {
    const customEndpoint = mindeeClient.createEndpoint(
      options.endpoint,
      options.account,
      options.version
    );
    response = await mindeeClient.enqueue(conf.docClass, inputSource, {
      endpoint: customEndpoint,
      pageOptions: pageOptions,
      allWords: predictParams.allWords,
      cropper: predictParams.cropper,
    });
  } else {
    response = await mindeeClient.enqueue(conf.docClass, inputSource, {
      pageOptions: pageOptions,
      allWords: predictParams.allWords,
      cropper: predictParams.cropper,
    });
  }
  console.log(response.job);
}

async function callParseQueued(command: string, queueId: string, options: any) {
  const conf = getConfig(command);
  const mindeeClient = initClient(options);
  const response = await mindeeClient.parseQueued(conf.docClass, queueId);

  if (response.document !== undefined) {
    printResponse(response.document, options);
  } else {
    console.log(response.job);
  }
}

function printResponse<T extends Inference>(
  document: Document<T>,
  options: any
) {
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
  switch (command.parent?.name()) {
  case "parse": {
    return callParse(command.name(), inputPath, allOptions);
  }
  case "enqueue": {
    return callEnqueue(command.name(), inputPath, allOptions);
  }
  case "parse-queued": {
    return callParseQueued(command.name(), inputPath, allOptions);
  }
  default: {
    throw new Error("Unhandled parent command.");
  }
  }
}

function addAction(prog: Command) {
  if (prog.name() === COMMAND_CUSTOM) {
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
  program.name("mindee");
  program.option("-d, --debug", "high verbosity mode");

  const predict = program.command("parse").description("Parse synchronously.");
  addMainOptions(predict);

  const enqueue = program
    .command("enqueue")
    .description("Add to async parse queue.");
  addMainOptions(enqueue);

  const parseQueued = program
    .command("parse-queued")
    .description("Parse from async queue.");
  addMainOptions(parseQueued);

  CLI_COMMAND_CONFIG.forEach((info, name) => {
    if (info.sync) {
      const prog = predict
        .command(name)
        .description(`Parse an ${info.displayName}.`);
      if (name === COMMAND_CUSTOM) {
        addCustomPostOptions(prog);
      }
      addDisplayOptions(prog);
      addPostOptions(prog, info);
      addAction(prog);
    }
    if (info.async) {
      const progEnqueue = enqueue
        .command(name)
        .description(`Add an ${info.displayName} to the queue.`);
      if (name === COMMAND_CUSTOM) {
        addCustomPostOptions(progEnqueue);
      }
      addPostOptions(progEnqueue, info);
      addAction(progEnqueue);

      const progParse = parseQueued
        .command(name)
        .description(`Parse an ${info.displayName} from the queue.`)
        .argument("<doc_id>", "ID of the document");
      addDisplayOptions(progParse);
      addAction(progParse);
    }
  });
  program.parse(process.argv);
}
