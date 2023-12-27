import { Context, Next } from "koa";

export function validator(schema: any) {
  // Return the actual middleware function
  return async function (ctx: Context, next: Next): Promise<void> {
    const { error } = schema.validate(ctx.request.body);
    const valid = error == null;
    if (valid) {
      await next();
    } else {
      const { details } = error;
      const message = details.map((i: any) => i.message).join(",");
      const field = details.map((i: any) => i.path).join(",");

      ctx.status = 422;
      ctx.body = {
        errors: [{ message: message.replace(/['"]+/g, ""), field }],
      };
    }
  };
}
