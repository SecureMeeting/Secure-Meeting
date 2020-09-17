const request = require("supertest");
const moment = require("moment");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const { app } = require("../server");
const { Response } = require("../models/Response");
const config = require("../config.json");

describe("Testing the Schedule Room Endpoint", () => {
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

  test("Tests a null request to Schedule a room ", (done) => {
    let req = null;

    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .post("/room/schedule")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null room name to Schedule a room ", (done) => {
    const req = {
      roomName: null,
      timeCreated: moment().format(),
      createdBy: "kyritzb@gmail.com",
      scheduledTime: "12/22/1214",
      password: "helloWorld",
      members: [],
    };

    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .post("/room/schedule")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null Scheduled Time to Schedule a room ", (done) => {
    const req = {
      roomName: "helloworld12345",
      timeCreated: moment().format(),
      createdBy: "kyritzb@gmail.com",
      scheduledTime: null,
      password: "helloWorld",
      members: [],
    };

    let expectedResponse = new Response(
      false,
      "Must have a Scheduled Time",
      null
    );

    return request(app)
      .post("/room/schedule")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a empty room name to Schedule a room ", (done) => {
    const req = {
      roomName: "",
      timeCreated: moment().format(),
      createdBy: "kyritzb@gmail.com",
      password: "helloWorld",
      members: [],
    };

    let expectedResponse = new Response(false, "Must have a Room Name", null);

    return request(app)
      .post("/room/schedule")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a empty Scheduled Time to Schedule a room ", (done) => {
    const req = {
      roomName: "helloworld12345",
      timeCreated: moment().format(),
      createdBy: "kyritzb@gmail.com",
      scheduledTime: "",
      password: "helloWorld",
      members: [],
    };

    let expectedResponse = new Response(
      false,
      "Must have a Scheduled Time",
      null
    );

    return request(app)
      .post("/room/schedule")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a valid room name and scheduled time to Schedule a room ", (done) => {
    const req = {
      roomName: "helloWorldcastle12345764355",
      timeCreated: moment().format(),
      createdBy: "test@securemeeting.org",
      scheduledTime: "12/23/2345",
      password: "helloWorld",
      members: [],
    };

    let expectedResponse = new Response(true, null, req);

    const rooms = db.collection(config.collectionName);

    return request(app)
      .post("/room/schedule")
      .send(req)
      .then((response) => {
        rooms.findOne({ roomName: req.roomName }).then((insertedRoom) => {
          if (insertedRoom == null) {
            expect(insertedRoom).toEqual(null);
          } else {
            //checks the database to see if a correct record was added
            expect(insertedRoom.roomName).toEqual(req.roomName);
            expect(insertedRoom.createdBy).toEqual(req.createdBy);
            expect(insertedRoom.members).toEqual(req.members);
            expect(insertedRoom.password).not.toEqual(req.password);
            expect(insertedRoom.scheduledTime).toEqual(req.scheduledTime);
            //checks the response to make sure a correct response was given
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
            //deletes the record that was added to the database
            rooms.deleteOne({ roomName: req.roomName }).then((deletedRoom) => {
              done();
            });
          }
        });
      });
  });
});
