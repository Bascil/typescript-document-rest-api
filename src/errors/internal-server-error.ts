import { CustomError } from "./custom-error";

export class InternalServerError extends CustomError {
  constructor(message: string = "Something went wrong") {
    super(message, 500); // 500 is the HTTP status code for Bad Request
  }
}
