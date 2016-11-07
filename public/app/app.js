angular.module('catalog',[
	'ngAnimate',
	'app.routes',
	'auth-service',
	'main-controller',
	])

//app config to integrate token to request
.config(function($httpProvider){

	 //attach auth interceptor to http requests
	 $httpProvider.interceptors.push('AuthInterceptor');
	});