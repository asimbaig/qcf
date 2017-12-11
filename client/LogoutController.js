myApp.controller('LogoutController',['$window','$scope','$http','$location','$route',function($window,$scope,$http,$location,$route){
      localStorage.setItem("employeeData","");
      localStorage.setItem("EmployeeFlag","false");

      localStorage.setItem("companyData","");
      localStorage.setItem("CompanyFlag","false");
     var vm = this;
		 vm.submitLogin2 = function(){ //function to call on form submit

							$http({
				          url: '/Login',
				          method: 'POST',
				          data: vm.data
				      }).then(function (httpResponse) {
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
      						localStorage.setItem("companyData",JSON.stringify(companyData));
                  localStorage.setItem("CompanyFlag","true");

                  localStorage.setItem("employeeData","");
                  localStorage.setItem("EmployeeFlag","false");
                  $window.location.href = '/main.html';
                }
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
                  localStorage.setItem("employeeData",JSON.stringify(employeeData));
                  localStorage.setItem("EmployeeFlag","true");

                  localStorage.setItem("companyData","");
                  localStorage.setItem("CompanyFlag","false");
                  $window.location.href = '/main.html';
                }
                else{
                  localStorage.setItem("employeeData","");
                  localStorage.setItem("EmployeeFlag","false");

                  localStorage.setItem("companyData","");
                  localStorage.setItem("CompanyFlag","false");
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
     vm.submitRegCompany2 = function(){ //function to call on form submit
        $window.location.href = '/companyRegister.html';
     }
     vm.submitRegEmployee2 = function(){ //function to call on form submit
        $window.location.href = '/employeeRegister.html';
     }
}]);
