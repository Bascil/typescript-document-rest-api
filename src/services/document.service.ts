import { DocumentRepository } from "../repository/document.repository";
import { Document } from "../models/document.model";
import { CreateDocumentDTO } from "../dtos/document.dto";

export class DocumentService {
  private documentRepository: DocumentRepository;

  constructor() {
    this.documentRepository = new DocumentRepository();
  }

  async getAllDocuments(): Promise<Document[]> {
    return this.documentRepository.getAllDocuments();
  }

  async createDocument(user: CreateDocumentDTO): Promise<{ id: number }> {
    return this.documentRepository.createDocument(user);
  }
}
