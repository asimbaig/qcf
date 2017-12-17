//Registering causeCharityController with Main application module 'myApp' & injecting dependencies
myApp.controller('causeCharityController',['Upload','$window','$scope','$http','$location','$route',function(Upload,$window,$scope,$http,$location,$route){
 var vm = this;
 //Ajax get call to load all Causes/Charties
 $http.get('/loadCharities').then(function(response){
      $scope.allCausesCharities = response.data;
 });
 vm.submitFile = function(){ //function to call on form submit

					if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
								vm.upload(vm.file,vm.data); //call image upload function
						}
    }
    vm.upload = function (file,cc_data) {
        Upload.upload({
            url: '/uploadcc', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                cc_data['picture'] = "uploads\\"+resp.data.fileName;
              //Ajax call to save New Cause/Charity once its image uploaded.
              $http({
    		          url: '/cseChtReg',
    		          method: 'POST',
    		          data: cc_data
    		      }).then(function (httpResponse) {
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
            //console.log('File uploading progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'File uploading progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };


 $scope.removeCauseCharity = function(Id,Title,Picture){
   var flag = confirm("Are you sure\nYou want to delete this Cause/Charity: "+ Title +" permanently?");

   if(flag===true){
          //alert(emp_ppic);
         var temp = {
           id:Id,
           title:Title,
           picture:Picture
         };
         $http({
             url: '/RemoveCseChrty',
             method: 'POST',
             data: temp
         }).then(function (httpResponse) {
               if(httpResponse.status===200){
                              $route.reload();
               }
          },
           function(response) {
               // failure callback,handle error here
               if(response.status===400){
                   console.log("Something went wrong,while removing Cause/Charity");
               }
           });
   }

 };
}]);
