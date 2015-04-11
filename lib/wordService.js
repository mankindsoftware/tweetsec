'use strict';
var _ = require('underscore');
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
WordService.prototype.calculate = function (s, cb) {
	var that = this;
	var calObj = {orig: s, callback: cb}; // TODO: Trim?

	// Tic whitespace
	calObj.evalString = calObj.orig.replace(' ', '^'); // TODO: Whitespace replace. 

	// Full-word service
	that.getWords(calObj, function(_calObj) {
		that.addUp(_calObj, function(val) {
			console.log(val);
		});
	});
};

WordService.prototype.addUp = function (calObj, cb) {
    var _calObj = calObj;
	var evalArray = calObj.words.split(' ');
    _calObj.noItems = evalArray.length;

    _calObj.shortened  = _.each(evalArray, function(word) {
    	return word[0];
    });

    _calObj.list = _.groupBy(_calObj.shortened, function(word) {
    	return category(word);
    });

    _calObj.noCategories = _.size(_calObj.list);

    _calObj.val = _calObj.noCategories * _calObj.noItems;
    // console.log(list + ":" + val);
    if (cb) {
    	cb(_calObj);
    } else {
    	return _calObj;
    }
};
function category(word) {
	if (parseInt(word)) {
		return 'number';
	} else if (_.isString(word)) {
		return 'string';
	} else {
		return 'misc';
	}
}