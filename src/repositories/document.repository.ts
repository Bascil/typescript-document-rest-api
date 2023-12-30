import { Database, RunResult, Statement } from "sqlite3";
import { Document } from "../models/document.model";
import { CreateDocumentDto } from "../dtos/document.dto";
import DatabaseManager from "../connections/database.manager";

export class DocumentRepository {
  private db: Database;
  constructor() {
    this.db = DatabaseManager.getInstance().getDatabase();
  }

  async getAllDocuments(): Promise<Document[]> {
    return new Promise<Document[]>((resolve, reject) => {
      this.db.all(
        "SELECT d.document_id as id, d.title, d.content, d.creator_id as creatorId," +
          "d.creation_date as creationDate, v.state, MAX(v.version_number) AS latestVersion " +
          "FROM documents d " +
          "LEFT JOIN versions v ON d.document_id = v.document_id " +
          "GROUP BY d.document_id",
        (err, rows: any) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async createDocument(dto: CreateDocumentDto): Promise<Document> {
    const insertDocumentStatement: Statement = this.db.prepare(
      "INSERT INTO documents (title, content, creator_id, last_updated_date) VALUES (?, ?, ?,  CURRENT_TIMESTAMP)"
    );

    const updateDocumentStatement: Statement = this.db.prepare(
      "UPDATE documents SET title = ?, content = ?, last_updated_date = CURRENT_TIMESTAMP WHERE document_id = ?"
    );

    const insertVersionStatement: Statement = this.db.prepare(
      "INSERT INTO versions (document_id, version_number, modified_by, state) VALUES (?, ?, ?, ?)"
    );

    const checkExistingVersionStatement: Statement = this.db.prepare(
      "SELECT COALESCE(MAX(version_number), 0) AS max_version FROM versions WHERE document_id = ?"
    );

    const checkPublishedStateStatement: Statement = this.db.prepare(
      "SELECT state FROM versions WHERE document_id = ? ORDER BY version_number DESC LIMIT 1"
    );

    try {
      // Run the statements within the transaction
      this.db.run("BEGIN TRANSACTION");

      // If an existing document ID is provided, it means we are updating an existing document
      if (dto.documentId) {
        const currentState = await this.runQuery(checkPublishedStateStatement, [
          dto.documentId,
        ]);

        if (currentState && currentState.state === "published") {
          throw new Error("Published documents cannot be edited.");
        }

        // update document
        await this.runStatement(updateDocumentStatement, [
          dto.title,
          dto.content,
          dto.documentId,
        ]);

        // Check the existing version and increment it
        const existingVersionResult = await this.runQuery(
          checkExistingVersionStatement,
          [dto.documentId]
        );

        const existingVersionNumber = existingVersionResult.max_version || 0;

        // Increment the version number
        const newVersionNumber = existingVersionNumber + 1;

        // Run the statement to insert the new version
        await this.runStatement(insertVersionStatement, [
          dto.documentId,
          newVersionNumber,
          dto.creatorId,
          dto.state,
        ]);
      } else {
        // Run the statement to insert the document
        await this.runStatement(insertDocumentStatement, [
          dto.title,
          dto.content,
          dto.creatorId,
        ]);

        //@ts-ignore
        const documentId = insertDocumentStatement.lastID;
        // Run the statement to insert the version
        await this.runStatement(insertVersionStatement, [
          documentId,
          1,
          dto.creatorId,
          dto.state,
        ]);
      }
      // Commit the transaction
      this.db.run("COMMIT");

      // Return the document or any other result
      const document = await this.runQuery(
        "SELECT d.document_id as id, d.title, d.content, d.creator_id as creatorId," +
          "d.creation_date as creationDate, d.last_updated_date as lastUpdatedDate," +
          "v.state, MAX(v.version_number) AS latestVersion " +
          "FROM documents d " +
          "LEFT JOIN versions v ON d.document_id = v.document_id " +
          "WHERE d.document_id = ? " +
          "GROUP BY d.document_id",
        //@ts-ignore
        [dto.documentId || insertDocumentStatement.lastID]
      );

      if (!document) {
        throw new Error("Document not found");
      }

      return document;
    } catch (error) {
      // Rollback the transaction in case of an error
      this.db.run("ROLLBACK");
      throw error;
    } finally {
      // Ensure the statements are finalized
      insertDocumentStatement.finalize();
      insertVersionStatement.finalize();
    }
  }

  private runStatement(
    statement: Statement,
    params: any[]
  ): Promise<RunResult> {
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

  private runQuery(sql: string | Statement, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof sql === "string") {
        this.db.get(sql, params, (err, row) => {
          if (err) {
            console.error(`Error executing query: ${sql}`);
            console.error(`Parameters: ${params}`);
            reject(err);
          } else {
            resolve(row);
          }
        });
      } else {
        // Assuming sql is a prepared statement
        sql.get(params, (err, row) => {
          if (err) {
            console.error(`Error executing prepared statement`);
            console.error(`Parameters: ${params}`);
            reject(err);
          } else {
            resolve(row);
          }
        });
      }
    });
  }
}
