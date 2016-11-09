angular.module('book-controller',[])

.controller('mybookController' , function($location,Book){

	let vm = this;

	Book.getAllBooks()
	.success(function(data){
		vm.mybooks = data;
		console.log(vm.mybooks);
	})
	.error(function(err){
		console.log(err);
	})

})


.controller('addbookController', function($location, Book){

	let vm = this;
	vm.operation = 'create';
	vm.message = '';
	vm.error = '';

	vm.addBook = function(){
		vm.processing = true;
		vm.message = '';

		Book.addBook(vm.bookdata)
		.success(function(book){
			vm.message = 'Book added succesfully';
		})
		.error(function(err){
			console.log(err);
			vm.error = 'Error adding book. Try again';
		})
	}

})