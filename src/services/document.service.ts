import { Document } from "../models/document.model";
import { CreateDocumentDto, UpdateDocumentDto } from "../dtos/document.dto";
import { DocumentRepository } from "../repositories/document.repository";

export class DocumentService {
  private documentRepository: DocumentRepository;

  constructor() {
    this.documentRepository = new DocumentRepository();
  }

  async getAllDocuments(filters: any): Promise<Document[]> {
    try {
      return this.documentRepository.getAllDocuments(filters);
    } catch (error) {
      throw error;
    }
  }

  async getOneDocument(documentId: number, state?: string): Promise<Document> {
    try {
      return await this.documentRepository.getOneDocument(documentId, state);
    } catch (error) {
      throw error;
    }
  }

  async createDocument(dto: CreateDocumentDto): Promise<Document> {
    try {
      return await this.documentRepository.createDocument(dto);
    } catch (error) {
      throw error;
    }
  }

  async updateDocument(id: number, dto: UpdateDocumentDto): Promise<Document> {
    try {
      return await this.documentRepository.updateDocument(id, dto);
    } catch (error) {
      throw error;
    }
  }
}
