myApp.controller('causeCharityController',['Upload','$window','$scope','$http','$location','$route','FileService',function(Upload,$window,$scope,$http,$location,$route,FileService){

 var vm = this;

 vm.submitFile = function(){ //function to call on form submit

					if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                var currentDate = new Date();
                var day = currentDate.getDate();
                var month = currentDate.getMonth() + 1;
                var year = currentDate.getFullYear();

                var filename = "uploads\\file-"+vm.file.name; //+ "-" + day + "-" + month + "-" + year;
                //alert("file b4 upload 1: "+filename);
								localStorage.setItem("filename",filename);
								//console.log("<<<<<<*>>>>>>"+filename);
								FileService.upload(vm.file); //call upload function
						}

						var savedFileName = localStorage.getItem("filename");
            //alert("file b4 upload 2: "+savedFileName);
            vm.data['picture'] = savedFileName;
					$http({
		          url: '/cseChtReg',
		          method: 'POST',
		          data: vm.data
		      }).then(function (httpResponse) {
							alert("New record added!!!!!");
							$route.reload();
		      });
    }
}]);
