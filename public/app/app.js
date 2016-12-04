angular.module('catalog',[
	'ngAnimate',
	'app.routes',
	'main-controller',
	'auth-service',
	'book-controller',
	'book-service',
	'movie-controller',
	'movie-service'
	])

//app config to integrate token to request
.config(function($httpProvider){

	 //attach auth interceptor to http requests
	 $httpProvider.interceptors.push('AuthInterceptor');
	});