const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

//user Schema
let userSchema = new Schema({
	name: {type:String, required:true, index: { unique: true }},
	password: { type: String, required: true, select: false },
	email : {type:String, required:true, index: { unique: true }}
});


//book Schema
let bookSchema = new Schema({
	_user: {type:String, ref: 'User'},
	title : {type:String, required:true, index: { unique: true }},
	author : {type:String, required:true, index: true },
	series: {type:String},
	inCollection : {type:Boolean}
})

//movie Schema
let movieSchema = new Schema({
	_user: {type:String, ref: 'User'},
	title : {type:String, required:true, index: { unique: true }},
	genre : {type:String, index: true },
	series: {type:String},
	inCollection : {type:Boolean}
})

//season Schema
let seasonSchema = new Schema({
	_id : Number,
	noOfEpisodes : Number,
	inCollection : Boolean
})

//series Schema
let seriesSchema = new Schema({
	_user: {type:String, ref: 'User'},
	title : {type:String, required:true, index: { unique: true }},
	genre : {type:String, index: true },
	fullInCollection : Boolean,
	seasons : [seasonSchema]
})


//encrypt password before saving to db
userSchema.pre('save', function(next) {

    let user = this;

    //do nothing if password is not modified
    if (!user.isModified('password')) {
        return next();
    }

    //generate hash
    bcrypt.hash(user.password, null, null, function(err, hash) {

        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });

});


//add a method to check passwords
userSchema.methods.comparePassword = function(password) {

    let user = this;
    return bcrypt.compareSync(password, user.password);
}

//method iterates over seasons in a series and sets
//if full series is available with us before saving
seriesSchema.pre('save', function(next){
	let series = this;
	let seasons = series.seasons;
	let fullInCollection = true;

	for(let i=0;i<seasons.length;i++){
		if(seasons[i].inCollection != true){
			fullInCollection=false;
			break;
		}
	}
	this.fullInCollection = fullInCollection;
	next();

});



let b = mongoose.model('Book', bookSchema);
let u = mongoose.model('User', userSchema);
let m = mongoose.model('Movie', movieSchema);
let s = mongoose.model('Series', seriesSchema);
let x = mongoose.model('Season', seasonSchema);

module.exports = {
    user: u,
    book: b,
    movie: m,
    series: s,
    season : x
};
