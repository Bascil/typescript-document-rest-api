import { Statement } from "sqlite3";
import { Document } from "../models/document.model";
import { CreateDocumentDto } from "../dtos/document.dto";
import { BaseRepository } from "./base.repository";

export class DocumentRepository extends BaseRepository {
  constructor() {
    super();
  }

  async getAllDocuments(): Promise<Document[]> {
    return await this.getAll(
      "SELECT d.document_id as id, d.title, d.content, d.creator_id as creatorId," +
        "d.creation_date as creationDate, v.state, MAX(v.version_number) AS latestVersion " +
        "FROM documents d " +
        "LEFT JOIN versions v ON d.document_id = v.document_id " +
        "GROUP BY d.document_id"
    );
  }

  async getOneDocument(documentId: number): Promise<any> {
    const document = await this.getOne(
      "SELECT * FROM documents WHERE document_id = ?",
      [documentId]
    );

    const versions = await this.getAll(
      "SELECT * FROM versions WHERE document_id = ? ORDER BY version_number DESC",
      [documentId]
    );

    return {
      id: document.id,
      title: document.title,
      content: document.content,
      versions,
    };
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
        const currentState = await this.getOne(checkPublishedStateStatement, [
          dto.documentId,
        ]);

        if (currentState && currentState.state === "published") {
          throw new Error("Published documents cannot be edited.");
        }

        // update document
        await this.executeQuery(updateDocumentStatement, [
          dto.title,
          dto.content,
          dto.documentId,
        ]);

        // Check the existing version and increment it
        const existingVersionResult = await this.getOne(
          checkExistingVersionStatement,
          [dto.documentId]
        );

        const existingVersionNumber = existingVersionResult.max_version || 0;

        // Increment the version number
        const newVersionNumber = existingVersionNumber + 1;

        // Run the statement to insert the new version
        await this.executeQuery(insertVersionStatement, [
          dto.documentId,
          newVersionNumber,
          dto.creatorId,
          dto.state,
        ]);
      } else {
        // Run the statement to insert the document
        await this.executeQuery(insertDocumentStatement, [
          dto.title,
          dto.content,
          dto.creatorId,
        ]);

        //@ts-ignore
        const documentId = insertDocumentStatement.lastID;
        // Run the statement to insert the version
        await this.executeQuery(insertVersionStatement, [
          documentId,
          1,
          dto.creatorId,
          dto.state,
        ]);
      }
      // Commit the transaction
      this.db.run("COMMIT");

      // Return the document or any other result
      const document = await this.getOne(
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
}
