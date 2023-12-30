import { Context } from "koa";
import { DocumentController } from "../document.controller";
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
    await DocumentController.createDocument(mockContext);

    expect(mockContext.status).toBe(201);
    expect(mockContext.body).toHaveProperty("data");
  });
});
