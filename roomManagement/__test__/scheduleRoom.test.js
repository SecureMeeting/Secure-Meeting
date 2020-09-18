const request = require("supertest");
const moment = require("moment");
const { MongoClient } = require("mongodb");

const { app } = require("../server");
const { Response } = require("../models/Response");
const RoomRecord = require("../models/RoomRecord");

describe("Testing the Schedule Room Endpoint", () => {
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

  test("Tests a null request to Schedule a room", (done) => {
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

  test("Tests a request with a null room name to Schedule a room", (done) => {
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

  test("Tests a request with a null Scheduled Time to Schedule a room", (done) => {
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

  test("Tests a request with a empty room name to Schedule a room", (done) => {
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

  test("Tests a request with a empty Scheduled Time to Schedule a room", (done) => {
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

  test("Tests a request with a valid room name and scheduled time to Schedule a room", (done) => {
    const req = {
      roomName: "helloWorldcastle12345764355",
      timeCreated: moment().format(),
      createdBy: "test@securemeeting.org",
      scheduledTime: "12/23/2345",
      password: "helloWorld",
      members: [],
    };

    let expectedResponse = new Response(true, null, req);

    return request(app)
      .post("/room/schedule")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(200);

        expect(response.body.payload.roomName).toEqual(req.roomName);
        expect(response.body.payload.createdBy).toEqual(req.createdBy);
        expect(response.body.payload.members).toEqual(req.members);
        expect(response.body.payload.password).not.toEqual(req.password);
        expect(response.body.payload.scheduledTime).toEqual(req.scheduledTime);

        done();
      });
  });
});
