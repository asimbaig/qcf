//Registering ContactController with Main application module 'myApp' & injecting dependencies
myApp.controller('ContactController',['$scope','$location',function($scope,$location){
			$scope.sendMessage=function(){
			         $location.path('contact-success');
      };
}]);
