const request = require("supertest");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

const { app } = require("../server");
const { Response } = require("../models/Response");
const RoomRecord = require("../models/RoomRecord");

describe("Testing the Authenticate Room Endpoint", () => {
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

  test("Tests a null request to authenticate a room", async (done) => {
    let req = null;
    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .post("/room/auth")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null room name to authenticate a room ", (done) => {
    const req = {
      roomName: null,
      password: "helloworld",
    };

    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .post("/room/auth")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null password to authenticate a room ", (done) => {
    const req = {
      roomName: "castlehelloworld123",
      password: null,
    };

    let expectedResponse = new Response(false, "Must have a Password", null);

    return request(app)
      .post("/room/auth")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a empty room name to authenticate a room ", (done) => {
    const req = {
      roomName: "",
      password: "helloworld",
    };

    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .post("/room/auth")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a empty password to authenticate a room ", (done) => {
    const req = {
      roomName: "castlehelloworld123",
      password: "",
    };

    let expectedResponse = new Response(false, "Must have a Password", null);

    return request(app)
      .post("/room/auth")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a valid room name and password", async (done) => {
    const req = {
      roomName: "helloWorld",
      password: "helloworld123",
    };

    var mockRoom = {
      roomName: "helloWorld",
      createdBy: "test@securemeeting.org",
      password: "helloworld123",
      members: [],
    };

    let expectedResponse = new Response(true, null, true);

    let createRoomRes = await request(app).post("/room/create").send(mockRoom);

    console.log(createRoomRes.body);

    return request(app)
      .post("/room/auth")
      .send(req)
      .then((response) => {
        console.log(response.status);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.isSuccess).toBe(true);
        expect(response.body.errorName).toBe(null);
        expect(response.body.payload).toBe(true);
        done();
      });
  });
});
