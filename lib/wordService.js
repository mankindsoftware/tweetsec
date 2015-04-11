'use strict';
var _ = require('underscore');
var TIC = '^';
var spawner = require('./spawner.js');
var WordService = module.exports = function () {
    this.spawner = spawner;
};
WordService.prototype.getWords = function (calObj, cb) {
    var _calObj = calObj;
    _calObj.words = '';

    spawner.run({
        program: 'python',
        params: ['./wordFinder.py', _calObj.evalString]
    }, {
        begin: function begin() {

        },
        progress: function progress(data) {
            _calObj.words = _calObj.words + data;
        },
        end: function end() {
            cb(_calObj);
        }
    });
};

WordService.prototype.getWordArray = function (calObj, cb) {
    calObj.wordArray = calObj.words.split(' ');
    cb(calObj);
};
WordService.prototype.calculate = function (s, cb) {
    var that = this;
    var calObj = {
        orig: s,
        callback: cb
    }; // TODO: Trim?

    // Tic whitespace
    calObj.evalString = calObj.orig.replace(' ', TIC); // TODO: Whitespace replace. 

    // Full-word service
    that.getWords(calObj, function (_calObj) {
        that.getWordArray(_calObj, function (_calObj) {
            that.addUp(_calObj, function (_calObj) {
                cb(_calObj);
            });
        });
    });
};

WordService.prototype.addUp = function (calObj, cb) {
    var _calObj = calObj;

    // Determine number of unique items
    var evalArray = calObj.words.split(' ');
    _calObj.noItems = evalArray.length;

    // Short words to single letter
    _calObj.shortened = _.map(_calObj.wordArray, function (word) {
        if (word[0] === TIC) {
            return ' ';
        }
        return word[0];
    });

    // Categorize
    _calObj.categoryList = _.groupBy(_calObj.shortened, function (word) {
        return category(word);
    });

    // Count categories
    _calObj.noCategories = _.size(_calObj.categoryList);

    // Multiply
    _calObj.val = _calObj.noCategories * _calObj.noItems;

    if (cb) {
        cb(_calObj);
    } else {
        return _calObj;
    }
};

//
// TODO: Make this better with regular expressions.!!!
// 
function category(word) {
    if (parseInt(word)) {
        return 'number';
    } else if (_.isString(word)) {
        return 'string';
    } else {
        return 'misc';
    }
}
