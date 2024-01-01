import { Context } from "koa";
import { CreateDocumentDto, UpdateDocumentDto } from "../dtos/document.dto";
import { DocumentService } from "../services/document.service";
import { transform } from "../utils/transformer.utils";

const documentService = new DocumentService();

export class DocumentController {
  static async getAllDocuments(ctx: Context) {
    try {
      const filters = ctx.request.query;
      ctx.body = { data: await documentService.getAllDocuments(filters) };
    } catch (error) {
      throw error;
    }
  }

  static async getOneDocument(ctx: Context) {
    try {
      const { id, state } = ctx.params;
      ctx.body = {
        data: await documentService.getOneDocument(parseInt(id), state),
      };
    } catch (error) {
      throw error;
    }
  }

  static async createDocument(ctx: Context): Promise<void> {
    const documentDto: CreateDocumentDto = ctx.request.body;
    try {
      ctx.status = 201;
      ctx.body = transform(await documentService.createDocument(documentDto));
    } catch (error) {
      throw error;
    }
  }

  static async updateDocument(ctx: Context): Promise<void> {
    const documentDto: UpdateDocumentDto = ctx.request.body;

    try {
      ctx.status = 200;
      ctx.body = transform(
        await documentService.updateDocument(
          parseInt(ctx.params.id),
          documentDto
        )
      );
    } catch (error) {
      throw error;
    }
  }
}
