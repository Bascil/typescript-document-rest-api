import { DocumentRepository } from "../document.repository";
import { Database } from "sqlite3";

// Mock the methods of the Database class
const mockRun = jest.fn();
const mockPrepare = jest
  .fn()
  .mockReturnValue({ run: mockRun, finalize: jest.fn() });
const mockAll = jest.fn();
jest.mock("sqlite3", () => ({
  Database: jest.fn().mockImplementation(() => ({
    run: mockRun,
    prepare: mockPrepare,
    all: mockAll,
  })),
}));

describe("DocumentRepository", () => {
  let documentRepository: DocumentRepository;
  let dbMock: jest.Mocked<Database>;

  beforeEach(() => {
    // Clear the mock function calls before each test
    jest.clearAllMocks();

    // Create a new mock instance for each test
    dbMock = new Database(":memory:") as jest.Mocked<Database>;
    documentRepository = new DocumentRepository();
  });

  it("should get all documents", async () => {
    // Mocking the behavior of the getAll method in the repository
    mockAll.mockImplementationOnce((query, params, callback) => {
      const rows = [{ id: 1, title: "Document 1", content: "Content 1" }];
      callback(null, rows);
    });

    const documents = await documentRepository.getAllDocuments({});
    expect(documents).toHaveLength(1);
  });
});
