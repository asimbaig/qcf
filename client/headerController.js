myApp.controller('headerController',['Upload','$window','$scope','$http','$location','$route','FileService',function(Upload,$window,$scope,$http,$location,$route,FileService){
  if(localStorage.getItem("CompanyFlag")==='true'){
          var companyData = JSON.parse(localStorage.getItem("companyData"));
          $scope.profile='#!/companyMain';
          $scope.name = companyData.companyName;
  }
  else if(localStorage.getItem("EmployeeFlag")==='true'){
          var employeeData = JSON.parse(localStorage.getItem("employeeData"));
          $scope.profile='#!/employeeMain';
          $scope.name = employeeData.fullName;

  }else{
          $scope.profile='';
  }
}]);
