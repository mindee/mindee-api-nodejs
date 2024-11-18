import { StringDict } from "./stringDict";

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