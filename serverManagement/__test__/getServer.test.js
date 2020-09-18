const request = require("supertest");
const ServerRecord = require("../models/ServerRecord");
const { Response } = require("../models/Response");
const { app } = require("../server");

const { MongoClient } = require("mongodb");

describe("Testing the Get Server Endpoint", () => {
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

  test("Tests a null request to get a server", (done) => {
    let req = null;

    let expectedResponse = new Response(false, "Must have a Server Ip", null);

    return request(app)
      .get("/server/get")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null ip to get a server", (done) => {
    const req = {
      ip: null,
    };

    let expectedResponse = new Response(false, "Must have a Server Ip", null);

    return request(app)
      .get("/server/get")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a empty ip to get a server", (done) => {
    const req = {
      ip: "",
    };

    let expectedResponse = new Response(false, "Must have a Server Ip", null);

    return request(app)
      .get("/server/get")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a non-valid ip to get a server", (done) => {
    const req = {
      ip: "192.168.69.420",
    };

    let expectedResponse = new Response(
      false,
      "A server with that ip was not found",
      null
    );

    return request(app)
      .get("/server/get")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a valid ip to get a server", async (done) => {
    const req = {
      ip: "192.420.69.420",
    };

    const serverExample = {
      country: "US",
      region: "US-East3",
      type: "SFU",
      ip: "192.420.69.420",
    };

    let expectedResponse = new Response(
      false,
      "A server with that ip was not found",
      null
    );

    let createRoomResponse = await request(app)
      .post("/server/create")
      .send(serverExample);

    return request(app)
      .get("/server/get")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.payload.country).toEqual(
          createRoomResponse.body.payload.country
        );
        expect(response.body.payload.ip).toEqual(
          createRoomResponse.body.payload.ip
        );
        expect(response.body.payload.region).toEqual(
          createRoomResponse.body.payload.region
        );
        expect(response.body.payload.type).toEqual(
          createRoomResponse.body.payload.type
        );
        done();
      });
  });
});
