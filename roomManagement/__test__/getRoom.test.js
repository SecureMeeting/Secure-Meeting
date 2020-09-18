const request = require("supertest");
const { MongoClient } = require("mongodb");

const { app } = require("../server");
const { Response } = require("../models/Response");
const RoomRecord = require("../models/RoomRecord");

describe("Testing the Get Room Endpoint", () => {
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

  test("Tests a null request to get a room ", (done) => {
    let req = null;
    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .get("/room/get")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null room name to get a room ", (done) => {
    const req = {
      roomName: null,
    };

    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .get("/room/get")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a empty room name to get a room ", (done) => {
    const req = {
      roomName: "",
    };

    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .get("/room/get")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a valid room name to get a room ", async (done) => {
    const req = {
      roomName: "helloWorldcastle4324",
    };

    const mockRoom = {
      roomName: "helloWorldcastle4324",
      createdBy: "test@securemeeting.org",
      timeCreated: "12/213/32432",
      password: "helloWorld",
      members: [],
    };

    let e1 = new RoomRecord(mockRoom);

    await e1.save();

    //adds a record to the database in order to be returned

    let expectedResponse = new Response(true, null, mockRoom);

    return request(app)
      .get("/room/get")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.isSuccess).toEqual(expectedResponse.isSuccess);
        expect(response.body.payload.roomName).toEqual(mockRoom.roomName);
        expect(response.body.payload.createdBy).toEqual(mockRoom.createdBy);
        expect(response.body.payload.members).toEqual(mockRoom.members);
        done();
      });
  });
});
