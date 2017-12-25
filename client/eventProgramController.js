//Registering eventProgramController with Main application module 'myApp' & injecting dependencies
myApp.controller('eventProgramController',['Upload','$window','$scope','$http','$location','$route',function(Upload,$window,$scope,$http,$location,$route){
 var vm = this;
 //Ajax get call to load all Events/Programs
 $http.get('/loadEvents').then(function(response){
      $scope.allEventsPrograms = response.data;
 });

 //Verify if its company who is adding event/program.
 if(sessionStorage.getItem("eventProgramFlag")==='true'){
               $scope.causesCharities = [];
               var comp = sessionStorage.getItem("companyName");
               $scope.company = comp;
               $http({
                    url: '/companysCharities',
                    method: 'POST',
                    data: {companyName:comp}
                }).then(function (httpResponse) {
                    $scope.causesCharities = httpResponse.data.causesCharities;
                },
                  function(response) {
                      // failure callback,handle error here
                      if(response.status==400){
                          console.log(response.data.message);
                      }
                  });
 }
 //Otherwise Its Quartet admin adding this event/program
  else{
                 $http.get('/loadCharities').then(function(response){
                   var tempArray = [];
                    for(var t in response.data){
                            tempArray.push(response.data[t].title);
                    }
                     $scope.causesCharities = tempArray;
                 },
                  function(response) {
                      // failure callback,handle error here
                      if(response.status==400){
                          console.log(response.data.message);
                      }
                  });

               $scope.company = "QCF";
 }
 vm.submitFile = function(){ //function to call on form submit
          //alert("enter submit");
					if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
								vm.upload(vm.file,vm.data); //call upload function
						}

    }

    vm.upload = function (file,ep_data) {
        Upload.upload({
            url: '/uploadep', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
          //alert("enter then");
            if(resp.data.error_code === 0){ //validate success
                    ep_data['picture'] = "uploads\\"+resp.data.fileName;
                  $http({
                      url: '/evtPrgReg',
                      method: 'POST',
                      data: ep_data
                  }).then(function (httpResponse) {
                      $window.alert('Successfully Register Event/Program. ');
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
    $scope.removeEventProgram = function(Id,Title,Picture){
      var flag = confirm("Are you sure\nYou want to delete this Event/Program: "+ Title +" permanently?");

      if(flag===true){
             //alert(emp_ppic);
            var temp = {
              id:Id,
              title:Title,
              picture:Picture
            };
            $http({
                url: '/RemoveEvtProg',
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
                      console.log("Something went wrong,while removing Event/Program");
                  }
              });
      }

    };
}]);
