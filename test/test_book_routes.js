process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const models = require('../models/catalog');
const Book = models.book;
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

describe('Book' , function(){

	//remove Book test collection before test
	before((done) => {
		Book.remove({},(err) => {
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

	let book = {
				title : 'title',
				author : 'author'
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

	describe('Add a single book' , () => {

		it('book without author will not be inserted' , (done) => {

			let bok = {
				title: 'title'
			}

			chai.request(server)
				.post('/catalog/book/single')
				.set('Authorization', 'Bearer ' + token)
				.send(bok)
				.end((err,res)=> {
					res.should.have.status(200);
					res.body.message.should.be.equal('Book validation failed');
					res.body.errors.should.not.be.null;
					res.body.errors.should.have.property('author');	
					done();
				})
		});

		it('add a new book' , (done) => {

			chai.request(server)
				.post('/catalog/book/single')
				.set('Authorization', 'Bearer ' + token)
				.send(book)
				.end((err,res) => {
					res.should.have.status(200);
					res.body.status.should.be.true;
					res.body.should.have.property('book');
					res.body.book.should.be.equal(book.title)
					id = res.body.id;
					done();
				})
			
		})

	});






	describe('Update a single book',() => {

		it('update without bookid should fail', (done)=>{
			chai.request(server)
			.put('/catalog/book/single')
			.set('Authorization', 'Bearer ' + token)
			.send({series:series})
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No Book found');
				done();
			})
		});

		it('successfull book update' , (done) => {
			chai.request(server)
			.put('/catalog/book/single')
			.set('Authorization', 'Bearer ' + token)
			.send({series:series,id:id})
			.end((err,res) => {
				res.should.have.status(200);
				res.body.book.should.be.equal(book.title);
				res.body.id.should.be.equal(id);
				done();
			});

		});
	});


	describe('get a single book' ,() => {

		it('request with wrong id should fail' ,(done) => {
			chai.request(server)
			.get('/catalog/book/single/'+wrongId)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No Book found');
				done();
			})

		});

		it('get book should work',(done) => {
			chai.request(server)
			.get('/catalog/book/single/'+id)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.should.have.status(200);
				res.body._id.should.be.equal(id);
				res.body.author.should.be.equal(book.author);
				res.body.title.should.be.equal(book.title);
				res.body.series.should.be.equal(series);
				res.body.inCollection.should.be.true;
				done();
			})
		})

	});


	describe('get all books should work', () => {
		//insert one more book

		it('add second book' , (done) => {

			chai.request(server)
				.post('/catalog/book/single')
				.set('Authorization', 'Bearer ' + token)
				.send({title:'second',author:'second'})
				.end((err,res) => {
					res.should.have.status(200);
					res.body.status.should.be.true;
					res.body.should.have.property('book');
					done();
				});
			
		});

		it('get all books should work', (done) => {

			chai.request(server)
			.get('/catalog/book/all')
			.set('Authorization', 'Bearer ' + token)
			.send()
			.end((err,res) => {
				res.should.have.status(200);
				res.body.length.should.be.equal(2);
				done();
			})
		})

	});

	describe('delete single book ', () => {
		it('request with wrong id should not work' ,(done) => {
			chai.request(server)
			.delete('/catalog/book/single/'+wrongId)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.true;
				res.body.should.not.have.property('book');
				done();
			})

		});

		it('request with correct id should work' ,(done) => {
			chai.request(server)
			.delete('/catalog/book/single/'+id)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.true;
				done();
			})

		});

		it('get all books should return only one', (done) => {

			chai.request(server)
			.get('/catalog/book/all')
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