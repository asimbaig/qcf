//Registering adminHeaderController with Main application module 'myApp' & injecting dependencies
myApp.controller('adminHeaderController',['Upload','$window','$scope','$http','$location','$route',function(Upload,$window,$scope,$http,$location,$route){

  //Verify if its admin staff login and setting up menu attributes accordingly
  if(sessionStorage.getItem("staffFlag")==='true'){
          var staffData = JSON.parse(sessionStorage.getItem("staffData"));
          $scope.addUser = 'true';
          $scope.managers = 'true';
  }
  //Verify if its user staff login and setting up menu attributes accordingly
  else if(sessionStorage.getItem("staffFlag")==='false'){
          var staffData = JSON.parse(sessionStorage.getItem("staffData"));
          $scope.addUser = 'false';
          $scope.managers = 'true';

  }else{
          $scope.addUser = 'false';
          $scope.managers = 'false';
  }

  //logout from staff area
  $scope.logout = function(){
          //sessionStorage.setItem("staffData","");
          //sessionStorage.setItem("staffFlag","");
          sessionStorage.removeItem('staffData');
          sessionStorage.removeItem('staffFlag');
          $scope.addUser = 'false';
          $scope.managers = 'false';
          $window.location.href = '/adminLogin.html';

  };
}]);
