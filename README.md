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

4. **Running Tests**

   ```bash
   npm test

   Allows you to run unit tests including test coverage.

   ```

## API Endpoints

### Get document by id

Endpoint: `GET /api/v1/documents/{documentId}`

```json
{
  "data": {
    "title": "Test Updated Document",
    "content": "Very meaningful document content update",
    "versions": [
      {
        "version_id": 5,
        "document_id": 3,
        "version_number": 3,
        "author_id": 1,
        "state": "published",
        "created_at": "2023-12-31 05:52:47"
      },
      {
        "version_id": 4,
        "document_id": 3,
        "version_number": 2,
        "author_id": 1,
        "state": "draft",
        "created_at": "2023-12-31 05:50:16"
      },
      {
        "version_id": 3,
        "document_id": 3,
        "version_number": 1,
        "author_id": 1,
        "state": "draft",
        "created_at": "2023-12-31 05:49:44"
      }
    ]
  }
}
```

### Get all documents

Endpoint: `GET /api/v1/documents`

```json
{
  "data": [
    {
      "id": 1,
      "title": "Test Document",
      "content": "very meaningful document content",
      "creatorId": 1,
      "lastUpdateAuthorId": 1,
      "creationDate": "2023-12-31 05:42:08",
      "lastUpdatedDate": "2023-12-31 05:42:08",
      "state": "draft",
      "latestVersion": 1
    },
    {
      "id": 2,
      "title": "Test Document",
      "content": "very meaningful document content",
      "creatorId": 1,
      "lastUpdateAuthorId": 1,
      "creationDate": "2023-12-31 05:48:41",
      "lastUpdatedDate": "2023-12-31 05:48:41",
      "state": "draft",
      "latestVersion": 1
    },
    {
      "id": 3,
      "title": "Test Updated Document",
      "content": "Very meaningful document content update",
      "creatorId": 1,
      "lastUpdateAuthorId": 1,
      "creationDate": "2023-12-31 05:49:44",
      "lastUpdatedDate": "2023-12-31 05:52:47",
      "state": "published",
      "latestVersion": 3
    }
  ]
}
```

### Create a New Document

Endpoint: `POST /api/v1/documents`

Create a new document by sending a POST request to the `/api/v1/documents` endpoint with the following JSON payload:

```json
{
  "title": "Test Document",
  "content": "Very meaningful document content",
  "userId": 1,
  "state": "draft"
}

### Sample response

HTTP/1.1 201 Created
Content-Type: application/json
{
   "data": {
      "id": 1,
      "title": "Test Document",
      "content": "very meaningful document content",
      "creatorId": 1,
      "lastUpdateAuthorId": 1,
      "creationDate": "2023-12-31 05:42:08",
      "lastUpdatedDate": "2023-12-31 05:42:08",
      "state": "draft",
      "latestVersion": 1
    }
}
```

### Update a Document

Endpoint: `PUT /api/v1/documents/{documentId}`

Update an existing document by sending a PUT request to the `/api/v1/documents/{documentId}` endpoint with the following JSON payload:

```json
{
  "title": "Test Updated Document",
  "content": "Very meaningful document content update",
  "userId": 1,
  "state": "published"
}


### Sample response

HTTP/1.1 200 OK
Content-Type: application/json
{
   "data": {
      "id": 3,
      "title": "Test Updated Document",
      "content": "Very meaningful document content update",
      "creatorId": 1,
      "lastUpdateAuthorId": 1,
      "creationDate": "2023-12-31 05:49:44",
      "lastUpdatedDate": "2023-12-31 05:52:47",
      "state": "published",
      "latestVersion": 3
    }
}
```
