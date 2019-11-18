const jwt = require('jsonwebtoken'); 
const secrets = require('../config/secrets');

function authenticate (req, res, next){
    const token = req.headers.authorization;
    if(token){ 
        jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
            if(err){
                res.status(401).json({ message: 'The received authorization token is not valid!'});
            }
            else {
                req.user = {email: decodedToken.email};                  
                next();          
            }
        });        
    }       
    else {
        res.status(401).json({ message: 'Please log in or sign up!'});       
    }
}

module.exports = authenticate;