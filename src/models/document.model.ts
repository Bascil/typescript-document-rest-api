export interface Document {
  id?: number;
  title: string;
  content: string;
  creationDate: Date;
  creatorId: number;
  lastUpdatedDate?: Date;
  lastUpdateAuthorId?: number;
}
