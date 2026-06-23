import { Command } from "commander";
import { ExtractionCommand } from "./v2/extractionCommand.js";
import { ClassificationCommand } from "./v2/classificationCommand.js";
import { CropCommand } from "./v2/cropCommand.js";
import { OcrCommand } from "./v2/ocrCommand.js";
import { SplitCommand } from "./v2/splitCommand.js";
import { buildAllV1Commands } from "./v1/predictCommands.js";

/**
 * Build the root `mindee` command line.
 *
 * The shape mirrors the canonical `.NET` CLI
 * (`mindee-api-dotnet/src/Mindee.Cli`):
 * - V2 product commands are top-level (`extraction`, `classification`,
 *   `crop`, `ocr`, `split`).
 * - V1 product commands live under the `v1` sub-command.
 */
export function buildCli(): Command {
  const program = new Command();
  program
    .name("mindee")
    .description("Command line interface for Mindee products.")
    .option("--verbose", "Enables diagnostics output.");

  // V2 top-level commands
  program.addCommand(new ExtractionCommand());
  program.addCommand(new ClassificationCommand());
  program.addCommand(new CropCommand());
  program.addCommand(new OcrCommand());
  program.addCommand(new SplitCommand());

  // V1 commands grouped under `v1`
  const v1 = new Command("v1").description("Mindee V1 product commands.");
  for (const cmd of buildAllV1Commands()) {
    v1.addCommand(cmd);
  }
  program.addCommand(v1);

  return program;
}

/**
 * Entry point for the `mindee` binary.
 *
 * Parses `process.argv` and dispatches to the matching command.
 */
export function cli(argv: string[] = process.argv): Promise<Command> {
  return buildCli().parseAsync(argv);
}
