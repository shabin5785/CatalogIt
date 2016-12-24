angular.module('movie-controller',[])

.controller('mymovieController', function($location,$route,Movie){

	let vm = this;

	Movie.getAllMovies()
		.then(function(response){
			vm.mymovies = response.data
		},
		function(err){
			console.log(err);
			vm.error = "Error retrieving Movies";
		});

	vm.deleteMovie = function(movieid){
		Movie.deleteMovie(movieid)
			.then(function(){
				$route.reload();
			},
			function(err){
				console.log(err);
				vm.error = 'Error deleting Movie';
			});
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
		.then(function(response){
			vm.message = 'Movie added succesfully';
		},
		function(err){
			console.log(err);
			vm.error = 'Error adding Movie. Try again';
		});
	}

})

.controller('editmovieController', function($routeParams,$location,Movie){

	let vm = this;
	vm.operation = 'edit';
	vm.message = '';
	vm.error = '';
	let movieid = $routeParams.movieid;

	Movie.getSingleMovie(movieid)
	.then(function(response){
		vm.moviedata = response.data;
	},
	function(err){
		console.log(err);
		vm.error = 'Error retrieving movie. Try again';
	});

	vm.processMovie = function(){
		Movie.updateMovie(movieid,vm.moviedata)
		.then(function(response){
			vm.message = 'Movie updated succesfully';
		},
		function(err){
			console.log(err);
			vm.error = 'Error updating Movie. Please try again';
		});
	}

})