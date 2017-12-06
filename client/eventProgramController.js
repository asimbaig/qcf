myApp.controller('eventProgramController',['Upload','$window','$scope','$http','$location','$route','FileService',function(Upload,$window,$scope,$http,$location,$route,FileService){

 var vm = this;
 		$http.get('/loadCharities').then(function(response){
 				$scope.causesCharities = response.data;
 		});
 vm.submitFile = function(){ //function to call on form submit

					if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
								var filename = "uploads\\file-"+vm.file.name;
								localStorage.setItem("filename",filename);
								//console.log("<<<<<<<<<<<<"+filename);
								FileService.upload(vm.file); //call upload function
						}

						var savedFileName = localStorage.getItem("filename");
						vm.data['picture'] = savedFileName;
					$http({
		          url: '/evtPrgReg',
		          method: 'POST',
		          data: vm.data
		      }).then(function (httpResponse) {
							alert("New record added!!!");
							$route.reload();

		      });

    }
}]);
