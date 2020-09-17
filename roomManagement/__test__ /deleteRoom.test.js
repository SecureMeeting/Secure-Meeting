const request = require("supertest");
const moment = require("moment");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const { app } = require("../server");
const { Response } = require("../models/Response");
const config = require("../config.json");

describe("Testing the Delete Room Endpoint", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  test("Tests a null request to delete a room ", (done) => {
    let req = null;
    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .delete("/room/delete")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null room name to delete a room ", (done) => {
    const req = {
      roomName: null,
    };

    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .delete("/room/delete")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a empty room name to delete a room ", (done) => {
    const req = {
      roomName: "",
    };

    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .delete("/room/delete")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a valid room name to delete a room ", async (done) => {
    const req = {
      roomName: "helloWorldcastleTest",
    };

    const mockRoom = {
      _id: "some-user-id124",
      roomName: req.roomName,
      createdBy: "test123@securemeeting.org",
      password: "helloWorld",
      members: [],
    };

    const rooms = db.collection(config.collectionName);

    //adds a record to the database in order to be returned
    rooms.insertOne(mockRoom).then(() => {
      let expectedResponse = new Response(true, null, mockRoom);
      return request(app)
        .delete("/room/delete")
        .send(req)
        .then((response) => {
          expect(response.body.payload.deletedCount).toEqual(1);

          //checks the response to make sure a correct response was given
          expect(response.statusCode).toBe(200);

          //attempts to find the record that was deleted from the database
          rooms.findOne({ roomName: req.roomName }).then((room) => {
            expect(room).toEqual(null);
            done();
          });
        });
    });
  });
});
