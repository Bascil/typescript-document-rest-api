export interface CreateDocumentDto {
  id?: number;
  title: string;
  content: string;
  state: string;
  creationDate?: Date;
  creatorId?: number;
  documentId?: number;
  lastUpdatedDate?: Date;
  lastUpdateAuthorId?: number;
}
