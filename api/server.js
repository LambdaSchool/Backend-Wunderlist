const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRouter = require('../auth/auth-router');
const usersRouter = require('../users/users-router');
const tasksRouter = require('../tasks/tasks-router');

const authenticate = require('../auth/authenticate-middleware');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/users', authenticate, usersRouter);
server.use('/api/todo', authenticate, tasksRouter);

server.get('/', (req, res) => {
    res.status(200).json({ Message: 'Server is running' });
});  

module.exports = server;