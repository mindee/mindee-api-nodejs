import { Command, OptionValues } from "commander";
import {
  InvoiceV4,
  InvoiceSplitterV1,
  ReceiptV5,
  PassportV1,
  MindeeVisionV1,
  CustomV1,
  fr,
  us,
  eu,
  FinancialDocumentV1,
} from "./";
import { Document, DocumentSig } from "./parsing/common";

import { Response, STANDARD_API_OWNER } from "./http";
import { Client, PredictOptions } from "./client";
import { PageOptions, PageOptionsOperation } from "./input";
import * as console from "console";

const program = new Command();

const COMMAND_CUSTOM = "custom";

interface ProductConfig {
  displayName: string;
  docClass: DocumentSig<Document>;
  fullText: boolean;
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
      docClass: CustomV1,
      fullText: false,
      async: false,
      sync: true,
    },
  ],
  [
    "invoice",
    {
      displayName: "Invoice",
      docClass: InvoiceV4,
      fullText: true,
      async: false,
      sync: true,
    },
  ],
  [
    "invoice-splitter",
    {
      displayName: "Invoice Splitter",
      docClass: InvoiceSplitterV1,
      fullText: false,
      async: true,
      sync: false,
    },
  ],
  [
    "receipt",
    {
      displayName: "Expense Receipt",
      docClass: ReceiptV5,
      fullText: true,
      async: false,
      sync: true,
    },
  ],
  [
    "passport",
    {
      displayName: "Passport",
      docClass: PassportV1,
      fullText: false,
      async: false,
      sync: true,
    },
  ],
  [
    "financial",
    {
      displayName: "Financial Document",
      docClass: FinancialDocumentV1,
      fullText: true,
      async: false,
      sync: true,
    },
  ],
  [
    "fr-id-card",
    {
      displayName: "FR ID Card",
      docClass: fr.IdCardV1,
      fullText: false,
      async: false,
      sync: true,
    },
  ],
  [
    "fr-bank-account-details",
    {
      displayName: "FR Bank Account Details",
      docClass: fr.BankAccountDetailsV1,
      fullText: false,
      async: false,
      sync: true,
    },
  ],
  [
    "fr-carte-vitale",
    {
      displayName: "FR Carte Vitale",
      docClass: fr.CarteVitaleV1,
      fullText: false,
      async: false,
      sync: true,
    },
  ],
  [
    "eu-license-plate",
    {
      displayName: "EU License Plate",
      docClass: eu.LicensePlateV1,
      fullText: false,
      async: false,
      sync: true,
    },
  ],
  [
    "us-bank-check",
    {
      displayName: "US Bank Check",
      docClass: us.BankCheckV1,
      fullText: false,
      async: false,
      sync: true,
    },
  ],
  [
    "mvision",
    {
      displayName: "Mindee Vision",
      docClass: MindeeVisionV1,
      fullText: false,
      async: false,
      sync: true,
    },
  ],
]);

//
// EXECUTE THE COMMANDS
//

function initClient(command: string, options: OptionValues): Client {
  const mindeeClient = new Client({
    apiKey: options.apiKey,
    debug: options.debug,
  });
  if (command === COMMAND_CUSTOM) {
    mindeeClient.addEndpoint({
      accountName: options.user,
      endpointName: options.documentType,
    });
  }
  return mindeeClient;
}

function getConfig(command: string): ProductConfig {
  const conf = CLI_COMMAND_CONFIG.get(command);
  if (conf === undefined) {
    throw new Error(`Invalid document type ${command}`);
  }
  return conf;
}

function getPredictParams(command: string, options: any, conf: ProductConfig) {
  let pageOptions: PageOptions | undefined = undefined;
  if (options.cutPages) {
    pageOptions = {
      operation: PageOptionsOperation.KeepOnly,
      pageIndexes: [0, 1, 2, 3, 4],
      onMinPages: 5,
    };
  }
  const predictParams: PredictOptions = {
    endpointName:
      command === COMMAND_CUSTOM ? options.documentType : conf.docClass.name,
    accountName: command === COMMAND_CUSTOM ? options.user : STANDARD_API_OWNER,
    fullText: options.fullText,
    pageOptions: pageOptions,
  };
  return predictParams;
}

async function callParse(command: string, inputPath: string, options: any) {
  const conf = getConfig(command);
  const mindeeClient = initClient(command, options);
  const predictParams = getPredictParams(command, options, conf);
  const doc = mindeeClient.docFromPath(inputPath);
  const response = await doc.parse(conf.docClass, predictParams);
  printResponse(response, options);
}

async function callEnqueue(command: string, inputPath: string, options: any) {
  const conf = getConfig(command);
  const mindeeClient = initClient(command, options);
  const predictParams = getPredictParams(command, options, conf);
  const doc = mindeeClient.docFromPath(inputPath);
  const response = await doc.enqueue(conf.docClass, predictParams);
  console.log(response.job);
}

async function callParseQueued(command: string, queueId: string, options: any) {
  const conf = getConfig(command);
  const mindeeClient = initClient(command, options);
  const predictParams = getPredictParams(command, options, conf);
  const doc = mindeeClient.docForAsync();

  const response = await doc.parseQueued(conf.docClass, queueId, predictParams);

  if (response.document !== undefined) {
    printResponse(response.document, options);
  } else {
    console.log(response.job);
  }
}

function printResponse(response: Response<Document>, options: any) {
  if (options.fullText) {
    response.pages.forEach((page) => {
      console.log(page.fullText?.toString());
    });
  }
  if (options.pages) {
    response.pages.forEach((page) => {
      console.log(`\n${page}`);
    });
  }
  if (response.document) {
    console.log(`\n${response.document}`);
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
  if (info.fullText) {
    prog.option("-t, --full-text", "include full document text in response");
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
