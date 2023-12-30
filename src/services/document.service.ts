import { Document } from "../models/document.model";
import { CreateDocumentDto } from "../dtos/document.dto";
import { DocumentRepository } from "../repositories/document.repository";

export class DocumentService {
  private documentRepository: DocumentRepository;

  constructor() {
    this.documentRepository = new DocumentRepository();
  }

  async getAllDocuments(): Promise<Document[]> {
    return this.documentRepository.getAllDocuments();
  }

  async createDocument(dto: CreateDocumentDto): Promise<Document> {
    try {
      return await this.documentRepository.createDocument(dto);
    } catch (error) {
      throw error;
    }
  }
}
