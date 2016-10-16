process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const models = require('../models/catalog');
const Book = models.book;

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

let server = require('../server');

chai.use(chaiHttp);

let id = '';
let series = 'series';
let wrongId = '123451ac93d97521e3712345';

describe('Book' , function(){

	//remove Book test collection before test
	before((done) => {
		Book.remove({},(err) => {
			done();
		});

	});

	let book = {
				title : 'title',
				author : 'author'
			}

	describe('Add a single book' , () => {

		it('book without author will not be inserted' , (done) => {

			let bok = {
				title: 'title'
			}

			chai.request(server)
				.post('/catalog/book/single')
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
			.send({series:"series"})
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No book found');
				done();
			})
		});

		it('successfull book update' , (done) => {
			chai.request(server)
			.put('/catalog/book/single')
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
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No book found');
				done();
			})

		});

		it('get book should work',(done) => {
			chai.request(server)
			.get('/catalog/book/single/'+id)
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
			.send()
			.end((err,res) => {
				res.should.have.status(200);
				res.body.length.should.be.equal(2);
				done();
			})
		})

	});

	describe('delete single book ', () => {
		it('request with wrong id should work' ,(done) => {
			chai.request(server)
			.delete('/catalog/book/single/'+wrongId)
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
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.true;
				done();
			})

		});

		it('get all books should return only one', (done) => {

			chai.request(server)
			.get('/catalog/book/all')
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