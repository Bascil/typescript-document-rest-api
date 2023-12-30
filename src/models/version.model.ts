export interface Version {
  version_id: number;
  document_id: number;
  version_number: number;
  modified_by?: number;
  state: string;
  created_at: Date;
}
