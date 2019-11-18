const bcrypt = require ('bcryptjs');

exports.seed = function(knex) {
  
  return knex('users').insert([
    {
      first_name: 'javascript', 
      last_name: 'language', 
      email: 'javascriptlanguage@lambda.com', 
      password: `${bcrypt.hashSync('test', 8)}`
    },
    {
      first_name: 'react', 
      last_name: 'app', 
      email: 'reactapp@lambda.com', 
      password: `${bcrypt.hashSync('test', 8)}`
    },  
    {
      first_name: 'html', 
      last_name: 'css', 
      email: 'htmlcss@lambda.com', 
      password: `${bcrypt.hashSync('test', 8)}`
    },     
  ]);
};
