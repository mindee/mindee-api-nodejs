import { OptionValues } from "commander";
import { PredictCommand, InferenceClass } from "./predictCommand.js";
import { Client as ClientV1 } from "@/v1/client.js";
import * as product from "@/v1/product/index.js";
import { Inference } from "@/v1/parsing/common/index.js";

/**
 * V1 predict commands.
 *
 * Each product owns its own subclass. The mix of available flags
 * (`--all-words`, `--full-text`, `--async`) is composed via direct calls
 * to the helper methods provided by `PredictCommand`, instead of being
 * driven by a shared configuration class.
 */

// ----- Synchronous-only products -----

export class BarcodeReaderCommand extends PredictCommand<product.barcodeReader.BarcodeReaderV1> {
  constructor() {
    super("barcode-reader", "Barcode Reader");
  }
  protected get inferenceClass(): InferenceClass<product.barcodeReader.BarcodeReaderV1> {
    return product.BarcodeReaderV1;
  }
}

export class CropperCommand extends PredictCommand<product.cropper.CropperV1> {
  constructor() {
    super("cropper", "Cropper");
  }
  protected get inferenceClass(): InferenceClass<product.cropper.CropperV1> {
    return product.CropperV1;
  }
}

export class FrBankAccountDetailsCommand extends PredictCommand<product.fr.bankAccountDetails.BankAccountDetailsV2> {
  constructor() {
    super("fr-bank-account-details", "FR Bank Account Details");
  }
  protected get inferenceClass(): InferenceClass<product.fr.bankAccountDetails.BankAccountDetailsV2> {
    return product.fr.BankAccountDetailsV2;
  }
}

export class FrCarteGriseCommand extends PredictCommand<product.fr.CarteGriseV1> {
  constructor() {
    super("fr-carte-grise", "FR Carte Grise");
  }
  protected get inferenceClass(): InferenceClass<product.fr.CarteGriseV1> {
    return product.fr.CarteGriseV1;
  }
}

export class FrIdCardCommand extends PredictCommand<product.fr.idCard.IdCardV2> {
  constructor() {
    super("fr-carte-nationale-d-identite", "FR Carte Nationale d'Identité");
  }
  protected get inferenceClass(): InferenceClass<product.fr.idCard.IdCardV2> {
    return product.fr.IdCardV2;
  }
}

type MultiReceiptsDetectorV1 = product.multiReceiptsDetector.MultiReceiptsDetectorV1;

export class MultiReceiptsDetectorCommand extends PredictCommand<MultiReceiptsDetectorV1> {
  constructor() {
    super("multi-receipts-detector", "Multi Receipts Detector");
  }
  protected get inferenceClass(): InferenceClass<MultiReceiptsDetectorV1> {
    return product.MultiReceiptsDetectorV1;
  }
}

export class PassportCommand extends PredictCommand<product.passport.PassportV1> {
  constructor() {
    super("passport", "Passport");
  }
  protected get inferenceClass(): InferenceClass<product.passport.PassportV1> {
    return product.PassportV1;
  }
}

export class UsBankCheckCommand extends PredictCommand<product.us.BankCheckV1> {
  constructor() {
    super("us-bank-check", "US Bank Check");
  }
  protected get inferenceClass(): InferenceClass<product.us.BankCheckV1> {
    return product.us.BankCheckV1;
  }
}

// ----- Asynchronous-only products -----

abstract class AsyncOnlyCommand<T extends Inference> extends PredictCommand<T> {
  protected isAsync(): boolean {
    return true;
  }
}

export class DriverLicenseCommand extends AsyncOnlyCommand<product.driverLicense.DriverLicenseV1> {
  constructor() {
    super("driver-license", "Driver License");
  }
  protected get inferenceClass(): InferenceClass<product.driverLicense.DriverLicenseV1> {
    return product.DriverLicenseV1;
  }
}

export class InternationalIdCommand extends AsyncOnlyCommand<product.internationalId.InternationalIdV2> {
  constructor() {
    super("international-id", "International ID");
    this.addFullTextOption();
  }
  protected get supportsFullText(): boolean {
    return true;
  }
  protected get inferenceClass(): InferenceClass<product.internationalId.InternationalIdV2> {
    return product.InternationalIdV2;
  }
}

export class InvoiceSplitterCommand extends AsyncOnlyCommand<product.invoiceSplitter.InvoiceSplitterV1> {
  constructor() {
    super("invoice-splitter", "Invoice Splitter");
    this.addFullTextOption();
  }
  protected get supportsFullText(): boolean {
    return true;
  }
  protected get inferenceClass(): InferenceClass<product.invoiceSplitter.InvoiceSplitterV1> {
    return product.InvoiceSplitterV1;
  }
}

export class ResumeCommand extends AsyncOnlyCommand<product.resume.ResumeV1> {
  constructor() {
    super("resume", "Resume");
  }
  protected get inferenceClass(): InferenceClass<product.resume.ResumeV1> {
    return product.ResumeV1;
  }
}

// ----- Products supporting both sync and async -----

abstract class SyncAndAsyncCommand<T extends Inference> extends PredictCommand<T> {
  constructor(name: string, description: string) {
    super(name, description);
  }
  protected addProductOptions(): void {
    this.addAsyncOption();
  }
}

export class FinancialDocumentCommand extends SyncAndAsyncCommand<product.financialDocument.FinancialDocumentV1> {
  constructor() {
    super("financial-document", "Financial Document");
    this.addAllWordsOption();
    this.addFullTextOption();
  }
  protected get supportsAllWords(): boolean {
    return true;
  }
  protected get supportsFullText(): boolean {
    return true;
  }
  protected get inferenceClass(): InferenceClass<product.financialDocument.FinancialDocumentV1> {
    return product.FinancialDocumentV1;
  }
}

export class InvoiceCommand extends SyncAndAsyncCommand<product.invoice.InvoiceV4> {
  constructor() {
    super("invoice", "Invoice");
    this.addAllWordsOption();
    this.addFullTextOption();
  }
  protected get supportsAllWords(): boolean {
    return true;
  }
  protected get supportsFullText(): boolean {
    return true;
  }
  protected get inferenceClass(): InferenceClass<product.invoice.InvoiceV4> {
    return product.InvoiceV4;
  }
}

export class ReceiptCommand extends SyncAndAsyncCommand<product.receipt.ReceiptV5> {
  constructor() {
    super("receipt", "Receipt");
    this.addAllWordsOption();
    this.addFullTextOption();
  }
  protected get supportsAllWords(): boolean {
    return true;
  }
  protected get supportsFullText(): boolean {
    return true;
  }
  protected get inferenceClass(): InferenceClass<product.receipt.ReceiptV5> {
    return product.ReceiptV5;
  }
}

// ----- Generated custom endpoint -----

export class GeneratedCommand extends PredictCommand<product.generated.GeneratedV1> {
  constructor() {
    super("generated", "Generated Document");
    this.addAllWordsOption();
    this.addAsyncOption();
    this.requiredOption("-e, --endpoint <endpoint_name>", "API endpoint name (required)");
    this.requiredOption("-a, --account <account_name>", "API account name for the endpoint (required)");
    this.option("--endpoint-version <version>", "Endpoint version (defaults to the latest)");
  }
  protected get supportsAllWords(): boolean {
    return true;
  }
  protected get inferenceClass(): InferenceClass<product.generated.GeneratedV1> {
    return product.GeneratedV1;
  }
  protected isAsync(options: OptionValues): boolean {
    return options.async === true;
  }
  protected extraPredictOptions(client: ClientV1, options: OptionValues) {
    return {
      endpoint: client.createEndpoint(
        options.endpoint as string,
        options.account as string,
        options.endpointVersion as string | undefined
      ),
    };
  }
}

/**
 * Builds an instance of every V1 predict command.
 */
export function buildAllV1Commands(): PredictCommand<Inference>[] {
  return [
    new BarcodeReaderCommand(),
    new CropperCommand(),
    new DriverLicenseCommand(),
    new FinancialDocumentCommand(),
    new FrBankAccountDetailsCommand(),
    new FrCarteGriseCommand(),
    new FrIdCardCommand(),
    new GeneratedCommand(),
    new InternationalIdCommand(),
    new InvoiceCommand(),
    new InvoiceSplitterCommand(),
    new MultiReceiptsDetectorCommand(),
    new PassportCommand(),
    new ReceiptCommand(),
    new ResumeCommand(),
    new UsBankCheckCommand(),
  ];
}
