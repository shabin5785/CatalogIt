process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const models = require('../models/catalog');
const Movie = models.movie;
const User = models.user;

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

let server = require('../server');

chai.use(chaiHttp);

let id = '';
let series = 'series';
let wrongId = '123451ac93d97521e3712345';

let token = '';

describe('Movie' , function(){

	//remove Movie test collection before test
	before((done) => {
		Movie.remove({},(err) => {
			if(err){
				done(err);
			}
		});

		//delete all users
		User.remove({},(err) => {
			if(err){
				done(err);
			}
		});

		//add new user
		let user = new User();
		user.email = 'test@me.com';
		user.password = 'password';
		user.name = 'test';
		user.save()
			.then(function(usr){
				console.log('User created ...');
			})
			.catch(function(err){
				console.log(err);
				done(err);
			});

		//call service to get token
		chai.request(server)
			.post('/login')
			.send({username: user.email, password : user.password})
			.end((err,res) => {
				if(err){
					done(err);
				}
				token = res.body.token;
			});

		done();

	});

	let movie = {
				title : 'title',
				genre : 'genre'
			}

	describe('Request without authentication ', () => {

		it(' should fail ', (done) => {
			chai.request(server)
			.get('/catalog/book/all')
			.end((err,res) => {
				// console.log(">>>>>>>>>>>>> ",res.error.text);
				res.should.have.status(401);
				res.error.text.should.include('UnauthorizedError');
				done();
			});

		});

	});

	describe('Add a single movie ' , () => {

		it('movie without title will not be inserted' , (done) => {

			let mov = {
				genre: 'genre'
			}

			chai.request(server)
				.post('/catalog/movie/single')
				.set('Authorization', 'Bearer ' + token)
				.send(mov)
				.end((err,res)=> {
					res.should.have.status(200);
					res.body.message.should.be.equal('Movie validation failed');
					res.body.errors.should.not.be.null;
					res.body.errors.should.have.property('title');	
					done();
				})
		});

		it('add a new movie' , (done) => {

			chai.request(server)
				.post('/catalog/movie/single')
				.set('Authorization', 'Bearer ' + token)
				.send(movie)
				.end((err,res) => {
					res.should.have.status(200);
					res.body.status.should.be.true;
					res.body.should.have.property('movie');
					res.body.movie.should.be.equal(movie.title)
					id = res.body.id;
					done();
				})
			
		})

	});


	describe('Update a single movie',() => {

		it('update without movieid should fail', (done)=>{
			chai.request(server)
			.put('/catalog/movie/single')
			.set('Authorization', 'Bearer ' + token)
			.send({series:series})
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No Movie found');
				done();
			})
		});

		it('successfull movie update' , (done) => {
			chai.request(server)
			.put('/catalog/movie/single')
			.set('Authorization', 'Bearer ' + token)
			.send({series:series,id:id})
			.end((err,res) => {
				res.should.have.status(200);
				res.body.movie.should.be.equal(movie.title);
				res.body.id.should.be.equal(id);
				done();
			});

		});
	});


	describe('get a single movie' ,() => {

		it('request with wrong id should fail' ,(done) => {
			chai.request(server)
			.get('/catalog/movie/single/'+wrongId)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No Movie found');
				done();
			})

		});

		it('get movie should work',(done) => {
			chai.request(server)
			.get('/catalog/movie/single/'+id)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.should.have.status(200);
				res.body._id.should.be.equal(id);
				res.body.genre.should.be.equal(movie.genre);
				res.body.title.should.be.equal(movie.title);
				res.body.series.should.be.equal(series);
				res.body.inCollection.should.be.true;
				done();
			})
		})

	});


	describe('get all movies should work', () => {
		//insert one more movie

		it('add second movie' , (done) => {

			chai.request(server)
				.post('/catalog/movie/single')
				.set('Authorization', 'Bearer ' + token)
				.send({title:'second',genre:'second'})
				.end((err,res) => {
					res.should.have.status(200);
					res.body.status.should.be.true;
					res.body.should.have.property('movie');
					done();
				});
			
		});

		it('get all movies should work', (done) => {

			chai.request(server)
			.get('/catalog/movie/all')
			.set('Authorization', 'Bearer ' + token)
			.send()
			.end((err,res) => {
				res.should.have.status(200);
				res.body.length.should.be.equal(2);
				done();
			})
		})

	});

	describe('delete single movie ', () => {
		it('request with wrong id should not work' ,(done) => {
			chai.request(server)
			.delete('/catalog/movie/single/'+wrongId)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.true;
				res.body.should.not.have.property('movie');
				done();
			})

		});

		it('request with correct id should work' ,(done) => {
			chai.request(server)
			.delete('/catalog/movie/single/'+id)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.true;
				done();
			})

		});

		it('get all movies should return only one', (done) => {

			chai.request(server)
			.get('/catalog/movie/all')
			.set('Authorization', 'Bearer ' + token)
			.send()
			.end((err,res) => {
				res.should.have.status(200);
				res.body.length.should.be.equal(1);
				done();
			})
		})

	})


});



//console.log(">>>>>>>>",res.body);