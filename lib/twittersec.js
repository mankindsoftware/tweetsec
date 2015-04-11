//
//  
//
(function () {
    'use strict';
    var Bot = require('./bot');
    var config1 = require('../config/configTwitter');

    var bot = new Bot(config1);

    console.log('TwitSecBot running');

    var meStream = bot.twit.stream('statuses/filter', {
        track: atify(config1.owner)
    });

    function atify(name) {
        return '@' + name;
    }

    function createStatus(name, text, cb) {
        var _name = name;
        getWords(text, function (newTextObject) {
            cb(atify(_name) + ' ' + newTextObject.shortened.join('') + ' value: ' + newTextObject.val);
        });
    }

    function removeScreenName(screenName, text) {
      console.log(screenName);
      console.log(text);
      
        var newText = text.replace(atify(screenName), '' );
        console.log(newText);
        return newText;
    }

    function getWords(s, cb) {
        var _s = s;
        var WordService = require('./wordService.js');
        var ws = new WordService();
        ws.calculate(_s, cb);
    }

    function postUpdate(statusText) {
        bot.twit.post('statuses/update', {
            status: statusText
        }, function (err, data, response) {

        });
    }

    function processTweet(tweet) {
        var _name = tweet.user.screen_name;
        console.log(tweet.text);
        if (tweet.text.indexOf(atify(config1.owner)) === 0) {
          var _text = removeScreenName(config1.owner, tweet.text);
          createStatus(_name, _text, postUpdate);
        }
    }

    meStream.on('tweet', function (tweet) {
        processTweet(tweet);
    });

    function handleError(err) {
        console.error('response status:', err.statusCode);
        console.error('data:', err.data);
    }
})();
