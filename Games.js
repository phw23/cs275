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
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.6/umd/popper.min.js"></script>
                        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
                        <style>
                            * {
                                font-family: 'Raleway';
                                color: white;
                            }
                            body {
                                background-repeat: no-repeat;
                                background-attachment: fixed;
                                background-position-x: center;
                                background-position-y: bottom 0px;
                                background-color: black;
                            }
                            h1 {
                                width: 100%;
                                text-align: center;
                                border-bottom: 1px solid white;
                                padding-bottom: 15px;
                                letter-spacing: 2px;
                            }
                            div {
                                text-align: center;
                            }
                            p {
                                font-size: 18px;
                                letter-spacing: 2px;
                            }
                            ::-webkit-input-placeholder {
                                color: black;
                                    text-align: center;
                            }
                    
                            :-ms-input-placeholder {  
                                color: black;
                                text-align: center; 
                            }
                        </style>
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
                                        $("#outputDiv").html(msg);
                                    },
                                    error: function (xhr, ajaxOptions, thrownError) {
                                        $("#outputDiv").html("Error fetching " + URL + "<br><br>");
                                    }
                                });
                            }
                        </script>
                    </head>
                    <body>
                        <h1>WELCOME TO SPORT WATCHER!</h1>  
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