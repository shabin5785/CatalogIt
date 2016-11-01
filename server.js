//app basic settings
const config = require('config'); //module handles configuration
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const strategy = require('passport-local');
const expressJwt = require('express-jwt'); 
const bluebird = require('bluebird');

//credential handler
const creds = require('./credentials.js');


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

//filter routes
let filter = function(req){
	let access = true;

    if (req.path.match(/catalog/i)) {
        access = false;
    }

    return access;
}

app.use(expressJwt({ secret: '34cf98asdjh6sdasd6' }).unless(filter), function(req, res, next) {
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

//use passport
app.use(passport.initialize());


//login
app.post('/login',passport.authenticate('local',{
	session : false
}), creds.serialize, creds.generateToken, creds.respond)



//Routes
let book_routes = require('./routes/book_routes')(app,express);
let movie_routes = require('./routes/movie_routes')(app,express);
let series_routes = require('./routes/series_routes')(app,express);
let open_routes = require('./routes/open_routes')(app,express);

//Register the routes
app.use('/catalog/book',book_routes);
app.use('/catalog/movie',movie_routes);
app.use('/catalog/series',series_routes);
app.use('/open',open_routes);//non authenicated routes


//catch all route
app.get('*', function(req,res){
	res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
});


//start the app
app.listen(config.port);

console.log('Catalog app started at port '+config.port);

//needed for testing to invoke app
module.exports = app;