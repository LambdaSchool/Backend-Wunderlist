const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();

const userModel = require('../users/users-model');
const secrets = require ('../config/secrets.js');

authRouter.post('/register', validateUser, (req, res) => {

  const { first_name, last_name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  
  userModel
  .addUser({ first_name, last_name, email, password: hash })
  .then(user => {

    const token = generateToken(user);
        
    res.status(200).json({ 
      message: `Welcome ${first_name}!`, 
        user : {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password                        
      },
      token,                  
    });
  })

  .catch(error => {
    console.log("registration error", error);
    res.status(500).json({ error: 'There was an error registering the provided user.'})
  })

})

authRouter.post('/login', validateLoginInfo, (req, res) => {

  const { email, password } = req.body;    
  userModel
  .findUserByEmail({ email })    
  .then(user => {

    if(user && bcrypt.compareSync(password, user.password)){

      const token = generateToken(user);
      res.status(200).json({ 
        message: `Welcome ${user.first_name}!`, 
          user : {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          password: user.password                        
        },
        token,                  
      });
    } else {
      res.status(401).json({ message: 'Invalid Credentials!'});
    }
  })
  
  .catch(error => {
    console.log("log in error", error);
    res.status(500).json({ error: 'There was an error logging in.'});
  })
})

function generateToken(user){
  const payload = {
    email: user.email,
    id: user.id        

  };

  const options = {
    expiresIn: '1d'
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

function validateUser(req, res, next){

  const userObject = req.body;
  const firstName = userObject.first_name;
  const lastName = userObject.last_name;
  const email = userObject.email;
  const password = userObject.password;    

  if(!userObject){
    res.status(400).json( {message: 'Missing user data.'} );
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

function validateLoginInfo(req, res, next){

  const loginObject = req.body;
  const email = loginObject.email;
  const password = loginObject.password;     

  if(!loginObject){
    res.status(400).json( {message: 'Missing user data.'} );
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

module.exports = authRouter;