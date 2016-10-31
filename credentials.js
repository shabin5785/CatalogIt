const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

let models = require('./models/catalog');
let User = models.user;

let credFns = {};

passport.use(new localStrategy((username,password,done)=> {

	User.findOne({email:username}).select('_id name password email').exec()
		.then(function(user){
			if(!user){
				return done(null,false, {message: 'Invalid log in details' });
			}
			if(!user.comparePassword(password)){
				return done(null,false, {message: 'Invalid log in details' });
			};
			return done(null,user);

		})
		.catch(function(err){
			return done(err);
		});

}));

credFns.serialize = function(req,res,next){
	//use this to add third party users to our db.. now doing nothing
	//or update session user with third party details
	next();
}

//generate jwt token
credFns.generateToken = function(req,res,next){

	 req.token = jwt.sign({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    }, '34cf98asdjh6sdasd6', {
        expiresIn: '120m'
    });
    next();
}


credFns.respond = function(req,res,next){

	res.status(200).json({
        user: req.user.email,
        token: req.token
    });
}


module.exports = credFns;