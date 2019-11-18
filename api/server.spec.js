const request = require("supertest");

const server = require("./server.js");

it("Should set the database to a testing environment", function() {
  expect(process.env.DB_ENV).toBe("testing");
});

describe("server", function() {
  describe("GET /", function() {
    it("should return 200 OK", function() {
      return request(server)
      .get("/")
      .then(res => {
        expect(res.status).toBe(200);
      });
    });

    it("Should return JSON formatted response", function() {
      return request(server)
      .get("/")
      .then(res => {
        expect(res.type).toMatch(/json/i);
      });
    });

    it("Should return {Message: 'API is running'}", function() {
      const res = await request(server).get('/');
      expect(res.body.api).toBe( 'API is running' )
      expect(res.body).toEqual({ Message: 'API is running' });
    });
  });
});

