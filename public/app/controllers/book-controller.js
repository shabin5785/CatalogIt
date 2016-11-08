angular.module('book-controller',[])

.controller('mybookController' , function($location,Book){

	let vm = this;

	Book.getAllBooks()
	.success(function(books){
		console.log(" >>",books);
	})
	.error(function(err){
		console.log(err);
	})

	//add book function
	vm.addBook = function(){


	}

})