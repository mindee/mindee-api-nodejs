import { ApiResponse } from "./apiResponse";
import { Document, StringDict } from ".";
import { Response } from "../../http/documentResponse";

export class ApiRequest {
  error: StringDict;
  resources: string[];
  status: "failure" | "success";
  /** HTTP status code */
  statusCode: number;
  url: string;

  constructor(serverResponse: StringDict) {
    this.error = serverResponse["error"];
    this.resources = serverResponse["resources"];
    this.status = serverResponse["status"];
    this.statusCode = serverResponse["status_code"];
    this.url = serverResponse["url"];
  }
}