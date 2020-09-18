const request = require("supertest");
const ServerRecord = require("../models/ServerRecord");
const { Response } = require("../models/Response");
const { app } = require("../server");

const { MongoClient } = require("mongodb");

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

  test("Tests a null request to create a server", (done) => {
    let req = null;

    let expectedResponse = new Response(false, "Must have a Server Ip", null);

    return request(app)
      .post("/server/create")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null ip to create a server", (done) => {
    const req = {
      country: "US",
      region: "US-East3",
      type: "SFU",
      ip: null,
    };

    let expectedResponse = new Response(false, "Must have a Server Ip", null);

    return request(app)
      .post("/server/create")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a empty ip to create a server", (done) => {
    const req = {
      country: "US",
      region: "US-East3",
      type: "SFU",
      ip: "",
    };

    let expectedResponse = new Response(false, "Must have a Server Ip", null);

    return request(app)
      .post("/server/create")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null country to create a server", (done) => {
    const req = {
      country: null,
      region: "US-East3",
      type: "SFU",
      ip: "192.168.1.1",
    };

    let expectedResponse = new Response(false, "An error occured", null);

    return request(app)
      .post("/server/create")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null region to create a server", (done) => {
    const req = {
      country: "US",
      region: null,
      type: "SFU",
      ip: "192.168.1.1",
    };

    let expectedResponse = new Response(false, "An error occured", null);

    return request(app)
      .post("/server/create")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with no ip attribute to create a server", (done) => {
    const req = {
      country: "US",
      region: null,
      type: "SFU",
    };

    let expectedResponse = new Response(false, "Must have a Server Ip", null);

    return request(app)
      .post("/server/create")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with no type attribute to create a server", (done) => {
    const req = {
      country: "US",
      region: "Us-East-4",
      ip: "192.168.1.1",
    };

    let expectedResponse = new Response(false, "An error occured", null);

    return request(app)
      .post("/server/create")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with no region attribute to create a server", (done) => {
    const req = {
      country: "US",
      type: "SFU",
      ip: "192.168.1.1",
    };

    let expectedResponse = new Response(false, "An error occured", null);

    return request(app)
      .post("/server/create")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with no country attribute to create a server", (done) => {
    const req = {
      region: null,
      type: "SFU",
      ip: "192.168.1.1",
    };

    let expectedResponse = new Response(false, "An error occured", null);

    return request(app)
      .post("/server/create")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a valid values to create a server", (done) => {
    const req = {
      country: "US",
      region: "US-East3",
      type: "SFU",
      ip: "192.168.1.1",
    };
    let expectedResponse = new Response(true, null, req);

    return request(app)
      .post("/server/create")
      .send(req)
      .then((response) => {
        ServerRecord.findOne({ ip: req.ip }).then((insertedRoom) => {
          //checks the response to make sure a correct response was given
          expect(response.statusCode).toBe(200);
          expect(response.body.payload.ip).toEqual(expectedResponse.payload.ip);
          expect(response.body.payload.region).toEqual(
            expectedResponse.payload.region
          );
          expect(response.body.payload.type).toEqual(
            expectedResponse.payload.type
          );
          expect(response.body.payload.country).toEqual(
            expectedResponse.payload.country
          );

          done();
        });
      });
  });

  test("Tests a request that a duplicate server ip cannot be added", (done) => {
    const req = {
      country: "US",
      region: "US-East3",
      type: "SFU",
      ip: "192.168.1.1",
    };
    let expectedResponse = new Response(true, null, req);

    return request(app)
      .post("/server/create")
      .send(req)
      .then((response) => {
        ServerRecord.findOne({ ip: req.ip }).then((insertedRoom) => {
          //checks the response to make sure a correct response was given
          expect(response.statusCode).toBe(400);

          expect(response.body.errorName).toBe(
            "Server with that Ip already exists"
          );

          expect(response.body.isSuccess).toBe(false);

          done();
        });
      });
  });
});
