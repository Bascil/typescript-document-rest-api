import { Document } from "../models/document.model";
import { CreateDocumentDto, UpdateDocumentDto } from "../dtos/document.dto";
import { DocumentRepository } from "../repositories/document.repository";

export class DocumentService {
  private documentRepository: DocumentRepository;

  constructor() {
    this.documentRepository = new DocumentRepository();
  }

  async getAllDocuments(): Promise<Document[]> {
    return this.documentRepository.getAllDocuments();
  }

  async getOneDocument(documentId: number): Promise<Document> {
    return await this.documentRepository.getOneDocument(documentId);
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
