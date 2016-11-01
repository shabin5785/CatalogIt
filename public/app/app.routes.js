angular.module('app.routes',['ngRoute'])

.config(function($routeProvider, $locationProvider){

	$routeProvider

	.when('/',{
		templateUrl: 'app/views/pages/home.html',
		controller: 'mainController',
		controllerAs: 'main'
	});

	//remove hash from url
	$locationProvider.html5Mode(true);
});