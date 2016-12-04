angular.module('app.routes',['ngRoute'])

.config(function($routeProvider, $locationProvider){

	$routeProvider

	.when('/',{
		templateUrl: 'app/views/pages/home.html'
	})

	//login page
	.when('/login',{
		templateUrl: 'app/views/pages/login.html',
		controller: 'mainController',
		controllerAs: 'login'
	})

	//main page
	.when('/catalogit',{
		templateUrl: 'app/views/pages/catalog.html',
		controller: 'mainController',
		controllerAs: 'catalog'
	})

	//books view page
	.when('/mybooks',{
		templateUrl: 'app/views/pages/books/mybooks.html',
		controller: 'mybookController',
		controllerAs: 'book'
	})

	//add book page
	.when('/addbook',{
		templateUrl: 'app/views/pages/books/book.html',
		controller: 'addbookController',
		controllerAs: 'book'
	})

	//edit book page
	.when('/editbook/:bookid',{
		templateUrl: 'app/views/pages/books/book.html',
		controller: 'editbookController',
		controllerAs: 'book'
	})

	//movies view page
	.when('/mymovies',{
		templateUrl: 'app/views/pages/movies/mymovies.html',
		controller: 'mymovieController',
		controllerAs: 'movie'
	})

	//add movie page
	.when('/addmovie',{
		templateUrl: 'app/views/pages/movies/movie.html',
		controller: 'addmovieController',
		controllerAs: 'movie'
	})

	//edit movie page
	.when('/editmovie/:movieid',{
		templateUrl: 'app/views/pages/movies/movie.html',
		controller: 'editmovieController',
		controllerAs: 'movie'
	})


	//remove hash from url
	$locationProvider.html5Mode(true);
});