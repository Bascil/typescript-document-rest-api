import { DocumentRepository } from "../repository/document.repository";
import { Document } from "../models/document.model";
import { CreateDocumentDTO } from "../dtos/document.dto";

export class DocumentService {
  private userRepository: DocumentRepository;

  constructor() {
    this.userRepository = new DocumentRepository();
  }

  async getAllDocuments(): Promise<Document[]> {
    return this.userRepository.getAllDocuments();
  }

  async createDocument(user: CreateDocumentDTO): Promise<{ id: number }> {
    return this.userRepository.createDocument(user);
  }
}
