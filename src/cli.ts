import { Command } from "commander";
import {
  Document,
  DocumentSig,
  InvoiceV4,
  InvoiceSplitterV1,
  ReceiptV4,
  FinancialDocumentV1,
  PassportV1,
  MindeeVisionV1,
  CustomV1,
  fr,
  us,
  eu,
  ShippingContainerV1,
} from "./documents";

import { STANDARD_API_OWNER } from "./api";
import { Client, PredictOptions } from "./client";
import { PageOptions, PageOptionsOperation } from "./inputs";

const program = new Command();

const COMMAND_CUSTOM = "custom";

interface ProductConfig {
  description: string;
  docClass: DocumentSig<Document>;
  fullText: boolean;
}

// The Map's key is the command name as it will appear on the console.
//
const CLI_COMMAND_CONFIG = new Map<string, ProductConfig>([
  [
    COMMAND_CUSTOM,
    {
      description: "A custom document",
      docClass: CustomV1,
      fullText: false,
    },
  ],
  [
    "invoice",
    {
      description: "Invoice",
      docClass: InvoiceV4,
      fullText: true,
    },
  ],
  [
    "invoice-splitter",
    {
      description: "Invoice Splitter",
      docClass: InvoiceSplitterV1,
      fullText: false,
    },
  ],
  [
    "receipt",
    {
      description: "Expense Receipt",
      docClass: ReceiptV4,
      fullText: true,
    },
  ],
  [
    "passport",
    {
      description: "Passport",
      docClass: PassportV1,
      fullText: false,
    },
  ],
  [
    "financial",
    {
      description: "Financial Document (receipt or invoice)",
      docClass: FinancialDocumentV1,
      fullText: true,
    },
  ],
  [
    "fr-id-card",
    {
      description: "FR ID Card",
      docClass: fr.IdCardV1,
      fullText: false,
    },
  ],
  [
    "fr-bank-account-details",
    {
      description: "FR Bank Account Details",
      docClass: fr.BankAccountDetailsV1,
      fullText: false,
    },
  ],
  [
    "fr-carte-vitale",
    {
      description: "FR Carte Vitale",
      docClass: fr.CarteVitaleV1,
      fullText: false,
    },
  ],
  [
    "eu-license-plate",
    {
      description: "EU License Plate",
      docClass: eu.LicensePlateV1,
      fullText: false,
    },
  ],
  [
    "us-bank-check",
    {
      description: "US Bank Check",
      docClass: us.BankCheckV1,
      fullText: false,
    },
  ],
  [
    "shipping-container",
    {
      description: "Shipping Container",
      docClass: ShippingContainerV1,
      fullText: false,
    },
  ],
  [
    "mvision",
    {
      description: "Mindee Vision",
      docClass: MindeeVisionV1,
      fullText: false,
    },
  ],
]);

async function predictCall(command: string, inputPath: string, options: any) {
  const conf = CLI_COMMAND_CONFIG.get(command);
  if (conf === undefined) {
    throw new Error(`Invalid document type ${command}`);
  }
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
  const doc = mindeeClient.docFromPath(inputPath);

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

  const response = await doc.parse(conf.docClass, predictParams);

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

export function cli() {
  program.name("mindee");
  program.option("-d, --debug", "high verbosity mode");

  CLI_COMMAND_CONFIG.forEach((info, name) => {
    const prog = program.command(name);
    prog.description(info.description);

    prog.option("-k, --api-key <api_key>", "API key for document endpoint");
    prog.option(
      "-c, --cut-pages",
      "Keep only the first 5 pages of the document."
    );
    prog.option("-p, --pages", "Show pages content");
    if (info.fullText) {
      prog.option("-t, --full-text", "Include full document text in response");
    }
    if (name === COMMAND_CUSTOM) {
      prog.requiredOption(
        "-u, --user <username>",
        "API account name for the endpoint"
      );
      prog.option(
        "-v, --version <version>",
        "Version for the endpoint, use the latest version if not specified."
      );
      prog.argument("<endpoint_name>", "API endpoint name");
    }
    prog.argument("<input_path>", "Full path to the file");
    if (name === COMMAND_CUSTOM) {
      prog.action(
        (
          endpointName: string,
          inputPath: string,
          options: any,
          command: any
        ) => {
          const allOptions = {
            ...program.opts(),
            ...options,
            documentType: endpointName,
          };
          predictCall(command.name(), inputPath, allOptions);
        }
      );
    } else {
      prog.action((inputPath: string, options: any, command: any) => {
        const allOptions = {
          ...program.opts(),
          ...options,
          endpointName: undefined,
        };
        predictCall(command.name(), inputPath, allOptions);
      });
    }
  });
  program.parse(process.argv);
}
