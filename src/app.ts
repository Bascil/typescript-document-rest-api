import Koa from "koa";
import bodyParser from "koa-bodyparser";
import json from "koa-json";
import sqlite3 from "sqlite3";

import { documentRoutes } from "./routes/document.routes";

const app = new Koa();

// SQLite database setup
const db = new sqlite3.Database("./data.db"); // Use an actual file path for a persistent database
db.serialize(() => {
  // Create tables
  db.run(`
    CREATE TABLE documents (
        document_id INTEGER PRIMARY KEY,
        title text,
        content text,
        version_number INT DEFAULT 1,
        creation_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE versions (
      version_id INTEGER PRIMARY KEY,
      document_id INTEGER,
      version_number INTEGER,
      state TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (document_id) REFERENCES documents(document_id)
    )
  `);
});

// Koa middleware
app.use(bodyParser());

// Use koa-json middleware for pretty-printed JSON responses
app.use(json());

// Use routes
app.use(documentRoutes.routes());
app.use(documentRoutes.allowedMethods());

export default app;
