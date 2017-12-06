myApp.controller('empLoginController',['$window','$scope','$http','$location','$route',function($window,$scope,$http,$location,$route){
 		 var vm = this;
		 vm.submitLogin = function(){ //function to call on form submit
			 				//console.log("In empLoginController");
							$http({
				          url: '/empLogin',
				          method: 'POST',
				          data: vm.data
				      }).then(function (httpResponse) {
								var employeeData ={
										active : httpResponse.data.active,
										joinDate : httpResponse.data.joinDate,
										company : httpResponse.data.company,
										email : httpResponse.data.email,
										phone : httpResponse.data.phone,
										address : httpResponse.data.address,
										profilePicture : httpResponse.data.profilePicture,
										fullName : httpResponse.data.fullName,
										eventsProgram: httpResponse.data.eventsProgram
								};
								localStorage.setItem("employeeData",JSON.stringify(employeeData));

								//var tempObj = JSON.stringify(httpResponse);

									//console.log("Hello--->> EmpLogin :: " + tempObj);
									$location.path('employeeMain');

				      });
		 }

}]);
