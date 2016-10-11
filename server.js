//app basic settings
const config = require('config'); //module handles configuration
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const strategy = require('passport-local');
const jwt = require('express-jwt');
const bluebird = require('bluebird');


//initialize express
const app = express();


//use body parser to get post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//config app for CORS
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
    Authorization');
    next();
});

//Mongodb connection
mongoose.Promise = bluebird;
mongoose.connect(config.database);
let connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'Connection Error : '));
connection.on('open',function(){
	console.log('Connected to database: ' + config.database);
})

//set public dir to be used
app.use(express.static(__dirname+'/public'));

//passport


//Routes
var book_routes = require('./routes/book_routes')(app,express);
var open_routes = require('./routes/open_routes')(app,express);

//Register the routes
app.use('/catalog/book',book_routes);
app.use('/open',open_routes);//non authenicated routes


//catch all route
app.get('*', function(req,res){
	res.sendFile(path.join(__dirname+'/public/app/views/error.html'));
});


//start the app
app.listen(config.port);

console.log('Catalog app started at port '+config.port);

//needed for testing to invoke app
module.exports = app;