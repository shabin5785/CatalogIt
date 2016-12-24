angular.module('series-controller',[])

.controller('myseriesController', function($location,$route,Series){

	let vm = this;

	Series.getAllSeries()
		.then(function(response){
			vm.myseries = response.data
		},
		function(err){
			console.log(err);
			vm.error = "Error retrieving Series";
		});

	vm.deleteSeries = function(seriesid){
		Series.deleteSeries(seriesid)
			.then(function(){
				$route.reload();
			},
			function(err){
				console.log(err);
				vm.error = 'Error deleting Series';
			});
	}

})


.controller('addseriesController', function($location, Series){

	let vm = this;
	vm.operation = 'create';
	vm.message = '';
	vm.error = '';

	vm.processSeries = function(){
		vm.processing = true;
		vm.message = '';

		Series.addSeries(vm.seriesdata)
		.then(function(response){
			vm.message = 'Series added succesfully';
		},
		function(err){
			console.log(err);
			vm.error = 'Error adding Series. Try again';
		})
	}

})

.controller('editseriesController', function($routeParams,$location,Series){

	let vm = this;
	vm.operation = 'edit';
	vm.message = '';
	vm.error = '';
	let seriesid = $routeParams.seriesid;

	Series.getSingleSeries(seriesid)
	.then(function(response){
		vm.seriesdata = response.data;
	},
	function(err){
		console.log(err);
		vm.error = 'Error retrieving Series. Try again';
	})

	vm.processSeries = function(){
		Series.updateSeries(seriesid,vm.seriesdata)
		.then(function(response){
			vm.message = 'Series updated succesfully';
		},
		function(err){
			console.log(err);
			vm.error = 'Error updating Series. Please try again';
		});
	}

})