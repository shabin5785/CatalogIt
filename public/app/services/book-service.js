angular.module('book-service',[])

.factory('Book',function($http){

	//create new factory
	let bookFactory = {};

	//get all books for the user
	bookFactory.getAllBooks = function(){
		return $http.get('/catalog/book/all');
	}

	//add book
	bookFactory.addBook = function(){
		
	}

	return bookFactory;

});