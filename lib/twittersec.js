//
//  
//
(function () {
'use strict';
var Bot = require('./bot');
var config1 = require('../config/configTwitter');

var bot = new Bot(config1);

console.log('TwitSecBot running');

//get date string for today's date (e.g. '2011-01-01')
function datestring() {
    var d = new Date(Date.now() - 5 * 60 * 60 * 1000); //est timezone
    return d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getDate();
}

var meStream = bot.twit.stream('statuses/filter', {
    track: atify(config1.owner)
});

console.dir(meStream);

function getText(t) {
    return t.text;
}

function atify(name) {
    return '@' + name;
}

function createStatus(name, text, cb) {
  var _name = name;
  createStatusText(text, function(newTextObject) {
    cb(atify(_name) + ' ' + newTextObject.shortened.join('') + ' value: ' + newTextObject.val);
  });
        
}
function removeScreenName(screenName, text) {
    return text.split(screenName).join(' ').trim();
}

function createStatusText(s, cb) {
  var WordService = require('./wordService.js');
  var ws = new WordService();
  ws.calculate(s, cb);
}

function postUpdate(statusText) {
  bot.twit.post('statuses/update', {
      status: statusText
  }, function (err, data, response) {
      console.log(err);
  });
}

function processTweet(tweet) {
    var _name = tweet.user.screen_name;
    var _id = tweet.user.id_str;
    var _text = removeScreenName(_name, tweet.text);
    createStatus(_name, _text, postUpdate);
}

meStream.on('tweet', function (tweet) {
    processTweet(tweet);
});

function handleError(err) {
    console.error('response status:', err.statusCode);
    console.error('data:', err.data);
}
})();