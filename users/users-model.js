const express = require('express');
const db = require('../database/dbConfig.js');

module.exports = {
    findUserById,
    findAllUsers,
    findUserByEmail,

    addUser,
    updateUser,
    removeUser 
};

function findUserById(id){
    return db('users')
    .where({ 'users.id': id })
    .first();    
}

function findAllUsers(){
    return db('users');
}

function findUserByEmail({ email }){
    return db('users')
    .where({ 'users.email': email})
    .first();
}

function addUser({ first_name, last_name, email, password }){

    return db('users')
    .insert(({ first_name, last_name, email, password }), 'id')
    .then ( ([id]) => {
        return findUserById(id);
    })
}

function updateUser(id, changes){

    return db('users')
    .where('users.id', id)
    .update(changes)
    .then( count => {
        return count > 0 ? findUserById(id) : null;
    })
}

function removeUser(id){

    return db('users')
    .where('users.id', id)
    .delete()
    .then( count => {
        return count > 0 ? count : null;    
    })
}