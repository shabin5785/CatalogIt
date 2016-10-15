const models = require('../models/catalog');
const config = require('config');
const Series = models.series;
const Season = models.season;

module.exports = function(app,express){

	const seriesRouter = express.Router();

	seriesRouter.route('/single')
		.post(function(req,res){ //add single series
			let series = new Series();
			series.user = "12345"; //placeholder
			series.title = req.body.title;
			if(req.body.genre){
				series.genre = req.body.genre;
			}
			series.save()
				.then(function(ser){
					res.json({status:true,series:ser.title});
				})
				.catch(function(err){
					console.log(err);
					res.send(err);
				})
		})

		.put(function(req,res){ //update a single series
			Series.findOne({_id:req.body.id}).exec()
				.then(function(ser){
					if(!ser){//Series not found
						res.json({status:false,error:'No Series found'})
					}
					else{
						//Series to update found
						if(req.body.title) ser.title = req.body.title;
						if(req.body.genre) ser.genre = req.body.genre;
						ser.save()
							.then(function(ser){
								res.json({status:true,movie:ser.title});
							})
							.catch(function(err){
								console.log(err);
								res.send(err);
							})
					}
				})
				.catch(function(err){
					console.log(err);
					res.send(err);
				})
		});

		seriesRouter.route('/single/:seriesid')
			.post(function(req,res){ //add a season to a series
				//first get the series
				Series.findOne({_id:seriesid}).exec()
					.then(function(ser){
						if(!ser){//Series not found
							res.json({status:false,error:'No Series found'})
						}
						else{//series found. Add season to it
							let season = new Season();
							season._id = req.body.seasonid;
							season.noOfEpisodes = req.body.noOfEpisodes;
							season.inCollection = req.body.inCollection;

							ser.seasons.push(season);
							ser.save()
								.then(function(serNew){
									res.json({status:true,series:serNew.title,season:req.body.seasonid});
								})
								.catch(function(err){
									console.log(err);
									res.send(err);
								})
						}

					})
					.catch(function(err){
						console.log(err);
						res.send(err);
					})

			})

			//to do rest

			.get(function(req,res){ //get a single movie
				Movie.findById(req.params.movieid)
					.then(function(mov){
						if(!mov){
							res.json({status:false,error:'No movie found'})
						}
						else{
							res.json(mov);
						}
					})
					.catch(function(err){
						console.log(err);
						res.send(err);
					})
			})

			.delete(function(req,res){ //delete movie
				Movie.remove({_id: req.params.movieid})
					.then(function(mov){
						if(!mov){
							res.json({status:false,error:'No movie found'})
						}
						else{
							res.json({status:true,movie:mov.name})
						}
					})
					.catch(function(err){
						console.log(err);
						res.send(err);
					})
			});

		seriesRouter.route('/all')
			.get(function(req,res){ //get all movies
				Movie.find({})
					.then(function(movies){
						res.json(movies);
					})
					.catch(function(err){
						console.log(err);
						res.send(err);
					})
			})


			return seriesRouter;


}