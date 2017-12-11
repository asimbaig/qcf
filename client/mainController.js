myApp.controller('mainController',['$scope','$http',function($scope,$http){
			localStorage.setItem("companyName","");
			localStorage.setItem("eventProgramFlag","false");

			$http.get('data/news.json').then(function(response){
						 $scope.newss = response.data;
			});
			$http.get('/loadCompanies').then(function(response){
						$scope.partners = response.data;
			});
			$http.get('/loadEvents').then(function(response){
						$scope.events = response.data;
			});
			$http.get('/loadCharities').then(function(response){
						$scope.charity = response.data;
			});
			$http.get('data/sstories.json').then(function(response){
						 $scope.sstories = response.data;
			});
}]);
