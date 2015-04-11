'use strict';
var spawner = require('./spawner.js');
var WordService = module.exports = function () {
    this.spawner = spawner;
};
WordService.prototype.getWords = function (s, cb) {
    var _s = s;
    var _words = '';

    spawner.run({
        program: 'python',
        params: ['./wordFinder.py', _s]
    }, {
        begin: function begin() {

        },
        progress: function progress(data) {
            _words = _words + data;
        },
        end: function end() {
            cb(_words);
        }
    });
};
