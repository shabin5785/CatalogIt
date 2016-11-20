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

	vm.processBook = function(){
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

.controller('editbookcontroller', function($routeParams,$location,Book){

	let vm = this;
	vm.operation = 'edit';
	vm.message = '';
	vm.error = '';
	let bookid = $routeParams.bookid;

	Book.getSingleBook(bookid)
	.success(function(bok){
		vm.bookdata = bok;
		console.log('book',bok);
	})
	.error(function(err){
		console.log(err);
		vm.error = 'Error retrieving book. Try again';
	})

	vm.processBook = function(){
		Book.updateBook(bookid,vm.bookdata)
		.success(function(bok){
			vm.message = 'Book updated succesfully';
		})
		.error(function(err){
			console.log(err);
			vm.error = 'Error updating Book. Please try again';
		})
	}

})