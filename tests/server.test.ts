// import * as chai from "chai";
// import supertest from "supertest";
// import app from "../src/server";
// import { CreateDocumentDTO } from "../src/dtos/document.dto";

// const expect = chai.expect;
// const request = new supertest.agent(app.listen());

// describe("Document API", () => {
//   it("should get all documents", async () => {
//     const response = await request.get("/documents");
//     expect(response.status).to.equal(200);
//     expect(response.body).to.be.an("array");
//   });

//   it("should create a new document", async () => {
//     const newDocument: CreateDocumentDTO = {
//       title: "Test document",
//       content: "A very meaningful document content",
//     };

//     const response = await request.post("/documents").send(newDocument);
//     expect(response.status).to.equal(200);
//     expect(response.body).to.have.property("id");
//   });
// });
