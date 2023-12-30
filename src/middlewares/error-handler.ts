import { Context, Next } from "koa";
import { CustomError } from "../errors/custom-error";

export async function errorHandler(ctx: Context, next: Next): Promise<void> {
  try {
    await next();
  } catch (error) {
    if (error instanceof CustomError) {
      // Handle your custom error
      ctx.status = error.statusCode || 500;
      ctx.body = { error: error.message };
    } else {
      // Handle other unexpected errors
      ctx.status = 500;
      ctx.body = { error: "Internal Server Error" };
    }
  }
}
