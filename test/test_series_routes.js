process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const models = require('../models/catalog');
const Series = models.series;
const Season = models.season;
const User = models.user;

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

let server = require('../server');

chai.use(chaiHttp);

let id = '';
let genre = 'genre';
let wrongId = '123451ac93d97521e3712345';
let seasonId = '';

let token = '';

describe('Series', () => {

	//remove Series test collection before test
	before((done) => {
		Series.remove({},(err) => {
			if(err){
				done(err);
			}
		});

		Season.remove({},(err) => {
			if(err){
				done(err);
			}
		})

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

	let series = {

		title:'title'
	}

	let season = {

		seasonid : 1,
		noOfEpisodes : 12
	}


	describe(' Add single series' , () => {

		it(' Series without title will not be inserted' ,(done)=>{
			let ser = {}
			chai.request(server)
				.post('/catalog/series/single')
				.set('Authorization', 'Bearer ' + token)
				.send(ser)
				.end((err,res)=>{
					res.should.have.status(200);
					res.body.message.should.be.equal('Series validation failed');
					res.body.errors.should.not.be.null;
					res.body.errors.should.have.property('title');
					done();
				});

		});

		it('Add a single series' ,(done)=> {
			chai.request(server)
				.post('/catalog/series/single')
				.set('Authorization', 'Bearer ' + token)
				.send(series)
				.end((err,res)=>{
					res.should.have.status(200);
					res.body.status.should.be.true;
					res.body.should.have.property('series');
					res.body.series.should.be.equal(series.title)
					id = res.body.id;
					done();
				});

		});


	});


	describe('Update a single series',() => {

		it('update without seriesid should fail', (done)=>{
			chai.request(server)
			.put('/catalog/series/single')
			.set('Authorization', 'Bearer ' + token)
			.send({genre:genre})
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No Series found');
				done();
			})
		});

		it('successfull series update' , (done) => {
			chai.request(server)
			.put('/catalog/series/single')
			.set('Authorization', 'Bearer ' + token)
			.send({genre:genre,id:id})
			.end((err,res) => {
				res.should.have.status(200);
				res.body.series.should.be.equal(series.title);
				res.body.id.should.be.equal(id);
				done();
			});

		});
	});



	describe(' Add a single season to a series' , () => {

		it('request with wrong series id will fail', (done)=>{
			chai.request(server)
			.post('/catalog/series/single/'+wrongId)
			.set('Authorization', 'Bearer ' + token)
			.send(season)
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No Series found');
				done();
			});

		});


		it('request with correct seriesid and correct season should work ', (done) => {
			chai.request(server)
			.post('/catalog/series/single/'+id)
			.set('Authorization', 'Bearer ' + token)
			.send(season)
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.true;
				res.body.series.should.be.equal(series.title);
				res.body.id.should.be.equal(id);
				seasonId = res.body.season;
				done();
			});

		});

	});


	describe(' Update a season' , () => {

		it('request with wrong series id will fail', (done)=>{
			chai.request(server)
			.post('/catalog/series/single/'+wrongId)
			.set('Authorization', 'Bearer ' + token)
			.send(season)
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No Series found');
				done();
			});

		});


		it('request with valid series id and wrong season id will fail', (done)=>{
			chai.request(server)
			.put('/catalog/series/single/'+id)
			.set('Authorization', 'Bearer ' + token)
			.send({seasonid:0})
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No Season found');
				done();
			});

		});

		it('request with valid series id and valid season id should work', (done)=>{
			chai.request(server)
			.put('/catalog/series/single/'+id)
			.set('Authorization', 'Bearer ' + token)
			.send({seasonid:seasonId,inCollection:false})
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.true;
				res.body.series.should.be.equal(series.title);
				res.body.id.should.be.equal(id);
				res.body.season.should.be.equal(seasonId);
				done();
			});

		});

	})


	describe('get a single series should work' ,() => {

		it('request with wrong id should fail' ,(done) => {
			chai.request(server)
			.get('/catalog/series/single/'+wrongId)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No Series found');
				done();
			})

		});

		it('get series should work',(done) => {
			chai.request(server)
			.get('/catalog/series/single/'+id)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.should.have.status(200);
				res.body._id.should.be.equal(id);
				res.body.fullInCollection.should.be.false;
				res.body.seasons.length.should.be.equal(1);
				res.body.title.should.be.equal(series.title);
				done();
			});
		});

		//changing in collection for season 
		it('update in collection value for a season to true', (done)=>{
			chai.request(server)
			.put('/catalog/series/single/'+id)
			.set('Authorization', 'Bearer ' + token)
			.send({seasonid:seasonId,inCollection:true})
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.true;
				res.body.series.should.be.equal(series.title);
				res.body.id.should.be.equal(id);
				res.body.season.should.be.equal(seasonId);
				done();
			});

		});

		it('fullInCollection for series should be true now',(done) => {
			chai.request(server)
			.get('/catalog/series/single/'+id)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.should.have.status(200);
				res.body._id.should.be.equal(id);
				res.body.fullInCollection.should.be.true;
				res.body.seasons.length.should.be.equal(1);
				res.body.title.should.be.equal(series.title);
				done();
			});
		});


	});

	describe('get single season of a series' ,() => {

		it('request with invalid series id should fail' ,(done) => {
			chai.request(server)
			.get('/catalog/series/single/'+wrongId+'/'+seasonId)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No Series found');
				done();
			});

		});

		it('request with valid series id and invalid seasonid should fail' ,(done) => {
			chai.request(server)
			.get('/catalog/series/single/'+id+'/'+0)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No Season found');
				done();
			});

		});

		it('request with valid series id and valid seasonid should work' ,(done) => {
			chai.request(server)
			.get('/catalog/series/single/'+id+'/'+seasonId)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.should.have.status(200);
				res.body._id.should.be.equal(seasonId);
				res.body.inCollection.should.be.true;
				done();
			});

		});
	});


	describe(' get all series ', () => {
		//add one more season
		it('request with correct seriesid and correct season should work ', (done) => {
			chai.request(server)
			.post('/catalog/series/single/'+id)
			.set('Authorization', 'Bearer ' + token)
			.send({seasonid:2, noOfEpisodes:20, inCollection:true})
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.true;
				res.body.series.should.be.equal(series.title);
				res.body.id.should.be.equal(id);
				done();
			});

		});

		it(' get all series should work' ,(done) => {
			chai.request(server)
			.get('/catalog/series/all')
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.body.length.should.be.equal(1);
				res.body[0].fullInCollection.should.be.true;
				res.body[0].title.should.be.equal(series.title);
				res.body[0].seasons.length.should.be.equal(2);
				done();
			});


		});

	});


	describe('delete single season ',() => {

		it('delete request with invalid series id should fail' ,(done)=>{
			chai.request(server)
			.delete('/catalog/series/single/'+wrongId+'/'+seasonId)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res)=>{
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No Series found');
				done();
			});

		});

		it('delete request with valid series id and invalid season id should fail' ,(done)=>{
			chai.request(server)
			.delete('/catalog/series/single/'+id+'/'+33)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res)=>{
				res.should.have.status(200);
				res.body.status.should.be.false;
				res.body.error.should.be.equal('No Season found');
				done();
			});

		});

		it('delete request with valid series id and valid season id should work' ,(done)=>{
			chai.request(server)
			.delete('/catalog/series/single/'+id+'/'+2)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res)=>{
				res.should.have.status(200);
				res.body.status.should.be.true;
				res.body.series.should.be.equal(series.title);
				done();
			});

		});


	});


	describe('delete single series' ,() => {

		it('delete request with invalid series id should fail' ,(done)=>{
			chai.request(server)
			.delete('/catalog/series/single/'+wrongId)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res)=>{
				res.should.have.status(200);
				res.body.status.should.be.true;
				res.body.should.not.have.property('series');
				done();
			});

		});

		it('delete request with valid series id should work' ,(done)=>{
			chai.request(server)
			.delete('/catalog/series/single/'+id)
			.set('Authorization', 'Bearer ' + token)
			.end((err,res)=>{
				res.should.have.status(200);
				res.body.status.should.be.true;
				done();
			});

		});

		it(' get all series should return no entries' ,(done) => {
			chai.request(server)
			.get('/catalog/series/all')
			.set('Authorization', 'Bearer ' + token)
			.end((err,res) => {
				res.body.length.should.be.equal(0);
				done();
			});


		});

	});

});

//console.log('>>>>>>>> ',res.body);