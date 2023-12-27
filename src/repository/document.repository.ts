import sqlite from "sqlite3";
import { Document } from "../models/document.model";
import { CreateDocumentDTO } from "../dtos/document.dto";

export class DocumentRepository {
  private db: sqlite.Database;

  constructor() {
    this.db = new sqlite.Database("./data.db");
    this.createTable();
  }

  private createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title text, 
        content text,
        creation_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  getAllDocuments(): Promise<Document[]> {
    return new Promise<Document[]>((resolve, reject) => {
      this.db.all("SELECT * FROM documents", (err, rows: any) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  createDocument(document: CreateDocumentDTO): Promise<{ id: number }> {
    return new Promise<{ id: number }>((resolve, reject) => {
      this.db.run(
        "INSERT INTO documents (title, content) VALUES (?, ?)",
        [document.title, document.content],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });
  }
}
