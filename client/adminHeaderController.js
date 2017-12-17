//Registering adminHeaderController with Main application module 'myApp' & injecting dependencies
myApp.controller('adminHeaderController',['Upload','$window','$scope','$http','$location','$route',function(Upload,$window,$scope,$http,$location,$route){

  //Verify if its admin staff login and setting up menu attributes accordingly
  if(localStorage.getItem("staffFlag")==='true'){
          var staffData = JSON.parse(localStorage.getItem("staffData"));
          $scope.addUser = 'true';
          $scope.managers = 'true';
  }
  //Verify if its user staff login and setting up menu attributes accordingly
  else if(localStorage.getItem("staffFlag")==='false'){
          var staffData = JSON.parse(localStorage.getItem("staffData"));
          $scope.addUser = 'false';
          $scope.managers = 'true';

  }else{
          $scope.addUser = 'false';
          $scope.managers = 'false';
  }

  //logout from staff area
  $scope.logout = function(){
          localStorage.setItem("staffData","");
          localStorage.setItem("staffFlag","");
          $scope.addUser = 'false';
          $scope.managers = 'false';
          $window.location.href = '/adminLogin.html';

  };
}]);
