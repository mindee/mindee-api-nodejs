import { Command } from "commander";
import { Client } from "./index";
import {
  DOC_TYPE_INVOICE,
  DOC_TYPE_RECEIPT,
  DOC_TYPE_PASSPORT,
  DOC_TYPE_FINANCIAL,
} from "./documents";

const program = new Command();

interface OtsCliConfig {
  help: string;
  docType: string;
}

const COMMAND_INVOICE = "invoice";
const COMMAND_RECEIPT = "receipt";
const COMMAND_PASSPORT = "passport";
const COMMAND_FINANCIAL = "financial";

const OTS_DOCUMENTS = new Map<string, OtsCliConfig>([
  [
    COMMAND_INVOICE,
    {
      help: "Invoice",
      docType: DOC_TYPE_INVOICE,
    },
  ],
  [
    COMMAND_RECEIPT,
    {
      help: "Expense Receipt",
      docType: DOC_TYPE_RECEIPT,
    },
  ],
  [
    COMMAND_PASSPORT,
    {
      help: "Passport",
      docType: DOC_TYPE_PASSPORT,
    },
  ],
  [
    COMMAND_FINANCIAL,
    {
      help: "Financial Document (receipt or invoice)",
      docType: DOC_TYPE_FINANCIAL,
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
  switch (info.docType) {
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
  }
  const doc = mindeeClient.docFromPath(inputPath);
  const result = await doc.parse(info.docType, {
    username: undefined,
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

    prog.option("-k, --api-key", "API key for document endpoint");
    prog.option("-C, --no-cut-pages", "Don't cut document pages");
    prog.option("-t, --full-text", "Include full document text in response");
    prog.argument("<input_path>", "Full path to the file");
    prog.action((inputPath: string, options: any, command: any) => {
      const allOptions = {
        ...program.opts(),
        ...options,
      };
      predictCall(command.name(), inputPath, allOptions);
    });
  });
  program.parse(process.argv);
}
