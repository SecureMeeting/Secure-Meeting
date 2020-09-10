const request = require("supertest");
const moment = require("moment");
const { MongoClient } = require("mongodb");

const { app } = require("../server");
const { Response } = require("../models/Response");
const config = require("../config.json");

describe("Testing the Create Room Endpoint", () => {
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

  test("Tests a null request to create a room ", (done) => {
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

  test("Tests a request with a null room name to create a room ", (done) => {
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

  test("Tests a request with a empty room name to create a room ", (done) => {
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

  test("Tests a request with a valid room name to create a room ", (done) => {
    const req = {
      roomName: "helloWorldcastle",
      timeCreated: moment().format(),
      createdBy: "test@securemeeting.org",
      password: "helloWorld",
      members: [],
    };

    let expectedResponse = new Response(true, null, req);

    return request(app)
      .post("/room/create")
      .send(req)
      .then((response) => {
        const rooms = db.collection(config.collectionName);

        rooms.findOne({ roomName: req.roomName }).then((insertedRoom) => {
          //checks the database to see if a correct record was added
          expect(insertedRoom.roomName).toEqual(req.roomName);
          expect(insertedRoom.timeCreated).toEqual(req.timeCreated);
          expect(insertedRoom.createdBy).toEqual(req.createdBy);
          expect(insertedRoom.password).toEqual(req.password);
          expect(insertedRoom.helloWorld).toEqual(req.helloWorld);

          //checks the response to make sure a correct response was given
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual(expectedResponse);

          //deletes the record that was added to the database
          rooms.deleteOne({ roomName: req.roomName }).then((deletedRoom) => {
            console.log("deleted the room");
          });
          done();
        });
      });
  });
});
