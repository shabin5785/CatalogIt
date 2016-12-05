angular.module('season-controller',[])

.controller('myseasonController', function($location,$route,$routeParams,Season){

	let vm = this;

	vm.seriesid = $routeParams.seriesid;

	Season.getAllSeasons(vm.seriesid)
	.success(function(data){
		Season.setSeriesName(data.title);
		vm.seriesName = data.title;
		vm.myseasons = data.seasons;
		
	})
	.error(function(err){
		console.log(err);
		vm.error = "Error retrieving Season";
	})


	vm.deleteSeason = function(seriesid,seasonid){
		Season.deleteSeason(seriesid,seasonid)
		.success(function(){
			$route.reload();
		})
		.error(function(err){
			console.log(err);
			vm.error = 'Error deleting Season';
		})
	}

})


.controller('addseasonController', function($location,$routeParams, Season){
	let vm = this;
	vm.seriesid = $routeParams.seriesid;
	vm.operation = 'create';
	vm.message = '';
	vm.error = '';

	vm.processSeason = function(){
		vm.processing = true;
		vm.message = '';
		console.log('d ', vm.seasondata);
		Season.addSeason(vm.seasondata,vm.seriesid)
		.success(function(season){
			vm.message = 'Season added succesfully';
		})
		.error(function(err){
			console.log(err);
			vm.error = 'Error adding Season. Try again';
		})
	}

})



.controller('editseasonController', function($routeParams,$location,Season){

	let vm = this;
	vm.seriesid = $routeParams.seriesid;
	vm.operation = 'edit';
	vm.message = '';
	vm.error = '';
	let seasonid = $routeParams.seasonid;

	Season.getSingleSeason(vm.seriesid,seasonid)
	.success(function(sea){
		vm.seasondata = sea;
		vm.seasondata.seasonid = sea._id;
	})
	.error(function(err){
		console.log(err);
		vm.error = 'Error retrieving Season. Try again';
	})

	vm.processSeason = function(){
		Season.updateSeason(vm.seasondata,vm.seriesid,seasonid)
		.success(function(sea){
			vm.message = 'Season updated succesfully';
		})
		.error(function(err){
			console.log(err);
			vm.error = 'Error updating Season. Please try again';
		})
	}

})
