//Registering ContactController with Main application module 'myApp' & injecting dependencies
myApp.controller('ContactController',['$scope','$location','$window',function($scope,$location,$window){
		var vm = this;
			$scope.sendMessage=function(){
			         $location.path('contact-success');
      };
			vm.sendEmail=function(){
								$window.location.href = 'views/forgotten-success.html';
      };
}]);
