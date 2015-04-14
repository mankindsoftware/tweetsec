// on command line invoke:
// node wordServiceTest
// 
var s = "a2a_";
var t = "s0_0per 5nak3";
var sys = require('sys');
var WordService = require('./wordService.js');
var ws = new WordService();
ws.calculate(s, console.dir);
ws.calculate(t, console.dir);

