var express = require('express');
var morgan = require('morgan');
var request = require('request');
var cookieParser = require('cookie-parser');
var bodyParser= require('body-parser');
var session = require('express-session');
var app = express();
var searchRoutes =  require('./routes/search-route');
var restaurant = require('./routes/restaurant');
var userRoutes = require('./routes/profile-routes');
var review = require('./routes/review');
require('request-debug')(request);
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());
app.set('port', 8000);
app.get('/', function (req,res) {
    res.send("Hello")
});
app.use('/search', searchRoutes);
app.use('/restaurant', restaurant);
app.use('/profile', userRoutes);
app.use('/review',review);

app.listen(app.get('port'), function () {
    console.log("APP RUNNING ON " + app.get('port'));
});