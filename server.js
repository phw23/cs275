// Import Modules
var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var fs = require('fs');
var bodyParser = require("body-parser");
var nbaFile = require('./NBA')

var app = express();
app.use(express.static('.'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


/* Emitter 
var t = new topics.Topics();
app.get('/topics', function(req, resp){
	t.once('Finished', function (msg) {
		resp.send(msg);
	})
	t.getTopics()
});
*/

// Connect to database
var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'sport'
});
con.connect(function (err) {
	if (err) {
		console.log("Error connecting to database: " + err);
	} else {
		console.log("Database successfully connected");
		console.log();
	}
});

app.get('/', function (req, resp) { resp.send(fs.readFileSync('SportWatcher.html', 'utf8'));})

app.get('/teams', function (req, resp) {
	var queryStr = 'Select * from team;'
	con.query(queryStr, function (err, rows, fields) {
		if (err)
			console.log('Error during query processing: ' + err);
		else
			console.log(rows)
			resp.send(rows);
	});
})

// Todo: Make Post 
app.get('/signup', function (req, resp) {
	var user = req.query.user;
	var password = req.query.password;
	var queryStr = 'Select * from user;'
	con.query(queryStr, function (err, rows, fields) {
		if (err)
			console.log('Error during query processing: ' + err);
		else
			rows = rows.filter(u => u.id === user)
			if (rows.length === 0) {
				// Todo: Protect from injection later
				bcrypt.hash(password, 10, function(err, hash) {
					var insertStr = "Insert into user (id, pass) VALUES ('" + user + "', '" + hash + "');"
					con.query(insertStr, function (err) {
						if (err) {console.log('Error during user insert: ' + err)}
						else {resp.send(true);}
					});
				});
			} else (resp.send(false)) 
			
	});
})

// Todo: Make Post
app.get('/login', function (req, resp) {
	var user = req.query.user;
	var password = req.query.password;
	var queryStr = 'Select * from user;'
	con.query(queryStr, function (err, rows, fields) {
		if (err)
			console.log('Error during query processing: ' + err);
		else
			row = rows.find(u => u.id === user)
			if (rows.length > 0) {
				bcrypt.compare(password, row.pass, function(err, result) {
					resp.send(result)
				});
			} else (resp.send(false)) 
			
	});
})

var nba = new nbaFile.NBA();
app.get('/api', function(req, resp){
	nba.once('Finished', function (msg) {
		resp.send(msg);
	})
	// Todo: Get current Date
	var date = {
		year:'2018',
		month:'12',
		day:'1'
	}
	// Todo: Find team from request and input id from database
	var team = 'Knicks'
	nba.getGame(date,team)
})

// Server listener
app.listen(8080, function () {
	console.log('Server Started...');
	console.log();
});
