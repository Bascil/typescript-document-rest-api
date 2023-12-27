import Router from "koa-router";
import { DocumentController } from "../controllers/document.controller";
import { DocumentSchema } from "../schemas/document.schema";
import { validator } from "../middlewares/validator";

declare module "koa" {
  interface Request {
    body?: any;
    rawBody: string;
  }
}

const router = new Router();
router.prefix(`/api/v1`);

router.get("/documents", DocumentController.getAllDocuments);

router.post(
  "/documents",
  validator(DocumentSchema.createDocument),
  DocumentController.createDocument
);

export { router as documentRoutes };
