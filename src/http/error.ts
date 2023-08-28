import { errorHandler } from "../errors/handler";
import { EndpointResponse } from "./endpoint";

export function handleError(
  url: string,
  response: EndpointResponse,
  statusCode?: number
) {
  const errorMessage = JSON.stringify(response.data, null, 2);
  errorHandler.throw(
    new Error(`${url} API ${statusCode} HTTP error: ${errorMessage}`)
  );
}

export class MindeeHttpError413 {

}

export class MindeeHttpError400 {
  
}
