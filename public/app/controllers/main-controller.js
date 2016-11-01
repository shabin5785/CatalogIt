angular.module('main-controller', [])

.controller('mainController' , function($rootScope, $location, Auth){

	let vm = this;

	//get logged in or not
	vm.loggedIn = Auth.isLoggedIn();

	vm.loggedinUser = 'hahah';


});