angular.module('book-controller',[])

.controller('mybookController' , function($location,$route,Book){

	let vm = this;

	Book.getAllBooks()
	.then(function(response){
		vm.mybooks = response.data;
	},
	function(err){
		console.log(err);
		vm.error = "Error retrieving books";
	});

	vm.deleteBook = function(bookid){
		Book.deleteBook(bookid)
			.then(function(response){
				$route.reload();
			},
			function(err){
				console.log(err);
				vm.error = 'Error deleting book';
			});
	}

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
		.then(function(response){
			vm.message = 'Book added succesfully';
		},
		function(err){
			console.log(err);
			vm.error = 'Error adding book. Try again';
		});
	}

})

.controller('editbookController', function($routeParams,$location,Book){

	let vm = this;
	vm.operation = 'edit';
	vm.message = '';
	vm.error = '';
	let bookid = $routeParams.bookid;

	Book.getSingleBook(bookid)
	.then(function(response){
		vm.bookdata = response.data;
	},
	function(err){
		console.log(err);
		vm.error = 'Error retrieving book. Try again';
	});

	vm.processBook = function(){
		Book.updateBook(bookid,vm.bookdata)
		.then(function(response){
			vm.message = 'Book updated succesfully';
		},
		function(err){
			console.log(err);
			vm.error = 'Error updating Book. Please try again';
		});
	}

})