//Registering LogoutController with Main application module 'myApp' & injecting dependencies
myApp.controller('LogoutController',['$window','$scope','$http','$location','$route',function($window,$scope,$http,$location,$route){
      sessionStorage.setItem("employeeData","");
      sessionStorage.setItem("EmployeeFlag","false");

      sessionStorage.setItem("companyData","");
      sessionStorage.setItem("CompanyFlag","false");

     var vm = this;
		 vm.submitLogin = function(){ //function to call on form submit
              //Ajax post call to verify login details
							$http({
				          url: '/Login',
				          method: 'POST',
				          data: vm.data
				      }).then(function (httpResponse) {
                //Verify if its company login
                if(httpResponse.data.CompanyFlag==='true' && httpResponse.data.EmployeeFlag==='false'){
                  var companyData ={
                    active : httpResponse.data.active,
                    joinDate : httpResponse.data.joinDate,
                    email : httpResponse.data.email,
                    phone : httpResponse.data.phone,
                    address : httpResponse.data.address,
                    logoPicture : httpResponse.data.logoPicture,
                    companyName : httpResponse.data.companyName,
                    causesCharities: httpResponse.data.causesCharities,
                    details: httpResponse.data.details,
                    regCode: httpResponse.data.regCode,
                    empRegisterCode: httpResponse.data.empRegisterCode
      						};
      						sessionStorage.setItem("companyData",JSON.stringify(companyData));
                  sessionStorage.setItem("CompanyFlag","true");

                  sessionStorage.setItem("employeeData","");
                  sessionStorage.setItem("EmployeeFlag","false");
                  $window.location.href = '/main.html';
                }
                //Verify if its employee logging in
                else if(httpResponse.data.CompanyFlag==='false' && httpResponse.data.EmployeeFlag==='true'){
                  var employeeData ={
                    active : httpResponse.data.active,
                    joinDate : httpResponse.data.joinDate,
                    email : httpResponse.data.email,
                    phone : httpResponse.data.phone,
                    address : httpResponse.data.address,
                    profilePicture : httpResponse.data.profilePicture,
                    fullName : httpResponse.data.fullName,
                    eventsProgram: httpResponse.data.eventsProgram,
                    empRegisterCode: httpResponse.data.empRegisterCode,
                    role:httpResponse.data.role
                  };
                  sessionStorage.setItem("employeeData",JSON.stringify(employeeData));
                  sessionStorage.setItem("EmployeeFlag","true");

                  sessionStorage.setItem("companyData","");
                  sessionStorage.setItem("CompanyFlag","false");
                  $window.location.href = '/main.html';
                }
                else{
                  sessionStorage.setItem("employeeData","");
                  sessionStorage.setItem("EmployeeFlag","false");

                  sessionStorage.setItem("companyData","");
                  sessionStorage.setItem("CompanyFlag","false");
                  alert("Email / Password mismatch.\n Please try again");

                }
                //location.reload();

				      },
                function(response) {
                    // failure callback,handle error here
                    // response.data.message will be "Invalid Email/Password"
                    if(response.status==400){
                        console.log(response.data.message);
                        $scope.message = response.data.message;
                    }
                });
		 }
     vm.submitRegCompany = function(){ //function call to register company
        $window.location.href = '/companyRegister.html';
     }
     vm.submitRegEmployee = function(){ //function call to register employee
        $window.location.href = '/employeeRegister.html';
     }
}]);
