const request = require("supertest");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

const { app } = require("../server");
const { Response } = require("../models/Response");

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
      roomName: "helloWorldcastle",
      password: "helloworld",
    };

    bcrypt.hash(req.password, process.env.SALT_ROUNDS, async function (
      err,
      hashPassword
    ) {
      var mockRoom = {
        _id: "some-user-id32423443",
        roomName: req.roomName,
        createdBy: "test@securemeeting.org",
        password: hashPassword,
        members: [],
      };

      const rooms = db.collection(process.env.COLLECTION_NAME);

      //adds a record to the database in order to be returned
      await rooms.insertOne(mockRoom);

      let expectedResponse = new Response(true, null, true);

      return request(app)
        .post("/room/auth")
        .send(req)
        .then((response) => {
          expect(response.body).toEqual(expectedResponse);
          expect(response.statusCode).toBe(200);
          //deletes the record that was added to the database
          rooms.deleteOne({ roomName: req.roomName }).then((deletedRoom) => {
            done();
          });
        });
    });
  });

  test("Tests a request with a valid room name and no password", async (done) => {
    const req = {
      roomName: "helloWorldcastle",
      password: "helloworld",
    };

    bcrypt.hash(req.password, process.env.SALT_ROUNDS, async function (
      err,
      hashPassword
    ) {
      var mockRoom = {
        _id: "some-user-id32423443",
        roomName: req.roomName,
        createdBy: "test@securemeeting.org",
        members: [],
      };

      const rooms = db.collection(process.env.COLLECTION_NAME);

      //adds a record to the database in order to be returned
      await rooms.insertOne(mockRoom);

      let expectedResponse = new Response(true, null, true);

      return request(app)
        .post("/room/auth")
        .send(req)
        .then((response) => {
          expect(response.body).toEqual(expectedResponse);
          expect(response.statusCode).toBe(200);
          //deletes the record that was added to the database
          rooms.deleteOne({ roomName: req.roomName }).then((deletedRoom) => {
            done();
          });
        });
    });
  });
});
