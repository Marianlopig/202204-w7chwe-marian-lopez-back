const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const debug = require("debug")("isdiGram:usersRouterTest");
const User = require("../database/models/User");
const { app } = require("../server");
const connectDB = require("../database");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  const encryptedPassword = await bcrypt.hash("password", 10);
  await User.create({
    username: "Marian",
    password: encryptedPassword,
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a post /users/login endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a 200 status code and a token", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          username: "Marian",
          password: "password",
        })
        .expect(200);
      expect(response.body.token).not.toBeNull();
    });
  });
});

describe("Given a post /users/register endpoint", () => {
  describe("When it receives a new user request", () => {
    test("Then it should respond with a 200 status code and a token", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          username: "Julia",
          password: "password",
        })
        .expect(201);

      expect(response.body.id).not.toBeNull();
      expect(response.body.username).toBe("Julia");
    });
  });
  describe("When it receives an already existing user request", () => {
    test("Then it should respond with a 200 status code and a token", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          username: "Marian",
          password: "password",
        })
        .expect(409);

      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("user already exists");
    });
  });
});
