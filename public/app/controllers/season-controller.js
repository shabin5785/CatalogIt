angular.module('season-controller',[])

.controller('myseasonController', function($location,$route,$routeParams,Season){

	let vm = this;

	vm.seriesid = $routeParams.seriesid;

	Season.getAllSeasons(vm.seriesid)
	.then(function(response){
		Season.setSeriesName(response.data.title);
		vm.seriesName = response.data.title;
		vm.myseasons = response.data.seasons;
		
	},
	function(err){
		console.log(err);
		vm.error = "Error retrieving Season";
	});


	vm.deleteSeason = function(seriesid,seasonid){
		Season.deleteSeason(seriesid,seasonid)
		.then(function(){
			$route.reload();
		},
		function(err){
			console.log(err);
			vm.error = 'Error deleting Season';
		});
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
		Season.addSeason(vm.seasondata,vm.seriesid)
		.then(function(response){
			vm.message = 'Season added succesfully';
		},
		function(err){
			console.log(err);
			vm.error = 'Error adding Season. Try again';
		});
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
	.then(function(response){
		vm.seasondata = response.data;
		vm.seasondata.seasonid = response.data._id;
	},
	function(err){
		console.log(err);
		vm.error = 'Error retrieving Season. Try again';
	});

	vm.processSeason = function(){
		Season.updateSeason(vm.seasondata,vm.seriesid,seasonid)
		.then(function(response){
			vm.message = 'Season updated succesfully';
		},
		function(err){
			console.log(err);
			vm.error = 'Error updating Season. Please try again';
		});
	}

})
