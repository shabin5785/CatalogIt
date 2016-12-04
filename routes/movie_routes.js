const models = require('../models/catalog');
const config = require('config');
const Movie = models.movie;

module.exports = function(app,express){

	const movieRouter = express.Router();

	movieRouter.route('/single')
		.post(function(req,res){ //add single movie
			let movie = new Movie();
			movie.user = "12345"; //placeholder
			movie.title = req.body.title;
			if(req.body.genre){
				movie.genre = req.body.genre;
			}
			if(req.body.series){
				movie.series = req.body.series;
			}
			movie.inCollection = false;
			if(req.body.inCollection){
				movie.inCollection = req.body.inCollection;
			}
			movie.save()
				.then(function(mov){
					res.json({status:true,movie:mov.title,id:mov._id});
				})
				.catch(function(err){
					console.log(err);
					res.send(err);
				})
		})

		.put(function(req,res){ //update a single movie
			Movie.findOne({_id:req.body.id}).exec()
				.then(function(mov){
					if(!mov){//movie not found
						res.json({status:false,error:'No Movie found'})
					}
					else{
						//movie to update found
						if(req.body.title) mov.title = req.body.title;
						if(req.body.genre) mov.genre = req.body.genre;
						if(req.body.series) mov.series = req.body.series;
						if(req.body.inCollection != 'undefined') mov.inCollection = req.body.inCollection;
						mov.save()
							.then(function(mov){
								res.json({status:true,movie:mov.title,id:mov._id});
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

		movieRouter.route('/single/:movieid')
			.get(function(req,res){ //get a single movie
				Movie.findById(req.params.movieid)
					.then(function(mov){
						if(!mov){
							res.json({status:false,error:'No Movie found'})
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
							res.json({status:false,error:'No Movie found'})
						}
						else{
							res.json({status:true,movie:mov.name,id:mov._id})
						}
					})
					.catch(function(err){
						console.log(err);
						res.send(err);
					})
			});

		movieRouter.route('/all')
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

			return movieRouter;
}