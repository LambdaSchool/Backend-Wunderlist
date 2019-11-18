const express = require('express');

const db = require('../database/dbConfig');

module.exports = {
    findAllTasks, 
    findTaskById,
    findTasksByUserId, 
    findUserTasksByDate,
    findTaskByItemEntry,    
    addTask, 
    updateTask, 
    removeTask
};

function findAllTasks(){
    return db('tasks');
}

function findTaskById(id){
    return db('tasks')
    .where({ 'tasks.id': id})
    .first();
}

function findTasksByUserId(id){
    return db('tasks')
    .join('users', 'tasks.user_id', '=', 'users.id')   
    .where({ 'tasks.user_id': id }) 
    .select('tasks.id', 'tasks.title', 'tasks.completed', 'tasks.created_at')     
    .orderBy( 'tasks.created_at' );
}

function findUserTasksByDate(id, date){
    return db('tasks')
    .join('users', 'tasks.user_id', '=', 'users.id') 
    .where({ 'tasks.user_id': id})  
    .where({ 'tasks.created_at': date })
    .select('tasks.id', 'tasks.title', 'tasks.completed', 'tasks.created_at')     
    .orderBy( 'tasks.created_at' );
}

function findTaskByItemEntry(id, searchItem){
    return db('tasks')
    .join('users', 'tasks.user_id', '=', 'users.id') 
    .where({ 'tasks.user_id': id})      
    .select('tasks.id', 'tasks.title', 'tasks.completed', 'tasks.created_at')     
    .where( 'tasks.title', 'like', `%${searchItem}%` )     
    .orderBy( 'tasks.created_at' );
}

function addTask({title, completed, user_id, created_at}){

    return db('tasks')
    .insert({title, completed, user_id, created_at}, 'id')
    .then( ([id]) => { 
        return findTaskById(id);
    })
    .catch(error => {
        console.log("There was an error adding the provided task", error);
    })    
}

function updateTask(id, changes){
    console.log("changes object", changes);
    return db('tasks')
    .where('tasks.id', id)
    .update(changes)
    .then( count => {
        return count > 0 ? findTaskById(id) : null;   
    })
    .catch(error => {
        console.log("There was an error updating the task", error);
    })  
}

function removeTask(id){
    return db('tasks')
    .where('tasks.id', id)    
    .delete()  
    .then( count => {       
        return count > 0 ? count : null;    
    })
}
