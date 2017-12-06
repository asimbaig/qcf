myApp.controller('employeeController',['Upload','$window','$scope','$http','$location','$route','FileService',function(Upload,$window,$scope,$http,$location,$route,FileService){
 var vm = this;
 $http.get('/loadCompanies').then(function(response){
			 $scope.companies = response.data;
 });

 vm.submitFile = function(){ //function to call on form submit

		if(vm.data.empPass1===vm.data.empPass2){
					if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
								var filename = "uploads\\file-"+vm.file.name;
								localStorage.setItem("filename",filename);
								//console.log("<<<<<<<<<<<<"+filename);
								FileService.upload(vm.file); //call upload function
						}

						var savedFileName = localStorage.getItem("filename");
						vm.data['profilePicture'] = savedFileName;
					$http({
		          url: '/empReg',
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
								fullName : httpResponse.data.fullName
						};
						localStorage.setItem("employeeData",JSON.stringify(employeeData));

						//var tempObj = JSON.stringify(httpResponse);

							//console.log("Hello >>>>>>>>>>>>>>>> " + tempObj);
							$location.path('employeeMain');

		      });

			}else{
				alert("Please confirm your Password again.");
				$route.reload();
			}
    }
}]);
