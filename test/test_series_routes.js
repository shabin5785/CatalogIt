process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const models = require('../models/catalog');
const Series = models.series;
const Season = models.season;

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

let server = require('../server');

chai.use(chaiHttp);

let id = '';
let genre = 'genre';
let wrongId = '123451ac93d97521e3712345';
let seasonId = '';

describe('Series', () => {

	//remove Series test collection before test
	before((done) => {
		Series.remove({},(err) => {
			done();
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
			.send(season)
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.true;
				res.body.series.should.be.equal(series.title);
				res.body.id.should.be.equal(id);
				seasonid = res.body.season;
				done();
			});

		});

	});


	describe(' Update a season' , () => {

		it('request with wrong series id will fail', (done)=>{
			chai.request(server)
			.post('/catalog/series/single/'+wrongId)
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
			.send({seasonid:seasonid,inCollection:false})
			.end((err,res) => {
				res.should.have.status(200);
				res.body.status.should.be.true;
				res.body.series.should.be.equal(series.title);
				res.body.id.should.be.equal(id);
				res.body.season.should.be.equal(seasonid);
				done();
			});

		});





	})

});

//console.log('>>>>>>>> ',res.body);