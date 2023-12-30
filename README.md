# Document Solution

This document outlines a document publishing API with versioning, designed to manage documents with various states like draft and published.

## Features

- Document creation with versioning support.
- Document states: draft, published, etc.
- API for creating, updating, and retrieving documents.
- Uses TypeScript, Koa, SQLite, and follows a service/repository pattern.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Bascil/typescript-document-rest-api
   cd typescript-document-rest-api
   ```

2. **Install Dependencies**

   ```bash
   npm install

   ```

3. **Start the Server**

   ```bash
   npm start

   The API server will be running at http://localhost:3000 by default.

   ```

4. **API Endpoints**

   Create Document:
   POST /documents

   Get Document by ID:
   GET /documents/:id

   Update Document:
   PUT /documents/:id
   <!-- Add more endpoints as needed -->
