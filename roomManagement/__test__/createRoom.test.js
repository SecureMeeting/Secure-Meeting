const request = require("supertest");
const moment = require("moment");

const { MongoClient } = require("mongodb");

const { app } = require("../server");
const { Response } = require("../models/Response");
const RoomRecord = require("../models/RoomRecord");

describe("Testing the Create Room Endpoint", () => {
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

  test("Tests a null request to create a room", (done) => {
    let req = null;

    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .post("/room/create")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null room name to create a room", (done) => {
    const req = {
      roomName: null,
      timeCreated: moment().format(),
      createdBy: "kyritzb@gmail.com",
      password: "helloWorld",
      members: [],
    };

    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .post("/room/create")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a empty room name to create a room", (done) => {
    const req = {
      roomName: "",
      timeCreated: moment().format(),
      createdBy: "kyritzb@gmail.com",
      password: "helloWorld",
      members: [],
    };

    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .post("/room/create")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a valid room name to create a room", (done) => {
    const req = {
      roomName: "helloWorldcastle12345",
      createdBy: "test@securemeeting.org",
      password: "helloWorld",
      members: [],
    };

    let expectedResponse = new Response(true, null, req);

    return request(app)
      .post("/room/create")
      .send(req)
      .then((response) => {
        RoomRecord.findOne({ roomName: req.roomName }).then((insertedRoom) => {
          expect(response.statusCode).toBe(200);

          expect(response.body.payload.roomName).toEqual(
            expectedResponse.payload.roomName
          );
          expect(response.body.payload.createdBy).toEqual(
            expectedResponse.payload.createdBy
          );
          expect(response.body.payload.members).toEqual(
            expectedResponse.payload.members
          );
          //checks if password is hased
          expect(response.body.payload.password).not.toEqual(
            expectedResponse.payload.password
          );
          done();
        });
      });
  });

  test("Tests a request that a duplicate room name cannot be added", (done) => {
    const req = {
      roomName: "helloWorldcastle12345",
      createdBy: "test@securemeeting.org",
      password: "helloWorld",
      members: [],
    };

    let expectedResponse = new Response(true, null, req);

    return request(app)
      .post("/room/create")
      .send(req)
      .then((response) => {
        RoomRecord.findOne({ roomName: req.roomName }).then((insertedRoom) => {
          expect(response.statusCode).toBe(400);
          expect(response.body.errorName).toBe("Room Already Exists");
          expect(response.body.isSuccess).toBe(false);
          done();
        });
      });
  });
});
