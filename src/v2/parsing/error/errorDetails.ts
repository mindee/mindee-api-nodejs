import { ErrorItem } from "./errorItem.js";

/** Structured error payload returned by v2 APIs. */
export interface ErrorDetails {
  /**
   * The HTTP status code returned by the server.
   */
  status: number;
  /**
   * A human-readable explanation specific to the occurrence of the problem.
   */
  detail: string;
  /**
   * A short, human-readable summary of the problem.
   */
  title: string;
  /**
   * A machine-readable code specific to the occurrence of the problem.
   */
  code: string;
  /**
   * A list of explicit error details.
   */
  errors: ErrorItem[];
}
