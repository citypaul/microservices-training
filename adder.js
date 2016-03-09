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

app.post('/file-accepter', function(req, res){
    console.log("Req: ", req);
    console.log("Res: ", res);
});

app.listen(3001);
