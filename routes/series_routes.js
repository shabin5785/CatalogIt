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
				res.json({status:true,series:ser.title,id:ser._id});
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
							res.json({status:true,series:ser.title,id:ser._id});
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
				Series.findOne({_id:req.params.seriesid}).exec()
				.then(function(ser){
						if(!ser){//Series not found
							res.json({status:false,error:'No Series found'})
						}
						else{//series found. Add season to it
							let season = new Season();
							season._id = req.body.seasonid;
							if(req.body.noOfEpisodes) season.noOfEpisodes = req.body.noOfEpisodes;
							if(req.body.inCollection) season.inCollection = req.body.inCollection;

							ser.seasons.push(season);
							ser.save()
							.then(function(serNew){
								res.json({status:true,series:serNew.title,season:req.body.seasonid,id:serNew._id});
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

			.put(function(req,res){//update a season
				//find the series
				Series.findOne({_id:req.params.seriesid}).exec()
				.then(function(ser){
						if(!ser){//Series not found
							res.json({status:false,error:'No Series found'})
						}
						else{//series found. Now get season from that
							let seasonid = req.body.seasonid;
							let sea = ser.seasons.id(seasonid);
							if(!sea){//Season not found
								res.json({status:false,error:'No Season found'})
							}
							else{
								if(req.body.noOfEpisodes)sea.noOfEpisodes = req.body.noOfEpisodes;
								if(req.body.inCollection != 'undefined') sea.inCollection = req.body.inCollection;
								ser.save()
								.then(function(serUpd){
									res.json({status:true,series:serUpd.title,id:serUpd._id,season:req.body.seasonid});
								})
								.catch(function(err){
									console.log(err);
									res.send(err);
								})
							}
						}

					})
				.catch(function(err){
					console.log(err);
					res.send(err);
				})

			})

			.get(function(req,res){ //get a single series
				Series.findById(req.params.seriesid)
				.then(function(ser){
					if(!ser){
						res.json({status:false,error:'No Series found'})
					}
					else{
						res.json(ser);
					}
				})
				.catch(function(err){
					console.log(err);
					res.send(err);
				})
			})

			.delete(function(req,res){ //delete series
				Series.remove({_id: req.params.seriesid})
				.then(function(ser){
					if(!ser){
						res.json({status:false,error:'No series found'})
					}
					else{
						res.json({status:true,series:ser.name,id:ser._id})
					}
				})
				.catch(function(err){
					console.log(err);
					res.send(err);
				})
			});

			seriesRouter.route('/single/:seriesid/:seasonid')
			.get(function(req,res){ //get single season of a series
				//find the series
				Series.findOne({_id:req.params.seriesid}).exec()
				.then(function(ser){
						if(!ser){//Series not found
							res.json({status:false,error:'No Series found'})
						}
						else{//series found. Now get season from that
							let seasonid = req.params.seasonid;
							let sea = ser.seasons.id(seasonid);
							if(!sea){//Season not found
								res.json({status:false,error:'No Season found'})
							}
							else{
								res.json(sea);
							}
						}

					})
				.catch(function(err){
					console.log(err);
					res.send(err);
				})
			})

			.delete(function(req,res){//delete single season
				//find the series
				Series.findOne({_id:req.params.seriesid}).exec()
				.then(function(ser){
						if(!ser){//Series not found
							res.json({status:false,error:'No Series found'})
						}
						else{//series found. Now get season from that
							let seasonid = req.params.seasonid;
							let sea = ser.seasons.id(seasonid);
							if(!sea){
								res.json({status:false,error:'No Season found'})
							}
							else{
								sea.remove();
								ser.save()
								.then(function(serUpd){
									res.json({status:true,series:serUpd.title,id:serUpd._id})
								})
								.catch(function(err){
									console.log(err);
									res.send(err);
								})
							}
						}

					})
				.catch(function(err){
					console.log(err);
					res.send(err);
				})
			})


			seriesRouter.route('/all')
			.get(function(req,res){ //get all series
				Series.find({})
				.then(function(serieses){
					res.json(serieses);
				})
				.catch(function(err){
					console.log(err);
					res.send(err);
				})
			})


			return seriesRouter;


		}