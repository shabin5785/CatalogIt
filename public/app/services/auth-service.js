angular.module('auth-service',[])

//factory to store received token in browser local storage
//and to retreive it.
.factory('AuthToken', function($window) {

	let authTokenFactory = {};

	return authTokenFactory;

})


//factory to call login service and do log in and out
.factory('Auth', function($http, $q, AuthToken) {

	let authFactory = {};

	authFactory.isLoggedIn = function() {
		return true;
	}

	return authFactory;

})

//authinterceptor factory to integrate tokens
.factory('AuthInterceptor', function($q, $location, AuthToken) {

	let authinterceptorFactory = {};


	return authinterceptorFactory;

});

