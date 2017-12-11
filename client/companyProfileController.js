myApp.controller('companyProfileController',['Upload','$window','$scope','$http','$location','$route',function(Upload,$window,$scope,$http,$location,$route){

				var companyData = JSON.parse(localStorage.getItem("companyData"));
				$scope.comImage = companyData.logoPicture;
				$scope.comName = companyData.companyName ;
				$scope.comJoinDate = companyData.joinDate;
				$scope.compCausesCharities = companyData.causesCharities;
				$scope.employeeRegisterCode = companyData.empRegisterCode;

				$http({
						 url: '/loadAvailableCharities',
						 method: 'POST',
						 data: {companyName:companyData.companyName}
				 }).then(function (httpResponse) {
					 var tempArray = [];
					 	for(var t in httpResponse.data){
						 				tempArray.push(httpResponse.data[t].title);
					 	}
						$scope.allCausesCharities = tempArray;
				 },
					 function(response) {
							 // failure callback,handle error here
							 if(response.status==400){
									 console.log(response.data.message);
								}
					 });

				 $http({
 						 url: '/thisCompanyEmployees',
 						 method: 'POST',
 						 data: {empRegisterCode:companyData.empRegisterCode}
 				 }).then(function (httpResponse) {
 						$scope.allEmployees = httpResponse.data;
 				 },
					 function(response) {
							 // failure callback,handle error here
							 if(response.status==400){
									 console.log(response.data.message);
							 }
					 });

				$scope.selected = [];

			  toggle = function (item, list) {
			 			 var idx = list.indexOf(item);
			 			 if (idx > -1) {
			 				 list.splice(idx, 1);
			 			 }
			 			 else {
			 				 list.push(item);
			 			 }
			 			 console.log(list);
			 };

			 $scope.removeCauseCharity = function(charity){
				 var temp = {compName:companyData.companyName, causeCharity:charity };
				 $http({
						 url: '/RemoveCauseCharity',
						 method: 'POST',
						 data: temp
				 }).then(function (httpResponse) {
					 			$scope.compCausesCharities = httpResponse.data.causesCharities;
								$scope.allCausesCharities.push(charity);
					},
 					 function(response) {
 							 // failure callback,handle error here
 							 if(response.status==400){
 									 console.log("Something went wrong,while removing Cause/Charity");
 							 }
 					 });
  		 };

			 $scope.addCauseCharity = function(charity){
				 toggle(charity,$scope.selected);
				 var temp = {compName:companyData.companyName, causeCharity:charity };
				 $http({
						 url: '/addCauseCharity',
						 method: 'POST',
						 data: temp
				 }).then(function (httpResponse) {
								$scope.compCausesCharities = httpResponse.data.causesCharities;
								var index = $scope.allCausesCharities.indexOf(charity);
								if (index > -1) {
								    $scope.allCausesCharities.splice(index, 1);
								}
					},
 					 function(response) {
 							 if(response.status==400){
 									 console.log("Something went wrong while adding Cause/Charity.");
 							 }
 					 });
  		 };
			 $scope.addEventProgram = function(){
				 localStorage.setItem("companyName",companyData.companyName);
				 localStorage.setItem("eventProgramFlag","true");
				 $location.path('eventProgram');

			 };
}]);
