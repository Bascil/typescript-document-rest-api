import { Database } from "sqlite3";

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
