const request = require("supertest");
const bcrypt = require("bcrypt");

const { MongoClient } = require("mongodb");

const { app } = require("../server");
const { Response } = require("../models/Response");
const UserRecord = require("../models/UserRecord");

describe("Testing the Login Endpoint", () => {
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

  test("Tests a null request to login", (done) => {
    let req = null;

    let expectedResponse = new Response(false, "Must have an email", null);

    return request(app)
      .post("/auth/login")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null email to login", (done) => {
    const req = {
      email: null,
      password: "THISisApassword123",
    };

    let expectedResponse = new Response(false, "Must have an email", null);

    return request(app)
      .post("/auth/login")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a null password to login", (done) => {
    const req = {
      email: "helloworld@gmail.com",
      password: null,
    };

    let expectedResponse = new Response(false, "Must have a password", null);

    return request(app)
      .post("/auth/login")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with an empty email to login", (done) => {
    const req = {
      email: "",
      password: "THISisApassword123",
    };

    let expectedResponse = new Response(false, "Must have an email", null);

    return request(app)
      .post("/auth/login")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with an empty password to login", (done) => {
    const req = {
      email: "helloworld@gmail.com",
      password: "",
    };

    let expectedResponse = new Response(false, "Must have a password", null);

    return request(app)
      .post("/auth/login")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);
        done();
      });
  });

  test("Tests a request with a valid email and password to login", async (done) => {
    const req = {
      email: "helloworld1234@gmail.com",
      password: "12434657543",
    };

    let expectedResponse = new Response(false, "Must have a password", null);

    //creates the account
    await request(app).post("/auth/signup").send(req);

    //logs in
    return request(app)
      .post("/auth/login")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.isSuccess).toBe(true);
        expect(response.body.errorName).toBe(null);
        expect(response.body.token).not.toBe(undefined); //makes sure theres an authentication token

        done();
      });
  });

  test("Tests a request with a invalid email and password to login", async (done) => {
    const req = {
      email: "helloworld123123asdsad44@gmail.com",
      password: "124346w57543",
    };

    let expectedResponse = new Response(false, "Must have a password", null);

    //logs in
    return request(app)
      .post("/auth/login")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.isSuccess).toBe(false);
        expect(response.body.errorName).toBe("Unable to find the account.");
        done();
      });
  });

  test("Tests a request with a valid email and incorrect password to login", async (done) => {
    const signupReq = {
      email: "hello@gmail.com",
      password: "123",
    };

    const loginReq = {
      email: "hello@gmail.com",
      password: "123123",
    };

    let expectedResponse = new Response(false, "Incorrect password", null);

    //creates the account
    await request(app).post("/auth/signup").send(signupReq);

    //logs in
    return request(app)
      .post("/auth/login")
      .send(loginReq)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(expectedResponse);

        done();
      });
  });
});
