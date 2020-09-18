const request = require("supertest");
const ServerRecord = require("../models/ServerRecord");
const { Response } = require("../models/Response");
const { app } = require("../server");

const { MongoClient } = require("mongodb");

describe("Testing the Delete Server Endpoint", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  test("Tests a null request to delete a server", (done) => {
    let req = null;

    let expectedResponse = new Response(false, "Must have a Server Ip", null);

    return request(app)
      .del("/server/delete")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a emtpy request to delete a server", (done) => {
    let req = {
      ip: "",
    };

    let expectedResponse = new Response(false, "Must have a Server Ip", null);

    return request(app)
      .del("/server/delete")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a ip that is not in the database to delete a server", (done) => {
    let req = {
      ip: "192.168.1.420",
    };

    let expectedResponse = new Response(
      false,
      "A server with that ip was not found",
      null
    );

    return request(app)
      .del("/server/delete")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a valid ip to delete a server", async (done) => {
    let req = {
      ip: "192.168.1.111",
    };

    const serverExample = {
      country: "US",
      region: "US-East3",
      type: "SFU",
      ip: "192.168.1.111",
    };

    let expectedResponse = new Response(
      false,
      "A server with that ip was not found",
      null
    );

    await request(app).post("/server/create").send(serverExample);

    return request(app)
      .del("/server/delete")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.payload).toBe(true);
        done();
      });
  });
});
