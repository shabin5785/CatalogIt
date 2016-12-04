angular.module('movie-controller',[])

.controller('mymovieController', function($location,$route,Movie){

	let vm = this;

	Movie.getAllMovies()
		.success(function(data){
			vm.mymovies = data
		})
		.error(function(err){
			console.log(err);
			vm.error = "Error retrieving movies";
		})

	vm.deleteMovie = function(movieid){
		Movie.deleteMovie(movieid)
			.success(function(){
				$route.reload();
			})
			.error(function(err){
				console.log(err);
				vm.error = 'Error deleting Movie';
			})
	}

})


.controller('addmovieController', function($location, Movie){

	let vm = this;
	vm.operation = 'create';
	vm.message = '';
	vm.error = '';

	vm.processMovie = function(){
		vm.processing = true;
		vm.message = '';

		Movie.addMovie(vm.moviedata)
		.success(function(movie){
			vm.message = 'Movie added succesfully';
		})
		.error(function(err){
			console.log(err);
			vm.error = 'Error adding Movie. Try again';
		})
	}

})

.controller('editmovieController', function($routeParams,$location,Movie){

	let vm = this;
	vm.operation = 'edit';
	vm.message = '';
	vm.error = '';
	let movieid = $routeParams.movieid;

	Movie.getSingleMovie(movieid)
	.success(function(mov){
		vm.moviedata = mov;
	})
	.error(function(err){
		console.log(err);
		vm.error = 'Error retrieving movie. Try again';
	})

	vm.processMovie = function(){
		Movie.updateMovie(movieid,vm.moviedata)
		.success(function(mov){
			vm.message = 'Movie updated succesfully';
		})
		.error(function(err){
			console.log(err);
			vm.error = 'Error updating Movie. Please try again';
		})
	}

})