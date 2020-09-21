const request = require("supertest");
const bcrypt = require("bcrypt");

const { MongoClient } = require("mongodb");

const { app } = require("../server");
const { Response } = require("../models/Response");
const UserRecord = require("../models/UserRecord");

describe("Testing the Signup Endpoint", () => {
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

  test("Tests a null request to signup", (done) => {
    let req = null;

    let expectedResponse = new Response(false, "Must have an email", null);

    return request(app)
      .post("/auth/signup")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null email to signup", (done) => {
    const req = {
      email: null,
      password: "THISisApassword123",
    };

    let expectedResponse = new Response(false, "Must have an email", null);

    return request(app)
      .post("/auth/signup")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null password to signup", (done) => {
    const req = {
      email: "kyritzbtest@gmail.com",
      password: null,
    };

    let expectedResponse = new Response(false, "Must have a password", null);

    return request(app)
      .post("/auth/signup")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with an empty email to signup", (done) => {
    const req = {
      email: "",
      password: "THISisApassword123",
    };

    let expectedResponse = new Response(false, "Must have an email", null);

    return request(app)
      .post("/auth/signup")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with an empty password to signup", (done) => {
    const req = {
      email: "kyritzbtest@gmail.com",
      password: "",
    };

    let expectedResponse = new Response(false, "Must have a password", null);

    return request(app)
      .post("/auth/signup")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with an empty email with whitespace to signup", (done) => {
    const req = {
      email: "      ",
      password: "THISisApassword123",
    };

    let expectedResponse = new Response(false, "Must have an email", null);

    return request(app)
      .post("/auth/signup")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a valid email and password to signup", (done) => {
    const req = {
      email: "kyritzbtest@gmail.com",
      password: "password123",
    };

    let expectedResponse = new Response(true, null, req);

    return request(app)
      .post("/auth/signup")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.token).not.toBe(null);
        expect(response.body.payload.email).toBe(req.email);
        expect(response.body.payload.password).not.toBe(req.password);
        done();
      });
  });

  test("Tests a request that has duplicate email", (done) => {
    const req = {
      email: "kyritzbtest@gmail.com",
      password: "password123",
    };

    let expectedResponse = new Response(
      false,
      "An account with this email already exists",
      null
    );

    return request(app)
      .post("/auth/signup")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a valid password is encrypted", (done) => {
    const req = {
      email: "kyritzbtest123@gmail.com",
      password: "password123",
    };

    let expectedResponse = new Response(true, null, req);

    return request(app)
      .post("/auth/signup")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.token).not.toBe(null);
        expect(response.body.payload.email).toBe(req.email);

        bcrypt.compare(req.password, response.body.payload.password, function (
          err,
          result
        ) {
          expect(result).toBe(true);
          expect(err).toBe(undefined);
        });

        done();
      });
  });

  test("Tests a request with a valid email, password, firstName, and lastName to signup", (done) => {
    const req = {
      email: "kyritzbtest12333@gmail.com",
      password: "password123",
      firstName: "bry",
      lastName: "kyr",
    };

    let expectedResponse = new Response(true, null, req);

    return request(app)
      .post("/auth/signup")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.token).not.toBe(null);
        expect(response.body.payload.email).toBe(req.email);
        expect(response.body.payload.password).not.toBe(req.password);
        expect(response.body.payload.firstName).toBe(req.firstName);
        expect(response.body.payload.lastName).toBe(req.lastName);
        done();
      });
  });

  test("Tests a request with a valid email, password, firstName, and lastName with whitespace in the names to signup", (done) => {
    const req = {
      email: "kyritzbtest12333453453453@gmail.com",
      password: "password123",
      firstName: "  BBRRY   ",
      lastName: "  KYRas   ",
    };

    let expectedResponse = new Response(true, null, req);

    return request(app)
      .post("/auth/signup")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.token).not.toBe(null);
        expect(response.body.payload.email).toBe(req.email);
        expect(response.body.payload.password).not.toBe(req.password);
        expect(response.body.payload.firstName).toBe(
          req.firstName.trim().toLocaleLowerCase()
        );
        expect(response.body.payload.lastName).toBe(
          req.lastName.trim().toLocaleLowerCase()
        );
        done();
      });
  });
});
