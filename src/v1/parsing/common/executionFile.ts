import { StringDict } from "@/parsing/stringDict.js";

/**
 * Representation of an execution's file info.
 * @category Workflow
 */
export class ExecutionFile {

  /** File name. */
  name: string|null;

  /** Optional alias for the fil. */
  alias: string|null;

  constructor(jsonResponse: StringDict) {
    this.name = jsonResponse["name"];
    this.alias = jsonResponse["alias"];
  }
}
