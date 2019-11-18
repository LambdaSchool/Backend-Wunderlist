const express = require('express')
const userModel = require('./users-model');

const userRouter = express.Router();

// GET all users: api/users
userRouter.get('/', (req, res) => {

  userModel.findAllUsers()
  .then(users => { 
    if(users.length > 0){            
      res.status(200).json({ users });
    }
    else {
      res.status(404).json({ message: 'There are no registered users.'})
    }
      
  })
  .catch(error => {
    console.log("retrieve users error", error);
    res.status(500).json({ error: 'There was an error retrieving the users from the database.'});
  })
})


// GET Users by ID: api/users/id
userRouter.get('/:id', validateUserId, (req, res) => {

  const { id } = req.params;

  userModel.findUserById(id)
  .then(user => {        
    res.status(200).json(user);        
  })
  .catch(error => {
    console.log("retrieve single user error", error);
    res.status(500).json({ error: 'There was an error retrieving the user from the database.'});
  })
})

// User Update: api/users/id
userRouter.put('/:id', validateUserId, validateUserInfo, (req, res) => {

  const { id } = req.params;
  const changes = req.body;
      
  userModel.updateUser(id, changes)
  .then(updatedUser => {
    res.status(200).json(updatedUser);
  })       
  .catch(error => {
    console.log("update user error", error);
    res.status(500).json({ error: 'There was an error updating the user in the database.'})
  })

})

// Delete user: api/users/id
userRouter.delete('/:id', validateUserId, (req, res) => {

  const { id } = req.params;

  userModel.removeUser(id)
  .then(count => { 
    console.log("deleted", count);
    res.status(200).json( {message: `Deleted ${count} record(s).`});
      
  })
  .catch(error => {
    console.log("delete user error", error);
    res.status(500).json({ error: 'There was an error removing the user from the database.'})
  })

});

// MIDDLEWARE
function validateUserId(req, res, next){
  const userId = req.params.id;
  userModel.findUserById(userId)
  .then(user => {
    if(user){
      next();
    }
    else {
      res.status(404).json( {message: 'The user with the required ID does not exist'} );
    }
  })
};

function validateUserInfo(req, res, next){
  const userObject = req.body;
  const firstName = userObject.first_name;
  const lastName = userObject.last_name;
  const email = userObject.email;
  const password = userObject.password;    

  if(!userObject){
    res.status(400).json( {message: 'Please provided the required user Information.'} );
  }
  else if(!firstName){
    res.status(400).json( {message: 'Missing required first name.'} );
  }
  else if(!lastName){
    res.status(400).json( {message: 'Missing required last name.'} );
  }
  else if(!email){
    res.status(400).json( {message: 'Missing required email.'} );
  }
  else if(!password){
    res.status(400).json( {message: 'Missing required password.'} );
  }
  else {
    next();
  }
};

module.exports = userRouter;