myApp.controller('eventProgramController',['Upload','$window','$scope','$http','$location','$route','FileService',function(Upload,$window,$scope,$http,$location,$route,FileService){
  var vm = this;

    if(localStorage.getItem("eventProgramFlag")==='true'){
                  $scope.causesCharities = [];
                  var comp = localStorage.getItem("companyName");
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

					if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
								localStorage.setItem("filename","");
								FileService.upload(vm.file,'/uploadep'); //call upload function
						}
            alert("Your Uploaded Picture saved.");
						var savedFileName = localStorage.getItem("filename");
						vm.data['picture'] = savedFileName;
					$http({
		          url: '/evtPrgReg',
		          method: 'POST',
		          data: vm.data
		      }).then(function (httpResponse) {
              localStorage.setItem("companyName","");
     				  localStorage.setItem("eventProgramFlag","false");
							$route.reload();
		      },
 					 function(response) {
 							 // failure callback,handle error here
 							 if(response.status==400){
 									 console.log("Something went wrong while registering Event/Program.");
 							 }
 					 });
    }
}]);
