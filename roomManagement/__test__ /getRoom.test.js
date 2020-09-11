const request = require("supertest");
const moment = require("moment");
const { MongoClient } = require("mongodb");

const { app } = require("../server");
const { Response } = require("../models/Response");
const config = require("../config.json");

describe("Testing the Get Room Endpoint", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(config.atlasuri, {
      useNewUrlParser: true,
    });
    db = await connection.db(config.dbName);
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
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
      roomName: "helloWorldcastle",
    };

    const mockRoom = {
      _id: "some-user-id",
      roomName: req.roomName,
      createdBy: "test@securemeeting.org",
      password: "helloWorld",
      members: [],
    };

    const rooms = db.collection(config.collectionName);

    //adds a record to the database in order to be returned
    await rooms.insertOne(mockRoom);

    let expectedResponse = new Response(true, null, mockRoom);

    return request(app)
      .get("/room/get")
      .send(req)
      .then((response) => {
        rooms.findOne({ roomName: req.roomName }).then((retrievedRoom) => {
          //checks the database to see if a correct record was retrieved
          expect(retrievedRoom.roomName).toEqual(
            expectedResponse.payload.roomName
          );
          expect(retrievedRoom.createdBy).toEqual(
            expectedResponse.payload.createdBy
          );
          expect(retrievedRoom.members).toEqual(
            expectedResponse.payload.members
          );

          //checks the response to make sure a correct response was given
          expect(response.statusCode).toBe(200);

          //deletes the record that was added to the database
          rooms.deleteOne({ roomName: req.roomName }).then((deletedRoom) => {
            done();
          });
        });
      });
  });
});
