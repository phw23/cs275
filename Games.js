// Module imports
var nbaFile = require('./NBA');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

class Games extends EventEmitter {
    constructor() {
        super();
    }
    displayGames() {
        var nba = new nbaFile.NBA();
        var self = this;
        nba.once('Finished', function (games) {
            var apiKey = fs.readFileSync('assets/sportKey.txt', 'utf8')
            // Todo: Put styling in the head section so not hideous (remember will likely also affect single game display)
            var str=`
                <html>
                    <head>
                        <meta name="viewport" content="width = device-width, initial-scale = 1">
                        <link rel="stylesheet" href="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css">
                        <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
                        <script src="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
                        <script>
                            function test(){alert('hello')}
                            function handleClick(gameID) {
                                $("#outputDiv").html("Fetching Game Info")
                                //var URL = 'https://api.sportradar.us/nba/trial/v5/en/games/'+gameID+'/summary.json?api_key=`+apiKey.trim()+`'
                                var URL = 'http://localhost:8080/api/game?id='+gameID
                                $.ajax({
                                    type: "GET",
                                    url: URL,
                                    contentType: "application/json; charset=utf-8",
                                    data: {},
                                    dataType: "html",
                                    success: function (msg) {
                                        $("#outputDiv").html(msg+'<br><br>');
                                    },
                                    error: function (xhr, ajaxOptions, thrownError) {
                                        $("#outputDiv").html("Error fetching " + URL + "<br><br>");
                                    }
                                });
                            }
                        </script>
                    </head>
                    
                    <body>
            `
            str += `    <div id='outputDiv'></div>`
            games.forEach(game => {
                str += `<div onClick="handleClick('`+game.id+`')">`+game.away.name+' at '+game.home.name+`</div>`
            });
            str += `     
                    </body>    
                </html>
            `
            self.emit('Finished', str);
        })
        nba.getGames();
    }
}

exports.Games = Games;