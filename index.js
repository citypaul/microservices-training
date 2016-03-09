var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var events = require('events');
var fs = require('fs');
var chokidar = require('chokidar');
var eventEmitter = new events.EventEmitter();
var dataStore = require('./data-store')(eventEmitter);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/tennis-events', function(req, res){
    res.json(dataStore.getContent());
});

app.post('/file', function(req, res) {
	eventEmitter.emit('createFile', req.body);
	res.send('File created: ' + res.body.id);
});

chokidar.watch('data-store', {ignored: /[\/\\]\./})
	.on('add', function (path) {
	    eventEmitter.emit('fileAdded', path);
	})
	.on('unlink', function (path) {
		eventEmitter.emit('fileRemoved', path);
	});

app.listen(3000);
