// src/errors/MultipleErrorsError.ts

import { CustomError } from "./custom-error";

export class DatabaseError extends CustomError {
  constructor(message: string = "Database error") {
    super(message, 500);
  }
}
