var Client = require('node-rest-client').Client,
	client = new Client,
	config = require('./config/config');

module.exports = function() {
	var consulIP = process.env.CONSULIP ? process.env.CONSULIP : 'localhost';

	function connect(callback) {
		var args = { 
				data: config,
            	headers: { "Content-Type": "application/json" }
			};
		console.log(' [s] Connecting to service discovery');
		client.put(
			"http://" + consulIP + ":8500/v1/agent/service/register",
			args, 
			function (data, response) {
				callback && callback();
			}
		);
		console.log(' [s] Connected to service discovery');
	}

	function disconnect(callback) {
		console.log(' [s] Disconnecting from service discovery');
    	client.get(
    		"http://" + consulIP + ":8500/v1/agent/service/deregister/" + config['ID'],
    		function (data, response) {
    			callback && callback();
    		}
		);
		console.log(' [s] Disconnected from service discovery');
	}

	return {
		connect: connect,
		disconnect: disconnect
	};
}
