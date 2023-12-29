export interface Document {
  id?: number;
  title: string;
  content: string;
  creation_date: Date;
  creator_id: number;
  last_updated_date?: Date;
  last_update_author_id?: number;
}
