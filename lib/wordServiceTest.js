// on command line invoke:
// node wordServiceTest
// 
var s = "horseshoesonbutterflys1andm3";
var sys = require('sys');
var WordService = require('./wordService.js');
var ws = new WordService();
ws.getWords(s, function(d) {
	sys.puts(d);
});