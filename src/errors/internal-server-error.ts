import { CustomError } from "./custom-error";

export class InternalServerError extends CustomError {
  constructor(message: string = "Something went wrong") {
    super(message, 500);
  }
}
