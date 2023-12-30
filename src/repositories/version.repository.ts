import { RunResult } from "sqlite3";
import { BaseRepository } from "./base.repository";

export class VersionRepository extends BaseRepository {
  constructor() {
    super();
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
