var express = require("express"),
    path     = require('path'),
    app = express(),
    expressValidator = require('express-validator'),
    bodyParser = require("body-parser"),
    router = express.Router();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
var CronJob = require('cron').CronJob;
//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
};
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": false}));
app.use(expressValidator());
app.use(allowCrossDomain);

require('./routers/user')(app);
require('./config');




app.set('port', (process.env.PORT || 3000));
server.listen(app.get('port')); // not 'app.listen'!);
console.log("Listening to PORT 3000");

var job = new CronJob({
    cronTime: '*  50-60 23 * * *',
    onTick: function() {
        var msg = ' Running a task every minute'+(Math.random());
        io.emit('message',  msg);
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
job.start();

