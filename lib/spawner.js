var sys = require('sys');

var onKill = function(connect, proc) {
	connect && connect.in &&  connect.in.on('end', function() {
		proc.kill();
		connect.done && connect.done("killSignal", null);
	});
}

var handlers = module.exports.handlers = {
	piped: function (connect) {
		return {
			begin: function(spawned) {
				connect && onKill(connect, spawned);
				connect.out && spawned.stdout.pipe(connect.out);
			},
			end: function(code) {
				connect.done && connect.done(null, code);
			}
		};
	},
	mute: function (connect) {
		return {
			begin: function(spawned) {
				onKill(connect, spawned);
			},
			end: function(code) {
				connect.done && connect.done(null, code);
			},
			error: function(err) {
				connect.done && connect.done(err, null);
			}
		};
	},
	bufferedJson: function (connect) {
  		var buffer = "";
	  	return {
		    begin: null,
		    progress: function(data) {
  				buffer = buffer.concat(data);
		    },
		    error: null,
		    end: function(code) {
		    	connect.out.json(JSON.parse(buffer));
				connect.done && connect.done(null, code);
		    }
		};
	},
	progressiveHttp: function(connect) {
		return {
			begin: function(spawned){
				connect.out && connect.out.writeHead(200);
			},
			progress: function(data) {
				connect.out && connect.out.write(data);
			},
			error: null,
			end: function(code) {
    			connect.out && connect.out.end();
				connect.done && connect.done(null, code);
			}
		} 
	}
}

var run = module.exports.run = function(task, handlerConfig) {
  var handlers = handlerConfig,
    child_process = require('child_process'),
    child = child_process.spawn(task.program, task.params);

  handlers.begin && handlers.begin(child);

  handlers.progress && child.stdout.on('data', function (data) {
    handlers.progress(data);
  });

  handlers.error && child.stderr.on('data', function (data) {
    handlers.error(data);
  });

  handlers.end && child.on('exit', function (code) {
    handlers.end(code);
  });

  handlers.end && child.on('close', function (code) {
    handlers.end(code);
  });
  return child;
};

var spawnDone = function(err, success) {
	err && console.log(err);
	success && console.log(success);
};

