import { Database, RunResult } from "sqlite3";

export class VersionRepository {
  private db: Database;

  constructor() {
    this.db = new Database("./data.db");
    // this.createTable();
  }

  private createTable() {
    this.db.run(`
    CREATE TABLE versions (
      version_id INTEGER PRIMARY KEY,
      document_id INTEGER,
      version_number INTEGER,
      state TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (document_id) REFERENCES documents(document_id)
    )
  `);
  }

  async createVersion(documentId: number, state: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT version_number FROM documents WHERE document_id = ?",
        [documentId],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else {
            const versionNumber = row ? row.version_number : 1;
            this.db.run(
              "INSERT INTO versions (document_id, version_number, state) VALUES (?, ?, ?)",
              [documentId, versionNumber, state],
              function (this: RunResult, err) {
                if (err) {
                  reject(err);
                } else {
                  resolve(this.lastID);
                }
              }
            );
          }
        }
      );
    });
  }

  async updateVersionState(documentId: number, state: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE versions SET state = ? WHERE document_id = ? ORDER BY version_number DESC LIMIT 1",
        [state, documentId],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}
