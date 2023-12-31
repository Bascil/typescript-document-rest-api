import Koa from "koa";
import bodyParser from "koa-bodyparser";
import json from "koa-json";

import { documentRoutes } from "./routes/document.routes";
import { errorHandler } from "./middlewares/error-handler";

const app = new Koa();

// Koa middleware
app.use(bodyParser());

// Use koa-json middleware for pretty-printed JSON responses
app.use(json());

// error handler
app.use(errorHandler);

// Use routes
app.use(documentRoutes.routes());
app.use(documentRoutes.allowedMethods());

export default app;
