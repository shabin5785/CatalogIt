angular.module('series-service',[])

.factory('Series',  function($http){

	//create new factory
	let seriesFactory = {};

	//get all series
	seriesFactory.getAllSeries = function(){
		return $http.get('/catalog/series/all');
	}


	//add series
	seriesFactory.addSeries = function(series){
		return $http.post('/catalog/series/single', series);
	}

	//get single series
	seriesFactory.getSingleSeries = function(seriesid){
		return $http.get('/catalog/series/single/'+seriesid);
	}

	//update single series
	seriesFactory.updateSeries = function(seriesid,series){
		series.id = seriesid;
		return $http.put('/catalog/series/single',series);
	}

	//delete single series
	seriesFactory.deleteSeries = function(seriesid){
		return $http.delete('/catalog/series/single/'+seriesid);
	}

	return seriesFactory;

})