var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var events = require('events');
var fs = require('fs');
var chokidar = require('chokidar');
var eventEmitter = new events.EventEmitter();
var dataStore = require('./data-store')(eventEmitter);
var amqp = require('amqplib/callback_api');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/tennis-events', function(req, res){
    res.json(dataStore.getContent());
});

amqp.connect('amqp://localhost', function(err, conn) {
	conn.createChannel(function(err, ch) {
		var q = 'fileQueue';

		ch.assertQueue(q, {durable: false});
		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
		ch.consume(q, function(message) {
			var payload = JSON.parse(message.content.toString());
			eventEmitter.emit('createFile', payload);
				console.log(" [x] Received %s", JSON.stringify(payload));
		}, {noAck: true});
	});
});

chokidar.watch('data-store', {ignored: /[\/\\]\./})
	.on('add', function (path) {
	    eventEmitter.emit('fileAdded', path);
	})
	.on('unlink', function (path) {
		eventEmitter.emit('fileRemoved', path);
	});

app.listen(3000);
