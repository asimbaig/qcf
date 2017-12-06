myApp.controller('mainController',['$scope','$http',function($scope,$http){
			//localStorage.setItem("IsLogin",JSON.stringify({login:false}));
			//alert(Date.now());
			//alert(CalcService.square(5));
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
			/*$http.get('data/articles.json').then(function(response){
						 $scope.articles = response.data;
			});*/
}]);
