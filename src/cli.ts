import { Command } from "commander";
import { Client } from "./index";

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
      docType: "invoice",
    },
  ],
  [
    COMMAND_RECEIPT,
    {
      help: "Expense Receipt",
      docType: "receipt",
    },
  ],
  [
    COMMAND_PASSPORT,
    {
      help: "Passport",
      docType: "passport",
    },
  ],
  [
    COMMAND_FINANCIAL,
    {
      help: "Financial Document (receipt or invoice)",
      docType: "financialDoc",
    },
  ],
]);

async function predictCall(command: string, inputPath: string, options: any) {
  const info = OTS_DOCUMENTS.get(command);
  const mindeeClient = new Client();
  if (!info) {
    throw new Error(`Invalid document type ${command}`);
  }
  switch (info.docType) {
    case COMMAND_INVOICE: {
      mindeeClient.configInvoice(options.apiKey);
      break;
    }
    case COMMAND_RECEIPT: {
      mindeeClient.configReceipt(options.apiKey);
      break;
    }
    case COMMAND_PASSPORT: {
      mindeeClient.configPassport(options.apiKey);
      break;
    }
    case COMMAND_FINANCIAL: {
      mindeeClient.configFinancialDoc(options.apiKey);
      break;
    }
    default: {
      throw new Error(`Invalid document type ${command}`);
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

  OTS_DOCUMENTS.forEach((info, name) => {
    const prog = program.command(name);
    prog.description(info.help);

    prog.option("-k, --api-key", "API key for document endpoint");
    prog.option("-C, --no-cut-pages", "Don't cut document pages");
    prog.option("-t, --full-text", "Include full document text in response");
    prog.argument("<input_path>", "Full path to the file");
    prog.action((inputPath: string, options: any, command: any) => {
      predictCall(command.name(), inputPath, options);
    });
  });
  program.parse(process.argv);
}
