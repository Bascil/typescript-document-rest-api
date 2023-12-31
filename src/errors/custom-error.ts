export class CustomError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);

    // extend built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
