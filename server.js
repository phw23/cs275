// Import Modules
var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var fs = require('fs');
var request = require('request');
var bodyParser = require("body-parser");
var queryModule = require('./teamQuery.js');
var q = new queryModule.teamQuery();
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
	user: 'Peter',
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
	console.log("User",user,"Password",password);
	var queryStr = 'Select * from user;'
	con.query(queryStr, function (err, rows, fields) {
		if (err)
			console.log('Error during query processing: ' + err);
		else {
			row = rows.find(u => u.id === user)
			if (rows.length > 0) {
				bcrypt.compare(password, row.pass, function (err, result) {
					if (result){
						// resp.send("test");
						games.once('Finished', function (msg) {			
							resp.send(""+msg);
							//resp.send("test");
							//console.log(msg);
							resp.end();
						})
						games.displayGames();
						console.log("Games ran");
					} else {resp.send(fs.readFileSync('SportWatcher.html', 'utf8'));}
				});
			} else {resp.send(fs.readFileSync('SportWatcher.html', 'utf8'));}
		}
	});
})


// Returns game by id
app.get('/game', function (req, resp) {
	var team = req.query.team;
	// var team = 'Pistons';
	// console.log(team);
	var today = new Date();
        var date = {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate()
        };
        // Today's Schedule URL
        var url1 = 'http://api.sportradar.us/nba/trial/v5/en/games/' + date.year + '/' + date.month + '/' + date.day + '/' + 'schedule.json?api_key=6t44kv4tbv7sa3px9uhf4fqd';
    // var url1 = "http://api.sportradar.us/nba/trial/v5/en/games/2018/12/10/schedule.json?api_key=6t44kv4tbv7sa3px9uhf4fqd"
    q.once('yoyo',function(msg){
        
        request.get(url1, function(error, response, body){
            var json = JSON.parse(body);
            var numGames = json.games.length;
            
            for(var i = 0;i<numGames;i++){
                if (json.games[i].away.id === msg || json.games[i].home.id === msg){
                    console.log("I found the Game!");
                    // res.write(""+url2)
                    resp.write(""+json.games[i].id);
                    break;
                }
            }
            
            resp.end();
            });
    })
    q.query(team);
})

// Returns all games for today
app.get('/stats', function (req, resp) {
	console.log("testing!")
	var team = ""+req.query.id;
	console.log(team);
	// var url = "https://api.sportradar.us/nba/trial/v5/en/games/3d49aa5c-2b02-49c8-b1a8-b7b6d1f10acd/summary.json?api_key=6t44kv4tbv7sa3px9uhf4fqd";
    var url = "https://api.sportradar.us/nba/trial/v5/en/games/"+team+"/summary.json?api_key=6t44kv4tbv7sa3px9uhf4fqd";
    request.get(url, function(error, response, body){
		// console.log(body);
		var json = JSON.parse(body);
        var str = "";
        str += ""+json.home.name;
        str += ",";
        str += ""+json.home.points+"*";
        str += ""+json.away.name +","+json.away.points;
        resp.write(str);
        resp.end();

    });
})

// Server listener
app.listen(8080, function () {
	console.log('Server Started...');
	console.log();
});
