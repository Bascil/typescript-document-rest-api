// src/errors/MultipleErrorsError.ts

import { CustomError } from "./custom-error";

interface ValidationErrorItem {
  field: string;
  message: string;
}

export class BadRequestError extends CustomError {
  public readonly errors: ValidationErrorItem[];

  constructor(message: string, errors: ValidationErrorItem[]) {
    super(message, 422); // Set a default status code for validation errors
    this.errors = errors;
  }
}
