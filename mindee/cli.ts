import { Command } from "commander";
import { Client } from "./index";

const program = new Command();

interface OtsCliConfig {
  help: string;
  requiredKeys: Array<string>;
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
      requiredKeys: ["invoice"],
      docType: "invoice",
    },
  ],
  [
    COMMAND_RECEIPT,
    {
      help: "Expense Receipt",
      requiredKeys: ["receipt"],
      docType: "receipt",
    },
  ],
  [
    COMMAND_PASSPORT,
    {
      help: "Passport",
      requiredKeys: ["passport"],
      docType: "passport",
    },
  ],
  [
    COMMAND_FINANCIAL,
    {
      help: "Financial Document (receipt or invoice)",
      requiredKeys: ["invoice", "receipt"],
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
      mindeeClient.configInvoice(options.invoiceKey);
      break;
    }
    case COMMAND_RECEIPT: {
      mindeeClient.configReceipt(options.receiptKey);
      break;
    }
    case COMMAND_PASSPORT: {
      mindeeClient.configPassport(options.passportKey);
      break;
    }
    case COMMAND_FINANCIAL: {
      mindeeClient.configFinancialDoc(options.invoiceKey, options.receiptKey);
      break;
    }
    default: {
      throw new Error(`Invalid document type ${command}`);
    }
  }
  const doc = mindeeClient.docFromPath(inputPath);
  const result = await doc.parse(
    {
      documentType: info.docType,
      username: undefined,
    },
    {
      cutPages: options.cutPages,
      fullText: options.fullText,
    }
  );
  if (result.document) {
    console.log(`\n${result.document}`);
  }
}

export function cli() {
  program.name("mindee");

  OTS_DOCUMENTS.forEach((info, name) => {
    const prog = program.command(name);
    prog.description(info.help);

    info.requiredKeys.forEach((keyName) => {
      prog.option(
        `--${keyName}-key <${keyName}>`,
        `API key for ${keyName} document endpoint`
      );
    });
    prog.option("-C, --no-cut-pages", "Don't cut document pages");
    prog.option("-t, --full-text", "Include full document text in response");
    prog.argument("<input_path>", "Full path to the file");
    prog.action((inputPath: string, options: any, command: any) => {
      predictCall(command.name(), inputPath, options);
    });
  });
  program.parse(process.argv);
}
