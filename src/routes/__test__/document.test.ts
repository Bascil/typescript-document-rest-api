// document.controller.test.ts
import supertest from "supertest";
import app from "../../app";

describe("Document Routes", () => {
  it("should get a document by ID", async () => {
    // First, create a document to get its ID
    const createResponse = await supertest(app.callback())
      .post("/api/v1/documents")
      .send({
        title: "Test Document",
        content: "Lorem ipsum",
        userId: 1,
        state: "draft",
      });

    const documentId = createResponse.body.data.id;

    // Now, attempt to retrieve the document by its ID
    const getResponse = await supertest(app.callback()).get(
      `/api/v1/documents/${documentId}`
    );

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty("data");
    expect(getResponse.body.data).toHaveProperty("id", documentId);
    expect(getResponse.body.data).toHaveProperty("title", "Test Document");
    expect(getResponse.body.data).toHaveProperty("versions");
  });

  it("should create a document and return a document object", async () => {
    const response = await supertest(app.callback())
      .post("/api/v1/documents")
      .send({
        title: "Test Document",
        content: "Lorem ipsum",
        userId: 1,
        state: "draft",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("title");
  });

  it("fails with 422 when an invalid input is specified", async () => {
    await supertest(app.callback())
      .post("/api/v1/documents")
      .send({
        title: "Test Document",
        content: "Lorem ipsum",
        userId: 1,
        state: "unknown", //invalid
      })
      .expect(422);
  });

  it("fails when when an invalid title is specified", async () => {
    await supertest(app.callback())
      .post("/api/v1/documents")
      .send({
        title: "t", //invalid
        content: "Lorem ipsum",
        userId: 1,
        state: "published",
      })
      .expect(422);
  });
});
