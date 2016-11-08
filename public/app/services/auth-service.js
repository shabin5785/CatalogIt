angular.module('auth-service',[])

//factory to store received token in browser local storage
//and to retreive it.
.factory('AuthToken', function($window) {

	let authTokenFactory = {};

	//get token from local storage
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	}

	//store token
	authTokenFactory.setToken = function(token){
		if(token){
			$window.localStorage.setItem('token',token);
		}
		else{
			$window.localStorage.removeItem('token');
		}
	}

	return authTokenFactory;

})


//factory to call login service and do log in and out
.factory('Auth', function($http, $q, AuthToken) {

	let authFactory = {};

	let activeUser = '';

	function setActiveUser(uname) {
		activeUser = uname;
	}

	authFactory.getActiveUser = function() {
		return activeUser;
	}

	//check if user is logged in. If token present then logged in
	authFactory.isLoggedIn = function() {
		if(AuthToken.getToken()){
			return true;
		}
		else{
			return false;
		}
	}

	//log in the user
	authFactory.login = function(email, password){
		//call node service to login
		return $http.post('/login',{
			username : email,
			password : password
		})
		.success((data)=>{
			//set token
			console.trace(data);
			AuthToken.setToken(data.token);
			setActiveUser(data.name);
			return data;
		})
		.error((err) => {
			return err;
		});
	}

	//log out
	authFactory.logout = function() {
		AuthToken.setToken();
	}


	return authFactory;

})

//authinterceptor factory to integrate tokens
.factory('AuthInterceptor', function($q, $location, AuthToken) {

	let authinterceptorFactory = {};

	//intercept requests
	authinterceptorFactory.request = function(config){
		let token = AuthToken.getToken();

		if(token){
			config.headers['Authorization'] = "Bearer " + token;
		}
		return config;
	}

	//response errors
	authinterceptorFactory.responseError = function(response) {
        //403 forbidden
        if (response.status == 403) {
        	AuthToken.setToken();
        	$location.path('/login');
        }

        //return errors as a promise
        return $q.reject(response);
    };

    return authinterceptorFactory;

});

