//Registering headerController with Main application module 'myApp' & injecting dependencies
myApp.controller('headerController',['Upload','$window','$scope','$http','$location','$route',function(Upload,$window,$scope,$http,$location,$route){
  //Verify if its company login and setting up href attribute of profile to company.
  if(localStorage.getItem("CompanyFlag")==='true'){
          var companyData = JSON.parse(localStorage.getItem("companyData"));
          $scope.profile='#!/companyMain';
          $scope.name = companyData.companyName;
  }
  //Verify if its employee login and setting up href attribute of profile to employee.
  else if(localStorage.getItem("EmployeeFlag")==='true'){
          var employeeData = JSON.parse(localStorage.getItem("employeeData"));
          $scope.profile='#!/employeeMain';
          $scope.name = employeeData.fullName;

  }else{
          $scope.profile='';
  }

}]);
