const express = require('express')
const app = express()
var mysql = require('mysql');
const port = 8080
var path = require('path')
var bodyParser = require("body-parser")
var request = require('request');

var queryModule = require('./teamQuery.js');
var q = new queryModule.teamQuery();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Expects the GET request to contain a query parameter 'team' with the value of the team name stored in the DB
// Returns the url to call for the specific game info
app.get('/gameStats',function(req,res){
    var team = req.query.team;
    var apiKey;
    var url1 = "http://api.sportradar.us/nba/trial/v5/en/games/2018/12/04/schedule.json?api_key=6t44kv4tbv7sa3px9uhf4fqd"
    q.once('yoyo',function(msg){
        
        request.get(url1, function(error, response, body){
            var json = JSON.parse(body);
            var numGames = json.games.length;
            
            for(var i = 0;i<numGames;i++){
                if (json.games[i].away.id == msg){
                    console.log("I found the Bulls Game!");
                    var url2 ="https://api.sportradar.us/nba/trial/v5/en/games/"+json.games[i].id+"/summary.json?api_key=6t44kv4tbv7sa3px9uhf4fqd";
                    // res.write(""+url2)
                    res.write(""+json.games[i].id);
                    break;
                }
                else if (json.games[i].home.id == msg){
                    console.log("Found");
                    break;
                }
            }
            
            res.end();
            });
    })
    q.query(team);
        
    
})

app.get('/game',function(req,res){
    var team = req.query.id;
    var url = "https://api.sportradar.us/nba/trial/v5/en/games/"+team+"/summary.json?api_key=6t44kv4tbv7sa3px9uhf4fqd";
    request.get(url, function(error, response, body){
        var json = JSON.parse(body);
        var str = "";
        str += ""+json.home.name;
        str += ",";
        str += ""+json.home.points+"*";
        str += ""+json.away.name +","+json.away.points;
        res.write(str);
        res.end();

    });
        
    
})

// Console log to show server is running
app.listen(port, () => console.log(`Example app listening on port ${port}!`))