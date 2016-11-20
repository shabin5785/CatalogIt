angular.module('main-controller', [])

.controller('mainController' , function($rootScope, $location, Auth){

	let vm = this;

	//get logged in or not
	vm.loggedIn = Auth.isLoggedIn();

	$rootScope.$on('$routeChangeStart',function(){
		vm.loggedIn = Auth.isLoggedIn();
		vm.loggedInUser = Auth.getActiveUser();
	});

	vm.login = () => {

		vm.processing = true;
		vm.error = '';
		Auth.login(vm.email,vm.password)
		.success((data) => {
			vm.processing = false;
			vm.loggedInUser = Auth.getActiveUser();
			$location.path('/catalogit');
		})
		.error((err) => {
			vm.processing = false;
			vm.error = 'Invalid credentials. Login failed';
		});
	}

	vm.logout = () => {
		Auth.logout();
		$location.path('/');
	}


});