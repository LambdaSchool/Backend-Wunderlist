const server = require('../api/server.js');
const request = require('supertest');
const UserModel = require('./users-model.js');
const db = require('../database/dbConfig.js');

describe('users model', () => {
    beforeEach(async () => {
        await db('users').truncate();
    })

    it('Should set the environment to testing', () => {
        expect(process.env.DB_ENV).toBe('testing');
    })
   
});

describe('addUser()', () => {
    beforeEach(async () => {
        await db('users').truncate();
    })

    it('Should add user into the database', async () => {
        await UserModel.addUser({ 
            first_name: 'testUser', 
            last_name: 'numberOne', 
            email: 'testUser@lambda.com',                  
            password: 'test' 
        });

        let userModel = await db('users');
        expect(userModel).toHaveLength(1);
    });
});

describe('updateUser()', () => {
    beforeEach(async () => {
        await db('users').truncate();
    })

    it('should insert/register users into the database (update)', async () => {
        await UserModel.addUser({ 
            first_name: 'testUserUpdated', 
            last_name: 'NumberOneUpdated', 
            email: 'testUser@lambda.com',                  
            password: 'test' 
        });

        await UserModel.addUser({ 
            first_name: 'testUserUpdated', 
            last_name: 'numberOneUpdated', 
            email: 'testUserUpdated@lambda.com',                  
            password: 'test' 
        });

        let userModel = await db('users');
        expect(userModel).toHaveLength(2);         
   
        let userToUpdate =  { 
            first_name: 'testUserUpdated 00', 
            last_name: 'NumberOneUpdated 00', 
            email: 'testUser00@lambda.com',                  
            password: 'test' 
        };
        
        let updatedUser = await UserModel.updateUser(2, userToUpdate);
        expect(updatedUser.first_name).toBe('testUserUpdated 00');
        expect(updatedUser.last_name).toBe('NumberOneUpdated 00');
        expect(updatedUser.email).toBe('testUser00@lambda.com');
    })
});