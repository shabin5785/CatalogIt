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
		controller: 'editbookcontroller',
		controllerAs: 'book'
	})


	//remove hash from url
	$locationProvider.html5Mode(true);
});