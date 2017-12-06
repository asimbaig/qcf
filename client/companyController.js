myApp.controller('companyController',['Upload','$window','$scope','$http','$location','$route','FileService',function(Upload,$window,$scope,$http,$location,$route,FileService){
 var vm = this;
 $http.get('/loadCharities').then(function(response){
			 $scope.causesCharities = response.data;
 });
 $scope.selected = [];

 $scope.toggle = function (item, list) {
			 var idx = list.indexOf(item);
			 if (idx > -1) {
				 list.splice(idx, 1);
			 }
			 else {
				 list.push(item);
			 }
			 console.log(list);
 };

 vm.submitFile = function(){ //function to call on form submit
	 		if(vm.data.comPass1===vm.data.comPass2){
				if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
								var filename = "uploads\\file-"+vm.file.name;
								localStorage.setItem("filename",filename);
								//console.log("<<<<<<<<<<<<"+filename);
								FileService.upload(vm.file); //call upload function
				}

					var savedFileName = localStorage.getItem("filename");
					vm.data['causesCharities'] = $scope.selected;

					//console.log("++++++++++++++++++++++++++++"+JSON.stringify(vm.data));
					vm.data['logoPicture'] = savedFileName;
					//console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~"+JSON.stringify(vm.data));

					$http({
		          url: '/comReg',
		          method: 'POST',
		          data: vm.data
		      }).then(function (httpResponse) {
						var companyData ={
								ctive : httpResponse.data.active,
								joinDate : httpResponse.data.joinDate,
								company : httpResponse.data.company,
								email : httpResponse.data.email,
								phone : httpResponse.data.phone,
								address : httpResponse.data.address,
								logoPicture : httpResponse.data.logoPicture,
								companyName : httpResponse.data.companyName,
								causesCharities: httpResponse.data.causesCharities,
								details: httpResponse.data.details
						};
						localStorage.setItem("companyData",JSON.stringify(companyData));

						//var tempObj = JSON.stringify(httpResponse);

							//console.log("Hello " + tempObj);
							$location.path('companyMain');
		      });
		    }else{
					alert("Please confirm your Password again.");
					$route.reload();
				}
    }
}]);
