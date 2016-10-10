let models = require('../models/catalog');
const config = require('config');
const User = models.user;

module.exports = function(app,express){

	const openRouter = express.Router();

	openRouter.route('/adduser')
	.post(function(req,res){
		let user = new User();
		user.name = req.body.name;
		user.password = req.body.password;
		user.email = req.body.email;
		user.save()
			.then(function(user){
				res.json({status:true,user:user.name})
			})
			.catch(function(err){
				console.log(err);
				res.send(err);
			})

	});
	
	return openRouter;
}