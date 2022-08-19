import { Command } from "commander";
import { Client } from "./index";
import {
  DOC_TYPE_INVOICE,
  DOC_TYPE_RECEIPT,
  DOC_TYPE_PASSPORT,
  DOC_TYPE_FINANCIAL,
  Document,
} from "./documents";
import {
  Response,
  FinancialResponse,
  InvoiceResponse,
  PassportResponse,
  ReceiptResponse,
  CustomResponse,
} from "./api";

const program = new Command();

interface OtsCliConfig {
  help: string;
  docType: string;
  responseClass: typeof Response<Document>;
  fullText: boolean;
}

const COMMAND_INVOICE = "invoice";
const COMMAND_RECEIPT = "receipt";
const COMMAND_PASSPORT = "passport";
const COMMAND_FINANCIAL = "financial";
const COMMAND_CUSTOM = "custom";

const OTS_DOCUMENTS = new Map<string, OtsCliConfig>([
  [
    COMMAND_INVOICE,
    {
      help: "Invoice",
      docType: DOC_TYPE_INVOICE,
      responseClass: InvoiceResponse,
      fullText: true,
    },
  ],
  [
    COMMAND_RECEIPT,
    {
      help: "Expense Receipt",
      docType: DOC_TYPE_RECEIPT,
      responseClass: ReceiptResponse,
      fullText: true,
    },
  ],
  [
    COMMAND_PASSPORT,
    {
      help: "Passport",
      docType: DOC_TYPE_PASSPORT,
      responseClass: PassportResponse,
      fullText: false,
    },
  ],
  [
    COMMAND_FINANCIAL,
    {
      help: "Financial Document (receipt or invoice)",
      docType: DOC_TYPE_FINANCIAL,
      responseClass: FinancialResponse,
      fullText: true,
    },
  ],
  [
    COMMAND_CUSTOM,
    {
      help: "A custom document",
      docType: "",
      responseClass: CustomResponse,
      fullText: false,
    },
  ],
]);

async function predictCall(command: string, inputPath: string, options: any) {
  const info = OTS_DOCUMENTS.get(command);
  if (!info) {
    throw new Error(`Invalid document type ${command}`);
  }
  const mindeeClient = new Client({
    apiKey: options.apiKey,
    debug: options.verbose,
  });
  switch (command) {
    case COMMAND_INVOICE: {
      mindeeClient.configInvoice();
      break;
    }
    case COMMAND_RECEIPT: {
      mindeeClient.configReceipt();
      break;
    }
    case COMMAND_PASSPORT: {
      mindeeClient.configPassport();
      break;
    }
    case COMMAND_FINANCIAL: {
      mindeeClient.configFinancialDoc();
      break;
    }
    case COMMAND_CUSTOM: {
      mindeeClient.addEndpoint({
        accountName: options.user,
        endpointName: options.documentType,
      });
      break;
    }
  }
  const doc = mindeeClient.docFromPath(inputPath);
  const result = await doc.parse(info.responseClass, {
    docType: info.docType || options.documentType,
    username: options.user || "mindee",
    cutPages: options.cutPages,
    fullText: options.fullText,
  });
  if (result.document) {
    console.log(`\n${result.document}`);
  }
}

export function cli() {
  program.name("mindee");
  program.option("-v, --verbose", "high verbosity mode");

  OTS_DOCUMENTS.forEach((info, name) => {
    const prog = program.command(name);
    prog.description(info.help);

    prog.option("-k, --api-key <api_key>", "API key for document endpoint");
    prog.option("-C, --no-cut-pages", "Don't cut document pages");
    if (info.fullText) {
      prog.option("-t, --full-text", "Include full document text in response");
    }
    if (name === COMMAND_CUSTOM) {
      prog.requiredOption(
        "-u, --user <username>",
        "API account name for the endpoint"
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
            endpointName: endpointName,
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
