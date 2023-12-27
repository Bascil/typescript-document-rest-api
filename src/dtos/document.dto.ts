export interface CreateDocumentDTO {
  id?: number;
  title: string;
  content: string;
  creationDate?: Date;
  creatorId?: number;
  lastUpdatedDate?: Date;
  lastUpdateAuthorId?: number;
}
