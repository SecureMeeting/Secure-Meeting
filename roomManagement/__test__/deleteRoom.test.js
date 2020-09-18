const request = require("supertest");
const moment = require("moment");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const { app } = require("../server");
const { Response } = require("../models/Response");
const config = require("../config.json");
const RoomRecord = require("../models/RoomRecord");

describe("Testing the Delete Room Endpoint", () => {
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

  test("Tests a null request to delete a room", (done) => {
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

  test("Tests a request with a empty room name to delete a room", (done) => {
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

  test("Tests a request with a valid room name to delete a room", async (done) => {
    const req = {
      roomName: "helloWorldcastleTest",
    };

    const mockRoom = {
      roomName: "helloWorldcastleTest",
      createdBy: "test123@securemeeting.org",
      timeCreated: "12/12/2012",
      password: "helloWorld",
      members: [],
    };
    //adds a record to the database in order to be returned

    let e1 = new RoomRecord(mockRoom);

    await e1.save();

    let expectedResponse = new Response(true, null, mockRoom);
    return request(app)
      .delete("/room/delete")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.payload).toBe(true);
        done();
      });
  });

  test("Tests a room name that is not in the database to delete a room", (done) => {
    let req = {
      roomName: "helloWorldcastleTest123",
    };

    let expectedResponse = new Response(
      false,
      "A room with that name was not found",
      null
    );

    return request(app)
      .del("/room/delete")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });
});
