const request = require('supertest'); 
const server = require('../api/server.js');
const db = require('../database/dbConfig.js');

describe('authRouter.js', () => {

    beforeEach(async () => {
        await db('users').truncate();
    })

    it('Should set up the environment to testing', () => {
        expect(process.env.DB_ENV).toBe('testing');
    })
});

describe('authRouter.js', () => {

    describe('POST /api/auth/register', () => {
      it('Should register a new user', () => {
        return request(server)
        .post('/api/auth/register')
        .send({
          "first_name": "lambda",
          "last_name": "student",
          "email": "lambdastudent@lambda.com",
          "password": "test"
        })
        .then(res => {
        expect(res.status).toBe(200);
        })
      })
      it('Should return a JSON object', () => {
        return request(server)
        .post('/api/auth/register')
        .send({
          "first_name": "lambdaOne",
          "last_name": "studentOne",
          "email": "lambdastudentOne@lambda.com",
          "password": "test"
        })
        .then(res => {
        expect(res.type).toMatch(/json/i);
        });
      });
    });
    
    describe('POST /api/auth/login', () => {
      it('Should result in a successful login', () => {
        return request(server)
        .post('/api/auth/login')
        .send({
          email: "lambdastudent@lambda.com",
          password: "test"
        })
        .then(res => {
          expect(res.status).toBe(200);
        })
      });

      it('Should returns JSON', () => {
        return request(server)
        .post('/api/auth/login')
        .send({
          email: "lambdastudent@lambda.com",
          password: "test"
        })
        .then(res => {            
          expect(res.type).toMatch(/json/i);
        });
      });
    });
});    