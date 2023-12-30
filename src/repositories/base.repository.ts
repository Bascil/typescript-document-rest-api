import { Database, RunResult, Statement } from "sqlite3";
import DatabaseManager from "../connections/database.manager";

export class BaseRepository {
  protected db: Database;

  constructor() {
    this.db = DatabaseManager.getInstance().getDatabase();
  }
  async getAll(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getOne(sql: string | Statement, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof sql === "string") {
        this.db.get(sql, params, (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      } else {
        // Assuming sql is a prepared statement
        sql.get(params, (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }
    });
  }

  async runStatement(statement: Statement, params: any[]): Promise<RunResult> {
    return new Promise((resolve, reject) => {
      statement.run(params, function (this: RunResult, err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }
}
