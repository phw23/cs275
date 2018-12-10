// Import Modules
var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var fs = require('fs');
var bodyParser = require("body-parser");
var nbaFile = require('./NBA');
var gamesFile = require('./Games');

var app = express();
app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var games = new gamesFile.Games()
var nba = new nbaFile.NBA();

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

// Default page
app.get('/', function (req, resp) { resp.send(fs.readFileSync('SportWatcher.html', 'utf8')); })

// Return team data in database
app.get('/teams', function (req, resp) {
	var queryStr = 'Select * from team;'
	con.query(queryStr, function (err, rows, fields) {
		if (err)
			console.log('Error during query processing: ' + err);
		else
			resp.send(rows);
	});
})

// Create an account
app.post('/signup', function (req, resp) {
	var user = req.body.user;
	var password = req.body.password;
	var team = req.body.team;
	var queryStr = 'Select * from user;'
	con.query(queryStr, function (err, rows, fields) {
		if (err)
			console.log('Error during query processing: ' + err);
		else {
			rows = rows.filter(u => u.id === user)
			if (rows.length === 0) {
				// Todo: Protect from injection later
				bcrypt.hash(password, 10, function (err, hash) {
					var insertStr = "Insert into user (id, pass) VALUES ('" + user + "', '" + hash + "');"
					con.query(insertStr, function (err) {
						if (err) {
							console.log('Error during user insert: ' + err)
							resp.send(fs.readFileSync('SportWatcher.html', 'utf8'));
						}
						else {
							var queryStr = 'Select id from team WHERE team="' + team + '";'
							con.query(queryStr, function (err, rows, fields) {
								if (err) {
									console.log('Error during team query processing: ' + err);
									resp.send(fs.readFileSync('SportWatcher.html', 'utf8'));
								} else {
									if (rows.length > 0) {
										var teamID = rows[0].id;
										console.log(teamID)
										var insertTeamStr = "Insert into user_team (user_id, team_id) VALUES ('" + user + "', '" + teamID + "');"
										con.query(insertTeamStr, function (err) {
											if (err) {
												console.log('Error during user_team insert: ' + err)
												resp.send(fs.readFileSync('SportWatcher.html', 'utf8'));
											}
											else {
												games.once('Finished', function (msg) {
													resp.send(msg);
												})
												games.displayGames();
											}
										});
									} else {
										console.log("Improper team selected");
										resp.send(fs.readFileSync('SportWatcher.html', 'utf8'));
									}
								}
							});
						}
					});
				});
			} else { resp.send(fs.readFileSync('SportWatcher.html', 'utf8')); }
		}
	});
})

// Validate username password combination
app.post('/login', function (req, resp) {
	var user = req.body.user;
	var password = req.body.password;
	var queryStr = 'Select * from user;'
	con.query(queryStr, function (err, rows, fields) {
		if (err)
			console.log('Error during query processing: ' + err);
		else {
			row = rows.find(u => u.id === user)
			if (rows.length > 0) {
				bcrypt.compare(password, row.pass, function (err, result) {
					if (result){
						games.once('Finished', function (msg) {
							resp.send(msg);
						})
						games.displayGames();
					} else {resp.send(fs.readFileSync('SportWatcher.html', 'utf8'));}
				});
			} else {resp.send(fs.readFileSync('SportWatcher.html', 'utf8'));}
		}
	});
})


// Returns game by id
app.get('/api/game', function (req, resp) {
	var id = req.query.id;
	nba.once('Finished', function (msg) {
		resp.send(msg);
	})
	nba.getGameByID(id);
})

// Returns all games for today
app.get('/api/games', function (req, resp) {
	nba.once('Finished', function (msg) {
		resp.send(msg);
	})
	nba.getGames();
})

// Server listener
app.listen(8080, function () {
	console.log('Server Started...');
	console.log();
});
