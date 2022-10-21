import { Command } from "commander";
import {
  DOC_TYPE_INVOICE_V3,
  DOC_TYPE_RECEIPT_V3,
  DOC_TYPE_PASSPORT_V1,
  DOC_TYPE_FINANCIAL_V1,
  DOC_TYPE_CUSTOM,
} from "./documents";
import {
  CustomResponse,
  FinancialDocV1Response,
  InvoiceV3Response,
  PassportV1Response,
  ReceiptV3Response,
  STANDARD_API_OWNER,
} from "./api";
import { Client } from "./client";
import { ProductConfigs, ProductConfig } from "./constants";

const program = new Command();

const COMMAND_INVOICE = "invoice";
const COMMAND_RECEIPT = "receipt";
const COMMAND_PASSPORT = "passport";
const COMMAND_FINANCIAL = "financial";
const COMMAND_CUSTOM = "custom";

const CLI_COMMAND_CONFIG = new Map<string, ProductConfig>([
  [COMMAND_INVOICE, ProductConfigs.getByDocType(DOC_TYPE_INVOICE_V3)],
  [COMMAND_RECEIPT, ProductConfigs.getByDocType(DOC_TYPE_RECEIPT_V3)],
  [COMMAND_PASSPORT, ProductConfigs.getByDocType(DOC_TYPE_PASSPORT_V1)],
  [COMMAND_FINANCIAL, ProductConfigs.getByDocType(DOC_TYPE_FINANCIAL_V1)],
  [COMMAND_CUSTOM, ProductConfigs.getByDocType(DOC_TYPE_CUSTOM)],
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
  const predictParams = {
    docType: command === COMMAND_CUSTOM ? options.documentType : conf.docType,
    username: command === COMMAND_CUSTOM ? options.user : STANDARD_API_OWNER,
    cutPages: options.cutPages,
    fullText: options.fullText,
  };
  // Tried setting the response by using the responseClass property in constants.PRODUCTS_CONFIG
  // This compiled, but threw an exception:
  //   TypeError: responseType is not a constructor
  //
  // So using a switch to explicitly set the response class parameter. Ugly, but works.
  // Improvements welcome!
  let response;
  switch (command) {
    case COMMAND_INVOICE:
      response = await doc.parse(InvoiceV3Response, predictParams);
      break;
    case COMMAND_RECEIPT:
      response = await doc.parse(ReceiptV3Response, predictParams);
      break;
    case COMMAND_FINANCIAL:
      response = await doc.parse(FinancialDocV1Response, predictParams);
      break;
    case COMMAND_PASSPORT:
      response = await doc.parse(PassportV1Response, predictParams);
      break;
    case COMMAND_CUSTOM:
      response = await doc.parse(CustomResponse, predictParams);
      break;
    default:
      throw `Unhandled command: ${command}`;
  }
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
    prog.option("-C, --no-cut-pages", "Don't cut document pages");
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
