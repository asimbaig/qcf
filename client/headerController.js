//Registering headerController with Main application module 'myApp' & injecting dependencies
myApp.controller('headerController',['Upload','$window','$scope','$http','$location','$route',function(Upload,$window,$scope,$http,$location,$route){
  //Verify if its company login and setting up href attribute of profile to company.
  if(sessionStorage.getItem("CompanyFlag")==='true'){
          var companyData = JSON.parse(sessionStorage.getItem("companyData"));
          $scope.profile='#!/companyProfile';
          $scope.name = companyData.companyName;
          $scope.Image = companyData.logoPicture;
  }
  //Verify if its employee login and setting up href attribute of profile to employee.
  else if(sessionStorage.getItem("EmployeeFlag")==='true'){
          var employeeData = JSON.parse(sessionStorage.getItem("employeeData"));
          $scope.profile='#!/employeeProfile';
          $scope.name = employeeData.fullName;
          $scope.Image = employeeData.profilePicture;

  }else{
          $scope.profile='';
  }

}]);
