import { DocumentService } from "../document.service";
import { DocumentRepository } from "../../repositories/document.repository";

// Mock the DocumentRepository to isolate the service from actual database operations
jest.mock("../../repositories/document.repository");

describe("DocumentService", () => {
  let documentService: DocumentService;

  beforeEach(() => {
    // Create a new instance of the DocumentService for each test
    documentService = new DocumentService();
  });

  it("should get all documents", async () => {
    // Mock the behavior of the getAllDocuments method in the repository
    (
      DocumentRepository.prototype.getAllDocuments as jest.Mock
    ).mockResolvedValueOnce([
      // Mocked array of documents
      { id: 1, title: "Document 1", content: "Content 1" },
      { id: 2, title: "Document 2", content: "Content 2" },
    ]);

    const documents = await documentService.getAllDocuments({});

    expect(documents).toHaveLength(2);
  });

  it("should get one document by ID", async () => {
    // Mock the behavior of the getOneDocument method in the repository
    (
      DocumentRepository.prototype.getOneDocument as jest.Mock
    ).mockResolvedValueOnce({
      id: 1,
      title: "Document 1",
      content: "Content 1",
    });

    const document = await documentService.getOneDocument(1);

    expect(document).toHaveProperty("id", 1);
  });

  it("should create a document", async () => {
    // Mock the behavior of the createDocument method in the repository
    (
      DocumentRepository.prototype.createDocument as jest.Mock
    ).mockResolvedValueOnce({
      id: 1,
      title: "New Document",
      content: "New Content",
    });

    const createDocumentDto = {
      title: "New Document",
      content: "New Content",
      userId: 1,
      state: "draft",
    };
    const createdDocument = await documentService.createDocument(
      createDocumentDto
    );

    expect(createdDocument).toHaveProperty("id", 1);
  });

  it("should update a document", async () => {
    // Mock the behavior of the updateDocument method in the repository
    (
      DocumentRepository.prototype.updateDocument as jest.Mock
    ).mockResolvedValueOnce({
      id: 1,
      title: "Updated Document",
      content: "Updated Content",
    });

    const updateDocumentDto = {
      title: "Updated Document",
      content: "Updated Content",
      userId: 1,
      state: "published",
    };

    const updatedDocument = await documentService.updateDocument(
      1,
      updateDocumentDto
    );

    expect(updatedDocument).toHaveProperty("id", 1);
  });
});
