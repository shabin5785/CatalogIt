angular.module('movie-service',[])

.factory('Movie', function($http){

	//create new factory
	let movieFactory = {};

	//get all movies
	movieFactory.getAllMovies = function(){
		return $http.get('/catalog/movie/all');
	}


	//add movie
	movieFactory.addMovie = function(movie){
		return $http.post('/catalog/movie/single', movie);
	}

	//get single movie
	movieFactory.getSingleMovie = function(movieid){
		return $http.get('/catalog/movie/single/'+movieid);
	}

	//update single movie
	movieFactory.updateMovie = function(movieid,movie){
		movie.id = movieid;
		return $http.put('/catalog/movie/single',movie);
	}

	//delete single movie
	movieFactory.deleteMovie = function(movieid){
		return $http.delete('/catalog/movie/single/'+movieid);
	}

	return movieFactory;

})