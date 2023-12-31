import { Statement } from "sqlite3";
import { Document } from "../models/document.model";
import { CreateDocumentDto, UpdateDocumentDto } from "../dtos/document.dto";
import { BaseRepository } from "./base.repository";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { DatabaseError } from "../errors/database-error";

export class DocumentRepository extends BaseRepository {
  constructor() {
    super();
  }

  async getAllDocuments(filters): Promise<Document[]> {
    const { state } = filters;
    let query = `
      SELECT
        d.document_id as id,
        d.title,
        d.content,
        d.creator_id as creatorId,
        d.last_update_author_id as lastUpdateAuthorId,
        d.creation_date as creationDate,
        d.last_updated_date as lastUpdatedDate,
        v.state,
        MAX(v.version_number) AS latestVersion
      FROM
        documents d
      LEFT JOIN
        versions v ON d.document_id = v.document_id
      GROUP BY
        d.document_id
    `;

    const params = [];

    if (state) {
      query += " HAVING v.state = ?";
      params.push(state);
    }

    return await this.getAll(query, params);
  }

  async getOneDocument(documentId: number, state?: string): Promise<any> {
    const document = await this.getOne(
      "SELECT * FROM documents WHERE document_id = ?",
      [documentId]
    );

    if (!document) {
      throw new NotFoundError("Document with the specified id not found");
    }

    const versions = await this.getAll(
      `SELECT * FROM versions WHERE document_id = ?  ${
        state ? "AND state = ?" : ""
      } ORDER BY version_number DESC`,
      [documentId, state]
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
      "INSERT INTO documents (title, content, creator_id, last_update_author_id, last_updated_date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)"
    );

    const insertVersionStatement: Statement = this.db.prepare(
      "INSERT INTO versions (document_id, version_number, author_id, state) VALUES (?, ?, ?, ?)"
    );

    try {
      // Run the statements within the transaction
      this.db.run("BEGIN TRANSACTION");

      // Run the statement to insert the document
      await this.executeQuery(insertDocumentStatement, [
        dto.title,
        dto.content,
        dto.userId,
        dto.userId,
      ]);

      //@ts-ignore
      const documentId = insertDocumentStatement.lastID;
      // Run the statement to insert the version
      await this.executeQuery(insertVersionStatement, [
        documentId,
        1,
        dto.userId,
        dto.state,
      ]);

      // Commit the transaction
      this.db.run("COMMIT");

      // Return the document or any other result
      const document = await this.getOne(
        "SELECT d.document_id as id, d.title, d.content, d.creator_id as creatorId," +
          "d.last_update_author_id as lastUpdateAuthorId, " +
          "d.creation_date as creationDate, d.last_updated_date as lastUpdatedDate," +
          "v.state, MAX(v.version_number) AS latestVersion " +
          "FROM documents d " +
          "LEFT JOIN versions v ON d.document_id = v.document_id " +
          "WHERE d.document_id = ? " +
          "GROUP BY d.document_id",

        [documentId]
      );

      if (!document) {
        throw new DatabaseError("Document not found");
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

  async updateDocument(
    documentId: number,
    dto: UpdateDocumentDto
  ): Promise<Document> {
    const updateDocumentStatement: Statement = this.db.prepare(
      "UPDATE documents SET title = ?, content = ?, last_update_author_id = ?, last_updated_date = CURRENT_TIMESTAMP WHERE document_id = ?"
    );

    const insertVersionStatement: Statement = this.db.prepare(
      "INSERT INTO versions (document_id, version_number, author_id, state) VALUES (?, ?, ?, ?)"
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
      if (documentId) {
        const currentState = await this.getOne(checkPublishedStateStatement, [
          documentId,
        ]);

        if (currentState && currentState.state === "published") {
          throw new BadRequestError("Published documents cannot be edited.");
        }

        // update document
        await this.executeQuery(updateDocumentStatement, [
          dto.title,
          dto.content,
          dto.userId,
          documentId,
        ]);

        // Check the existing version and increment it
        const existingVersionResult = await this.getOne(
          checkExistingVersionStatement,
          [documentId]
        );

        const existingVersionNumber = existingVersionResult.max_version || 0;

        // Increment the version number
        const newVersionNumber = existingVersionNumber + 1;

        // Run the statement to insert the new version
        await this.executeQuery(insertVersionStatement, [
          documentId,
          newVersionNumber,
          dto.userId,
          dto.state,
        ]);
      }
      // Commit the transaction
      this.db.run("COMMIT");

      // Return the document or any other result
      const document = await this.getOne(
        "SELECT d.document_id as id, d.title, d.content, d.creator_id as creatorId," +
          "d.last_update_author_id as lastUpdateAuthorId, " +
          "d.creation_date as creationDate, d.last_updated_date as lastUpdatedDate," +
          "v.state, MAX(v.version_number) AS latestVersion " +
          "FROM documents d " +
          "LEFT JOIN versions v ON d.document_id = v.document_id " +
          "WHERE d.document_id = ? " +
          "GROUP BY d.document_id",
        [documentId]
      );

      if (!document) {
        throw new DatabaseError("Document not found");
      }

      return document;
    } catch (error) {
      // Rollback the transaction in case of an error
      this.db.run("ROLLBACK");
      throw error;
    } finally {
      // Ensure the statements are finalized
      updateDocumentStatement.finalize();
      insertVersionStatement.finalize();
    }
  }
}
