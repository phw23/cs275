// Module imports
var request = require('request');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

// Class that is used to make async api call to the weather service and then emit when the call has been completed
class NBA extends EventEmitter {
    constructor() {
        super();
        this.apiKey = fs.readFileSync('assets/sportKey.txt', 'utf8')
    }
    getGames() {
        // Get today's date
        var today = new Date();
        var date = {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate()
        }
        // Today's Schedule URL
        const URL = 'http://api.sportradar.us/nba/trial/v5/en/games/' + date.year + '/' + date.month + '/' + date.day + '/' + 'schedule.json?api_key=' + this.apiKey
        var self = this;
        // API request
        request.get(URL, function (error, response, body) {
            var games = JSON.parse(body).games
            if (games.length > 0) {
                self.emit('Finished', games);
            } else {
                self.emit('Finished', []);
            }
        });
    }
    getGameByID(id) {
        var self = this;
        const URL2 = 'https://api.sportradar.us/nba/trial/v5/en/games/' + id + '/summary.json?api_key=' + self.apiKey
        request.get(URL2, function (error, response, body) {
            var gameInfo = JSON.parse(body)
            // Todo: Format Game data into HTML string to be displayed
            var str = ""
            str += "<div>"+gameInfo.home.name+": "+gameInfo.home.points+"</div>"
            str += "<div>"+gameInfo.away.name+": "+gameInfo.away.points+"</div>"
            str += "<br>"
            self.emit('Finished', str);
        })
    }
}

exports.NBA = NBA;