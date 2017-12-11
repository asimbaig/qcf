myApp.controller('causeCharityController',['Upload','$window','$scope','$http','$location','$route','FileService',function(Upload,$window,$scope,$http,$location,$route,FileService){

 var vm = this;

 vm.submitFile = function(){ //function to call on form submit

					if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
								localStorage.setItem("filename","");
								FileService.upload(vm.file,'/uploadcc'); //call upload function
						}
            alert("Your Uploaded Picture saved.");
						var savedFileName = localStorage.getItem("filename");
            vm.data['picture'] = savedFileName;
					$http({
		          url: '/cseChtReg',
		          method: 'POST',
		          data: vm.data
		      }).then(function (httpResponse) {
							$route.reload();
		      },
            function(response) {
                // failure callback,handle error here
                if(response.status==400){
                    console.log("Something gone wrong cant save record!!");
                }
            });
    }
}]);
