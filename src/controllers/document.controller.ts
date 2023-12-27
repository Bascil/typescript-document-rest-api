// src/controllers/document.controller.ts
import { Context } from "koa";
import { CreateDocumentDTO } from "../dtos/document.dto";
import { DocumentService } from "../services/document.service";

const documentService = new DocumentService();

export class DocumentController {
  static async getAllDocuments(ctx: Context) {
    const documents = await documentService.getAllDocuments();
    ctx.body = documents;
  }

  static async createDocument(ctx: Context) {
    const documentDTO: CreateDocumentDTO = ctx.request.body;
    const result = await documentService.createDocument(documentDTO);
    ctx.body = result;
  }
}
