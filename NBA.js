// Module imports
var request = require('request');
var EventEmitter = require('events').EventEmitter;

// Class that is used to make async api call to the weather service and then emit when the call has been completed
class Topics extends EventEmitter {
    constructor() { super(); }
    getTopics() {
        // API URL
        var baseURL = "https://www.healthcare.gov" 
        var URL = baseURL + "/api/topics.json"
        var self = this;
        // API request
        request.get(URL, function (error, response, body) {
            var data = JSON.parse(body).topics
            var str = ""
            data.forEach(topic => {
                str += "<a href='" + baseURL + topic.url + "'>" + topic.title + "</a><br>"
            }); 
            // Emit when the async call has been finished
            self.emit('Finished', str);
        });
    }
}

exports.Topics = Topics;