import Router from "koa-router";
import { DocumentController } from "../controllers/document.controller";
import { DocumentSchema } from "../schemas/document.schema";
import { validator } from "../middlewares/validator";
import { config } from "../config";

declare module "koa" {
  interface Request {
    body?: any;
    rawBody: string;
  }
}

const router = new Router();
router.prefix(config.apiVersion);

// content serving apis
router.get("/documents", DocumentController.getAllDocuments);
router.get("/documents/:id/:state?", DocumentController.getOneDocument);

// editor apis
router.post(
  "/documents",
  validator(DocumentSchema.createDocument),
  DocumentController.createDocument
);

router.put(
  "/documents/:id",
  validator(DocumentSchema.updateDocument),
  DocumentController.updateDocument
);

export { router as documentRoutes };
