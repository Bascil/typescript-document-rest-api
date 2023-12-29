import { Context } from "koa";
import { DocumentController } from "../document.controller";
import { DocumentService } from "../../services/document.service";
import { DocumentRepository } from "../../repositories/document.repository";
import { VersionRepository } from "../../repositories/version.repository";

// Mock SQLite database
const mockDb: any = {
  run: jest.fn(),
  get: jest.fn(),
};

// Mock Koa context
const mockContext: Context = {
  request: {
    body: { title: "Test Document", content: "Test Content", state: "draft" },
  },
  status: 0,
  body: {},
} as any;

describe("Document Controller", () => {
  let documentController: DocumentController;
  let documentRepository: DocumentRepository;
  let versionRepository: VersionRepository;

  beforeEach(() => {
    // Reset mock functions and instances before each test
    jest.clearAllMocks();

    documentRepository = new DocumentRepository();
    versionRepository = new VersionRepository();
    documentController = new DocumentController();
  });

  test("Create Document - Success", async () => {
    DocumentController.createDocument(mockContext);

    expect(mockContext.status).toBe(201);
    expect(mockContext.body).toHaveProperty("document_id");
    expect(mockDb.run).toHaveBeenCalledTimes(2); // One for createDocument and one for update version_number
  });

  // test("Create Document - Concurrency Conflict", async () => {
  //   // Simulate a concurrency conflict by rejecting the second update attempt
  //   mockDb.run.mockImplementationOnce(
  //     (sql: string, params: any[], callback: any) => {
  //       callback(new Error("SQLITE_BUSY"));
  //     }
  //   );

  //   await documentController.createDocument(mockContext);

  //   expect(mockContext.status).toBe(409);
  //   expect(mockContext.body).toHaveProperty("error", "Concurrency Conflict");
  //   expect(mockDb.run).toHaveBeenCalledTimes(1); // Only one attempt to createDocument
  // });

  test("Create Document - Internal Server Error", async () => {
    // Simulate an internal server error by rejecting the first update attempt
    mockDb.run.mockImplementationOnce(
      (sql: string, params: any[], callback: any) => {
        callback(new Error("Some Database Error"));
      }
    );

    DocumentController.createDocument(mockContext);

    expect(mockContext.status).toBe(500);
    expect(mockContext.body).toHaveProperty("error", "Internal Server Error");
    expect(mockDb.run).toHaveBeenCalledTimes(1); // Only one attempt to createDocument
  });
});
