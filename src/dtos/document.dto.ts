export interface CreateDocumentDto {
  id?: number;
  title: string;
  content: string;
  state: string;
  creationDate?: Date;
  creatorId?: number;
  lastUpdatedDate?: Date;
  lastUpdateAuthorId?: number;
}
