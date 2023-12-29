import { Database, RunResult } from "sqlite3";
import { Document } from "../models/document.model";
import { CreateDocumentDto } from "../dtos/document.dto";

export class DocumentRepository {
  private db: Database;

  constructor() {
    this.db = new Database("./data.db");
    //  this.createTable();
  }

  private createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS documents (
        document_id INTEGER PRIMARY KEY,
        title text, 
        content text,
        version_number INT DEFAULT 1,
        creation_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async getAllDocuments(): Promise<Document[]> {
    return new Promise<Document[]>((resolve, reject) => {
      this.db.all("SELECT * FROM documents", (err, rows: any) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async createDocument(document: CreateDocumentDto): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO documents (title, content) VALUES (?, ?)",
        [document.title, document.content],
        function (this, err) {
          if (err) {
            reject(err);
          } else {
            const documentId = this.lastID;
            resolve(documentId);
          }
        }
      );
    });
  }

  async updateVersion(documentId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE documents SET version_number = version_number + 1 WHERE document_id = ?",
        [documentId],
        function (this, err) {
          if (err) {
            reject(err);
          } else {
            const documentId = this.lastID;
            resolve(documentId);
          }
        }
      );
    });
  }
}
