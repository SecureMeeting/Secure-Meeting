const request = require("supertest");
const ServerRecord = require("../models/ServerRecord");
const { Response } = require("../models/Response");
const { app } = require("../server");

const { MongoClient } = require("mongodb");
describe("Testing the Get All Server Endpoint", () => {
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

  test("Tests a valid request to get all servers ", async (done) => {
    let req = null;

    const example1 = {
      country: "US",
      region: "US-East3",
      type: "SFU",
      ip: "192.168.1.412",
    };

    const example2 = {
      country: "US",
      region: "US-West-1",
      type: "MCU",
      ip: "192.111.1.412",
    };

    const example3 = {
      country: "CA",
      region: "CA-West-1",
      type: "MCU",
      ip: "192.33.1.412",
    };

    await ServerRecord.deleteMany({});
    let e1 = new ServerRecord(example1);
    let e2 = new ServerRecord(example2);
    let e3 = new ServerRecord(example3);

    await e1.save();
    await e2.save();
    await e3.save();

    return request(app)
      .get("/server/getAll")
      .send(req)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.isSuccess).toEqual(true);
        expect(response.body.errorName).toEqual(null);

        expect(response.body.payload[0].country).toEqual(example1.country);
        expect(response.body.payload[0].region).toEqual(example1.region);
        expect(response.body.payload[0].ip).toEqual(example1.ip);
        expect(response.body.payload[0].type).toEqual(example1.type);

        expect(response.body.payload[1].country).toEqual(example2.country);
        expect(response.body.payload[1].region).toEqual(example2.region);
        expect(response.body.payload[1].ip).toEqual(example2.ip);
        expect(response.body.payload[1].type).toEqual(example2.type);

        expect(response.body.payload[2].country).toEqual(example3.country);
        expect(response.body.payload[2].region).toEqual(example3.region);
        expect(response.body.payload[2].ip).toEqual(example3.ip);
        expect(response.body.payload[2].type).toEqual(example3.type);

        done();
      });
  });
});
