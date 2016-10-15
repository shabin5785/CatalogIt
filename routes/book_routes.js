const models = require('../models/catalog');
const config = require('config');
const Book = models.book;

module.exports = function(app,express){

	const bookRouter = express.Router();

	
	bookRouter.route('/single')
		.post(function(req,res){ //add book

			let book = new Book();
			book._user='12345'; //placeholder
			book.title = req.body.title;
			book.author = req.body.author;
			if(req.body.series){
				book.series = req.body.series;
			}
			book.inCollection = true;
			book.save()
				.then(function(book){
					res.json({status:true,book:book.title});
				})
				.catch(function(err){
					console.log(err);
					res.send(err);
				})
		})

		.put(function(req,res){ //update a single book
			Book.findOne({_id:req.body.id}).exec()
				.then(function(bok){
					if(!bok){//book not found
						res.json({status:false,error:'No book found'})
					}
					else{
						//book to update found
						if(req.body.title) bok.title = req.body.title;
						if(req.body.author) bok.author = req.body.author;
						if(req.body.series) bok.series = req.body.series;
						if(req.body.inCollection) bok.inCollection = req.body.inCollection;
						bok.save()
							.then(function(bok){
								res.json({status:true,book:bok.title});
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

		bookRouter.route('/single/:bookid')
			.get(function(req,res){ //get a single book
				Book.findById(req.params.bookid)
					.then(function(bok){
						if(!bok){
							res.json({status:false,error:'No book found'})
						}
						else{
							res.json(bok);
						}
					})
					.catch(function(err){
						console.log(err);
						res.send(err);
					})
			})

			.delete(function(req,res){ //delete book
				Book.remove({_id: req.params.bookid})
					.then(function(bok){
						if(!bok){
							res.json({status:false,error:'No book found'})
						}
						else{
							res.json({status:true,book:bok.name})
						}
					})
					.catch(function(err){
						console.log(err);
						res.send(err);
					})
			});

		bookRouter.route('/all')
			.get(function(req,res){ //get all books
				Book.find({})
					.then(function(books){
						res.json(books);
					})
					.catch(function(err){
						console.log(err);
						res.send(err);
					})
			})

	

	return bookRouter;
}