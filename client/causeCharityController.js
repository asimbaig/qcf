myApp.controller('causeCharityController',['Upload','$window','$scope','$http','$location','$route',function(Upload,$window,$scope,$http,$location,$route){
 var vm = this;

 vm.submitFile = function(){ //function to call on form submit

					if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
								//var filename = "uploads\\file-"+vm.file.name;
								//localStorage.setItem("filename",filename);
								//console.log("<<<<<<<<<<<<"+filename);
								vm.upload(vm.file,vm.data); //call upload function
						}
    }
    vm.upload = function (file,cc_data) {
        Upload.upload({
            url: '/uploadcc', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                cc_data['picture'] = "uploads\\"+resp.data.fileName;
    					$http({
    		          url: '/cseChtReg',
    		          method: 'POST',
    		          data: cc_data
    		      }).then(function (httpResponse) {
    							//alert("New record added!!!!!");
                  $window.alert('Successfully Register Cause/Charity. ');
                  $route.reload();
    		      });
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('File uploading progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'File uploading progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
}]);
