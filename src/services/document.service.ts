import { Document } from "../models/document.model";
import { CreateDocumentDto } from "../dtos/document.dto";
import { DocumentRepository } from "../repositories/document.repository";
import { VersionRepository } from "../repositories/version.repository";

export class DocumentService {
  private documentRepository: DocumentRepository;
  private versionRepository: VersionRepository;

  constructor() {
    this.documentRepository = new DocumentRepository();
    this.versionRepository = new VersionRepository();
  }

  async getAllDocuments(): Promise<Document[]> {
    return this.documentRepository.getAllDocuments();
  }

  async createDocument(document: CreateDocumentDto): Promise<number> {
    const { state } = document;
    const documentId = await this.documentRepository.createDocument(document);
    await this.documentRepository.updateVersion(documentId);

    await this.createVersion(documentId, state);
    return documentId;
  }

  private async createVersion(
    documentId: number,
    state: string
  ): Promise<void> {
    await this.versionRepository.createVersion(documentId, state);
  }
}
