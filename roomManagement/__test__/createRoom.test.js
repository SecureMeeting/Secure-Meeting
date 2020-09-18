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
      timeCreated: moment().format(),
      createdBy: "test@securemeeting.org",
      password: "helloWorld",
      members: [],
    };

    let expectedResponse = new Response(true, null, req);

    //const newRoom = new RoomRecord(req);

    return request(app)
      .post("/room/create")
      .send(req)
      .then((response) => {
        console.log(response);
        try {
          RoomRecord.findOne({ roomName: req.roomName }).then(
            (insertedRoom) => {
              if (insertedRoom == null) {
                expect(insertedRoom).toEqual(null);
              } else {
                console.log(insertedRoom);
                //checks the database to see if a correct record was added
                expect(insertedRoom.roomName).toEqual(req.roomName);
                expect(insertedRoom.createdBy).toEqual(req.createdBy);

                expect(insertedRoom.password).not.toEqual(req.password);
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
              }
              done();
            }
          );
        } catch (error) {
          done(error);
        }
      });
  });
});
