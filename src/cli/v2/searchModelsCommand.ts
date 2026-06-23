import { Command, Option, OptionValues } from "commander";
import { Client as ClientV2 } from "@/v2/client.js";
import { SearchResponse } from "@/v2/parsing/index.js";

const MODEL_TYPES = ["extraction", "crop", "classification", "ocr", "split"] as const;

/**
 * CLI command for the `v2/search/models` endpoint.
 *
 * Mirrors the canonical `.NET` `SearchModelsCommand`. Exposes the same
 * flag set: `--name/-n`, `--model-type/-m`, `--raw-json/-r`,
 * `--api-key/-k`.
 */
export class SearchModelsCommand extends Command {
  constructor() {
    super("search-models");
    this.description("Search available models.");
    this.option("-k, --api-key <api_key>", "Mindee V2 API key");
    this.option(
      "-n, --name <name>",
      "Filter by model name partial match (case insensitive)."
    );
    this.addOption(
      new Option(
        "-m, --model-type <type>",
        "Filter by exact model type (case sensitive). " +
        `Available options: ${MODEL_TYPES.join(", ")}.`
      )
    );
    this.option(
      "-r, --raw-json",
      "Output the raw JSON response.",
      false
    );

    this.action(async (options: OptionValues, command: Command) => {
      await this.run(this.mergeOptions(command, options));
    });
  }

  private mergeOptions(command: Command, options: OptionValues): OptionValues {
    let merged: OptionValues = { ...options };
    let cursor: Command | null = command.parent;
    while (cursor) {
      merged = { ...cursor.opts(), ...merged };
      cursor = cursor.parent;
    }
    return merged;
  }

  private async run(options: OptionValues): Promise<void> {
    const client = new ClientV2({
      apiKey: options.apiKey,
      debug: options.verbose,
    });
    const response: SearchResponse = await client.searchModels(
      options.name as string | undefined,
      options.modelType as string | undefined
    );
    if (options.rawJson) {
      console.log(JSON.stringify(response.getRawHttp(), null, 2));
    } else {
      console.log(response.toString());
    }
  }
}
