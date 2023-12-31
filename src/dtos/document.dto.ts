export interface CreateDocumentDto {
  title: string;
  content: string;
  userId: number;
  state: string;
}

export interface UpdateDocumentDto {
  title: string;
  content: string;
  state: string;
  userId: number;
}
