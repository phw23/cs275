'use strict'
var mysql = require('mysql');
var EventEmitter = require('events').EventEmitter;

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'sport',
    multipleStatements : true
});

con.connect(function(err){
    if (err){
        console.log("Error Connecting");
    }
    else {
        console.log("Database Connection Successful");
    }
})

// Returns the api id for the desired team from the DB
class teamQuery extends EventEmitter{
    constructor() {
        super();
    }

    query(team){
        var self = this;
        con.query("SELECT api from team WHERE team.team='"+team+"';",
    function(err, rows, fields){
        if (err) {
            console.log("ERROR BITCH: "+err);
        }
        else{
            var apiKey = rows[0].api;
            //console.log("Running",apiKey);
            self.emit('yoyo',apiKey);
            //console.log("First",apiKey);
            //console.log(rows[0].api)

            }
        })
    }
}

exports.teamQuery = teamQuery;