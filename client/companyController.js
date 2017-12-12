myApp.controller('companyController',['Upload','$window','$scope','$http','$location','$route',function(Upload,$window,$scope,$http,$location,$route){
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
	 		if(vm.data.comPass1===vm.data.comPass2 && vm.data.regCode==='ABCD-1234-EFGH'){
				if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
								vm.upload(vm.file,vm.data); //call upload function
				}

		    }else{
          alert("Please confirm your Password again.\n Or Verify Registration Code.");
					location.reload();
				}
    }

    vm.upload = function (file,comp_data) {
        Upload.upload({
            url: '/uploadcomp', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
						if(resp.data.error_code === 0){ //validate success
              comp_data['causesCharities'] = $scope.selected;

              comp_data['logoPicture'] = "uploads\\"+resp.data.fileName;

              var randomCode = makeRegCode()
              comp_data['empRegisterCode'] = randomCode;

              $http({
                  url: '/comReg',
                  method: 'POST',
                  data: comp_data
              }).then(function (httpResponse) {
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
                localStorage.setItem("EmployeeFlag","false");
                $window.location.href = '/main.html';
              },
                function(response) {
                    // failure callback,handle error here
                    if(response.status==400){
                        console.log("Something went wrong cant save record!!");

                    }
                });
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
    function makeRegCode() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    };

}]);
