myApp.controller('employeeController',['Upload','$window','$scope','$http','$location','$route',function(Upload,$window,$scope,$http,$location,$route){
 var vm = this;
 vm.submitFile = function(){ //function to call on form submit
   $http({
        url: '/empRegCode',
        method: 'POST',
        data: vm.data
    }).then(function (httpResponse) {

      if(vm.data.empPass1===vm.data.empPass2 && httpResponse.data.flag==='true'){
					if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
								vm.upload(vm.file,vm.data); //call upload function
						}
			}else{
        alert("Please confirm your Password again.\n Or Verify Registration Code.");
        location.reload();
			}
    },
        function(response) {
            // failure callback,handle error here
            if(response.status==400){
                console.log(response.data.message);
            }
        });

    }
    vm.upload = function (file,emp_data) {
        Upload.upload({
            url: '/uploadEmp', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                          emp_data['profilePicture'] = "uploads\\"+resp.data.fileName;
                        $http({
                            url: '/empReg',
                            method: 'POST',
                            data: emp_data
                        }).then(function (httpResponse2) {
                          var employeeData ={
                              active : httpResponse2.data.active,
                              joinDate : httpResponse2.data.joinDate,
                              email : httpResponse2.data.email,
                              phone : httpResponse2.data.phone,
                              address : httpResponse2.data.address,
                              profilePicture : httpResponse2.data.profilePicture,
                              fullName : httpResponse2.data.fullName,
                              role : httpResponse2.data.role,
                              empRegisterCode: httpResponse2.data.empRegisterCode
                          };
                          localStorage.setItem("employeeData",JSON.stringify(employeeData));
                          localStorage.setItem("EmployeeFlag","true");
                          localStorage.setItem("CompanyFlag","false");

                          $window.location.href = '/main.html';

                        },
                         function(response) {
                             // failure callback,handle error here
                             if(response.status==400){
                                 console.log("Something went wrong while registering Employee!!");
                             }
                         });
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log("Hello "+resp.data);
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('File uploading progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'File uploading progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
}]);
