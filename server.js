// Import Modules
var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var fs = require('fs');
var bodyParser = require("body-parser");

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

// Single database endpoints
app.get('/', function (req, resp) { resp.send(fs.readFileSync('SportWatcher.html', 'utf8'));})

// Single database endpoints
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

// Single database endpoints
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
				// Protect from injection later
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

// Single database endpoints
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
				// Protect from injection later
				bcrypt.compare(password, row.pass, function(err, result) {
					resp.send(result)
				});
			} else (resp.send(false)) 
			
	});
})


// Checking password bcrypt.compare(password, hash, function(err, result) {});



// Server listener
app.listen(8080, function () {
	console.log('Server Started...');
	console.log();
});
