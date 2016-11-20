angular.module('book-service',[])

.factory('Book',function($http){

	//create new factory
	let bookFactory = {};

	//get all books for the user
	bookFactory.getAllBooks = function(){
		return $http.get('/catalog/book/all');
	}

	//add book
	bookFactory.addBook = function(book){
		return $http.post('/catalog/book/single', book);
	}

	bookFactory.getSingleBook = function(bookid){
		return $http.get('/catalog/book/single/'+bookid);
	}

	bookFactory.updateBook = function(bookid,book){
		book.id = bookid;
		return $http.put('/catalog/book/single',book);
	}

	bookFactory.id = '';

	return bookFactory;

});