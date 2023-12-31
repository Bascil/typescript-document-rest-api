// src/controllers/document.controller.ts
import { Context } from "koa";
import { CreateDocumentDto, UpdateDocumentDto } from "../dtos/document.dto";
import { DocumentService } from "../services/document.service";

const documentService = new DocumentService();

export class DocumentController {
  static async getAllDocuments(ctx: Context) {
    try {
      const filters = ctx.request.query;
      ctx.body = { data: await documentService.getAllDocuments(filters) };
    } catch (error) {
      console.error(error);
      ctx.status = 500;
      ctx.body = { error: error };
    }
  }

  static async getOneDocument(ctx: Context) {
    try {
      const { id, state } = ctx.params;
      ctx.status = 200;
      ctx.body = {
        data: await documentService.getOneDocument(parseInt(id), state),
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Internal Server Error" };
    }
  }

  static async createDocument(ctx: Context): Promise<void> {
    const documentDto: CreateDocumentDto = ctx.request.body;

    try {
      const document = await documentService.createDocument(documentDto);
      ctx.status = 201;
      ctx.body = { data: document };
    } catch (error) {
      if (error.code === "SQLITE_BUSY") {
        // Handle concurrency conflict
        ctx.status = 409;
        ctx.body = { error: "Concurrency Conflict" };
      } else {
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error" };
      }
    }
  }

  static async updateDocument(ctx: Context): Promise<void> {
    const documentId = parseInt(ctx.params.id);
    const documentDto: UpdateDocumentDto = ctx.request.body;

    try {
      const document = await documentService.updateDocument(
        documentId,
        documentDto
      );
      ctx.status = 200;
      ctx.body = { data: document };
    } catch (error) {
      if (error.code === "SQLITE_BUSY") {
        // Handle concurrency conflict
        ctx.status = 409;
        ctx.body = { error: "Concurrency Conflict" };
      } else {
        ctx.status = 500;
        ctx.body = { error: "Internal Server Error" };
      }
    }
  }
}
