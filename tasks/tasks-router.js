const express = require('express');
let moment = require('moment');

const tasksModel = require('./tasks-model');
const usersModel = require('../users/users-model');
const tasksRouter = express.Router();

// Getting all available tasks: api/todo/tasks
tasksRouter.get('/tasks', (req, res) => {
    tasksModel.findAllTasks()
    .then(tasks => { 
        if(tasks.length > 0){            
            res.status(200).json({ tasks });
        }
        else {
            res.status(404).json({ message: 'No task entries were found.'})
        }
        
    })
    .catch(error => {
        console.log("retrieve users error", error);
        res.status(500).json({ error: 'There was an error retrieving the task entries from the database.'});
    })
})

// Getting a task by task id: api/todo/tasks/:id
tasksRouter.get('/tasks/:id', validateTaskId, (req, res) => {
    const { id } = req.params;
    tasksModel.findTaskById(id)
    .then(task => {            
        res.status(200).json(task); 
       
    })
    .catch(error => {
        console.log("retrieve tasks by task id error", error);
        res.status(500).json({ error: 'There was an error retrieving the tasks from the database.'});
    })
})
// Getting a user's tasks by user's id: api/todo/users/id/tasks
tasksRouter.get('/users/:id/tasks', validateUserId, (req, res) => {
    const { id } = req.params;
    tasksModel.findTasksByUserId(id)
    .then(tasks => {  
        if(tasks.length > 0){      
            res.status(200).json(tasks);   
        }
        else{
            res.status(404).json({ message: 'There are no tasks for that user.' });
        }     
    })
    .catch(error => {
        console.log("retrieve tasks by user id error", error);
        res.status(500).json({ error: 'There was an error retrieving the requested tasks from the database.'});
    })
})

// Getting user tasks by date: api/todo/users/id/tasks/date
tasksRouter.get('/users/:id/tasks/:date', validateUserId, validateItemDateFormat, (req, res) => {

    const id = req.params.id;
    const date = req.params.date;    
  
    tasksModel.findUserTasksByDate(id, date)
    .then(tasks => {
      if (tasks.length > 0) {
         res.status(200).json(tasks);
      }
      else {
        res.status(404).json({ message: 'There are no tasks for that date.' });
      }
    })
    .catch (err => {
      res.status(500).json({ message: 'There was an error retrieving tasks for that date.' });
    });
})

// Getting user tasks by search item: api/todo/users/id/search/searchItem
tasksRouter.get('/users/:id/search/:searchItem', validateUserId, (req, res) => {

    const id = req.params.id;
    const searchItem = req.params.searchItem;    
  
    tasksModel.findTaskByItemEntry(id, searchItem)
    .then(tasks => {
      if (tasks.length > 0) {
        res.status(200).json(tasks);
      }
      else {
        res.status(404).json({ message: 'There are no tasks matching your search query.' });
      }
    })
    .catch (err => {
      res.status(500).json({ message: 'There was an error retrieving tasks for that search.' });
    });
})

// Adding a new item: api/todo/users/id/tasks
tasksRouter.post('/users/:id/tasks', validateUserId, validateTaskInfo, (req, res) => {

    const { id } = req.params;
    const {title, completed} = req.body;
    
    tasksModel.addTask({title, completed, user_id: id, created_at: moment().format('MM-DD-YYYY')})
    .then(item => {
        console.log("added item", item);
        res.status(200).json(item);
    })
    .catch(error => {
        res.status(500).json({ error: 'There was an error adding the item to the database.'});
    })
    
})

// Updating an item: api/todo/tasks/id
tasksRouter.put('/tasks/:id', validateTaskId, validateTaskInfo, (req, res) => {

    const { id } = req.params;
    const changes = req.body;
    tasksModel.updateTask(id, changes)
    .then(updatedTask => {
        res.status(200).json(updatedTask);
    })         
    .catch(error => {
        res.status(500).json({ error: 'There was an error updating the task in the database.'})
    })
})

// Deleting an item: api/todo/tasks/id
tasksRouter.delete('/tasks/:id', validateTaskId, (req, res) => {
    const { id } = req.params;
    tasksModel.removeTask(id)
    .then(count => {     
        console.log("deleted tasks", count);
        res.status(200).json( {message: `Deleted ${count} todo task(s).`});     
    })
    .catch(error => {
        console.log("task removal error", error);
        res.status(500).json({ error: 'There was an error removing the task from the database.'})
    })

});

// Task by ID Validation
function validateTaskId(req, res, next){
    const taskId = req.params.id;
    tasksModel.findTaskById(taskId)
    .then(task => {
        if(task){
            next();
        }
        else {
            res.status(404).json( {message: 'A task with that id does not exist.'} );
        }
    })
};

// User by ID Validation
function validateUserId(req, res, next){
    const userId = req.params.id;
    usersModel.findUserById(userId)
    .then(user => {
        if(user){
            next();
        }
        else {
            res.status(404).json( {message: 'There is no user with the provided information in the database'} );
        }
    })
};

// Date Format Validation
function validateItemDateFormat(req, res, next){
    const taskDate = req.params.date;    
    let momentDate = moment(taskDate , "MM-DD-YYYY", true);
    
    if (momentDate.isValid()) {
        next();
    } 
    else {
        res.status(404).json( {message: 'Date must be in the format MM-DD-YYYY.'} );
    } 
};

// Task Validation
function validateTaskInfo(req, res, next){
    const taskObject = req.body;
    const taskCompleted = taskObject.completed;
    const taskTitle = taskObject.title;    

    if(!taskObject){
        res.status(400).json( {message: 'Missing task information.'} );
    }
    else if(!taskCompleted){
       res.status(400).json( {message: 'Missing required task status.'} );
    }
    else if(!taskTitle){
        res.status(400).json( {message: 'Missing required task title.'} );
    }
    else {
        next();
    }
};

module.exports = tasksRouter;