angular.module('series-controller',[])

.controller('myseriesController', function($location,$route,Series){

	let vm = this;

	Series.getAllSeries()
		.success(function(data){
			vm.myseries = data
		})
		.error(function(err){
			console.log(err);
			vm.error = "Error retrieving Series";
		})

	vm.deleteSeries = function(seriesid){
		Series.deleteSeries(seriesid)
			.success(function(){
				$route.reload();
			})
			.error(function(err){
				console.log(err);
				vm.error = 'Error deleting Series';
			})
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
		.success(function(series){
			vm.message = 'Series added succesfully';
		})
		.error(function(err){
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
	.success(function(ser){
		vm.seriesdata = ser;
	})
	.error(function(err){
		console.log(err);
		vm.error = 'Error retrieving Series. Try again';
	})

	vm.processSeries = function(){
		Series.updateSeries(seriesid,vm.seriesdata)
		.success(function(ser){
			vm.message = 'Series updated succesfully';
		})
		.error(function(err){
			console.log(err);
			vm.error = 'Error updating Series. Please try again';
		})
	}

})