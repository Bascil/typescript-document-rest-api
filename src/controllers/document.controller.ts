// src/controllers/document.controller.ts
import { Context } from "koa";
import { CreateDocumentDto } from "../dtos/document.dto";
import { DocumentService } from "../services/document.service";

const documentService = new DocumentService();

export class DocumentController {
  static async getAllDocuments(ctx: Context) {
    const documents = await documentService.getAllDocuments();
    ctx.body = documents;
  }

  static async createDocument(ctx: Context): Promise<void> {
    const documentDto: CreateDocumentDto = ctx.request.body;

    try {
      const documentId = await documentService.createDocument(documentDto);
      ctx.status = 201;
      ctx.body = { document_id: documentId };
    } catch (error) {
      if (error.code === "SQLITE_BUSY") {
        // Handle concurrency conflict
        ctx.status = 409;
        ctx.body = { error: "Concurrency Conflict" };
      } else {
        console.error("Error creating document:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error" };
      }
    }
  }
}
