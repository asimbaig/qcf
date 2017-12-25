//Registering homeController with Main application module 'myApp' & injecting dependencies
myApp.controller('homeController',['$scope','$http',function($scope,$http){

			sessionStorage.setItem("companyName","");
			sessionStorage.setItem("eventProgramFlag","false");

			//Setup data for News Tab in home page
			$http.get('data/news.json').then(function(response){
						 $scope.newss = response.data;
			});
			//Setup data for Supporting Companies or Partners Tab in home page
			$http.get('/loadCompanies').then(function(response){
						$scope.partners = response.data;
			});
			//Setup data for Events/Programs Tab in home page
			$http.get('/loadEvents').then(function(response){
						$scope.events = response.data;
			});
			//Setup data for Causes/Charities Tab in home page
			$http.get('/loadCharities').then(function(response){
						$scope.charity = response.data;
			});
			//Setup data for Success Stories Tab in home page
			$http.get('data/sstories.json').then(function(response){
						 $scope.sstories = response.data;
			});

			//Setup data for Reports Tab in home page
			$http.get('data/reports.json').then(function(response){
						 $scope.reports = response.data;
			});

}]);
