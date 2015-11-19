// Require our dependencies
var express = require('express');
// Templating engine for express (better version of handlebars)
var exphbs = require('express-handlebars');
// Creating http servers
var http = require('http');
// Mongoose for interfacing with MongoDB
var mongoose = require('mongoose');
// Fetching tweet stream from twitter
var twitter = require('ntwitter');
// routes
var routes = require('./routes');
// Configuration files
var config = require('./config');
// Handle the twitter stream
var streamHandler = require('./')

// Create an express app
var app = express();
var port = process.env.PORT || 8080;

// Set handlebars as the default templating engine
app.engine('handlebars', exphbs({ default-layout: 'main' }));
app.set('view engine', 'handlebars');

// Disable etag headers on response
app.disable('etag');

// Connect to mongoose
mongoose.connect('mongodb://localhost/react-tweets');

// Create a new nTwitter instance
var twit = new twitter(config.twitter);

// Index route
app.get('/', routes.index);

// Page route
app.get('/page/:page/:skip', routes.page);

// Set /public as our static content directory
app.use("/", express.static(__dirname + "/public/"));

// Fire it up
var server = http.createServer(app).listen(port, function(){
    console.log('Express server listening on port');
});

// Initialize socket.io
var io = require('socket.io').listen(server);

// Set a stream listener for tweets matching tracking keywords
twit.stream('statuses/filter',{ track: 'scotch_io, #scotchio'}, function(stream){
  streamHandler(stream,io);
});
