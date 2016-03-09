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
    res.json(dataStore.write());
});

chokidar.watch('data-store', {ignored: /[\/\\]\./}).on('all', function (event, path) {
    eventEmitter.emit('fileAdded', path);
});


app.listen(3000);
console.log('on port 3000');
