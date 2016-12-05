angular.module('season-service',[])

.factory('Season',function($http){

	//create new factory
	let seasonFactory = {};

	let seriesName = '';

	//get all seasons for a series.
	//call is same as get a single series as 
	//that will have all its seasons inside it
	seasonFactory.getAllSeasons = function(seriesid){
		return $http.get('/catalog/series/single/'+seriesid);
	}


	//add season to a series
	seasonFactory.addSeason = function(season,seriesid){
		return $http.post('/catalog/series/single/'+seriesid, season);
	}

	//get single season of a series
	seasonFactory.getSingleSeason = function(seriesid, seasonid){
		return $http.get('/catalog/series/single/'+seriesid+'/'+seasonid);
	}

	//update single season of a series
	seasonFactory.updateSeason = function(season,seriesid,seasonid){
		season.seasonid = seasonid;
		return $http.put('/catalog/series/single/'+seriesid,season);
	}

	//delete single season of a series
	seasonFactory.deleteSeason = function(seriesid, seasonid){
		return $http.delete('/catalog/series/single/'+seriesid+'/'+seasonid);
	}

	seasonFactory.setSeriesName = function(name){
		seriesName = name;
	}

	seasonFactory.getSeriesName = function(){
		return seriesName;
	}

	return seasonFactory;

})