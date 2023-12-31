import { Database } from "sqlite3";

// Set up an in-memory SQLite database connection
let db;

beforeAll(async () => {
  db = new Database(":memory:");
});

afterAll(async () => {
  // Close the in-memory SQLite database connection
  await db.close();
});
