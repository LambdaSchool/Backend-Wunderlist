let moment = require('moment');

exports.up = function(knex) {
    return knex.schema

    .createTable('users', tbl => {
        tbl.increments();

        tbl.string('first_name', 255)
        .notNullable();

        tbl.string('last_name', 255)
        .notNullable();

        tbl.string('email', 255)
        .unique()
        .notNullable();
        
        tbl.string('password', 128)
        .notNullable();       
    }) 

    .createTable('tasks', tbl => {
        tbl.increments();

        tbl.string('title')
        .notNullable()        

        tbl.boolean('completed')
        .defaultTo(false)
        .notNullable()      

        tbl.string('created_at')
        .defaultTo(moment(knex.fn.now())
        .format("MM-DD-YYYY"))
        
        tbl.integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });    
};

exports.down = function(knex) {

    return knex.schema
    .dropTableIfExists('tasks')
    .dropTableIfExists('users');
};
