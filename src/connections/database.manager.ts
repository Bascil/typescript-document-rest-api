import { Database, Statement } from "sqlite3";

class DatabaseManager {
  private static instance: DatabaseManager;
  private db: Database;

  private constructor() {
    // Initialize the database connection
    this.db = new Database("./data.db");
    this.createTable(); // Create tables when the manager is initialized
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  getDatabase(): Database {
    return this.db;
  }

  getAll(sql: string, params: any[]): Promise<any> {
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

  getOne(sql: string | Statement, params: any[] = []): Promise<any> {
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

  private createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS documents (
        document_id INTEGER PRIMARY KEY,
        title text,
        content text,
        version_number INT DEFAULT 1,
        creator_id INTEGER,
        creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_updated_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS versions(
        version_id INTEGER PRIMARY KEY,
        document_id INTEGER,
        version_number INTEGER,
        modified_by INTEGER,
        state TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (document_id) REFERENCES documents(document_id)
      )
  `);
  }
}
export default DatabaseManager;
