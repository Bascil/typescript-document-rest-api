import { Context, Next } from "koa";
import { CustomError } from "../errors/custom-error";

export async function errorHandler(ctx: Context, next: Next): Promise<void> {
  try {
    await next();
  } catch (error) {
    handleAppError(ctx, error);
  }
}

function handleAppError(ctx: Context, error: any) {
  let statusCode = 500;
  let errorMessage = "Something went wrong";

  if (error instanceof CustomError) {
    statusCode = error.statusCode;
    errorMessage = error.message;
  }

  ctx.status = statusCode;
  ctx.body = {
    errors: [
      {
        message: errorMessage,
        status: error.statusCode,
      },
    ],
  };
}
