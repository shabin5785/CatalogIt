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

	//remove hash from url
	$locationProvider.html5Mode(true);
});