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

// Get request takes a team name (i.e. "Knicks" or "Celtics") and returns stats about their game today if one exists
var nba = new nbaFile.NBA();
app.get('/api', function(req, resp){
	nba.once('Finished', function (msg) {
		resp.send(msg);
	})
	var today = new Date();
	var date = {
		year:today.getFullYear(),
		month:today.getMonth()+1,
		day:today.getDate()
	}
	var teamName = req.query.team
	// Todo: Protect from injection later
	var queryStr = 'Select teamID from team WHERE team=' + teamName + ';'
	con.query(queryStr, function (err, rows, fields) {
		if (err) {
			console.log('Error during query processing: ' + err);
			resp.send('Error during query processing: ' + err);
		} else {
			if (rows.length > 0 ){
				nba.getGame(date,rows[0].teamID)
			} else {
				resp.send("Improper team selected")
			}
		}
	});
})

// Server listener
app.listen(8080, function () {
	console.log('Server Started...');
	console.log();
});
