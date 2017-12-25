//Registering employeeProfileController with Main application module 'myApp' & injecting dependencies
myApp.controller('employeeProfileController',['Upload','$window','$scope','$http','$location','$route',function(Upload,$window,$scope,$http,$location,$route){
				var employeeData = JSON.parse(sessionStorage.getItem("employeeData"));

				//Displaying Employee data on profile page
				$scope.empImage = employeeData.profilePicture;
				$scope.empName = employeeData.fullName ;
				$scope.eventsProgram = employeeData.eventsProgram;

				var myDate = new Date(employeeData.joinDate);
				$scope.empJoinDate = myDate.getDate()+" - "+myDate.getMonth()+" - "+myDate.getFullYear();

				var companyChartiresCauses;

				//Ajax post call to find comapny of particular employee
				$http({
						url: '/fetchCompany',
						method: 'POST',
						data: employeeData
				}).then(function (httpResponse) {
						$scope.compLogo = httpResponse.data.logoPicture;
						$scope.empCompany = httpResponse.data.companyName;
						$scope.compCausesCharities = httpResponse.data.causesCharities;

				},
					function(response) {
							// failure callback,handle error here
							if(response.status==400){
									console.log(response.data.message);
							}
					});

				//Ajax post call to load events/programs which are available for this employee
				$http({
						 url: '/loadAvailableEvtProg',
						 method: 'POST',
						 data: {empRegisterCode:employeeData.empRegisterCode}
				 }).then(function (httpResponse) {
					 var tempArray = [];
					 	for(var t in httpResponse.data){
						 				tempArray.push(httpResponse.data[t].title);
					 	}
						for(var i in tempArray){
								for(var j in employeeData.eventsProgram){
										if(tempArray[i]===employeeData.eventsProgram[j]){
													tempArray.splice(i, 1);
										}
								}
						}
					 	 $scope.avlEventsPrograms = tempArray;
				 },
					 function(response) {
							 // failure callback,handle error here
							 if(response.status==400){
									 console.log(response.data.message);
							 }
			});
			//Removing Event/Program for this employee
			$scope.removeEventProgram=function(ep){
 				 var temp = {fullName:employeeData.fullName, eventProgram:ep };
	 				 $http({
	 						 url: '/RemoveEventProgram',
	 						 method: 'POST',
	 						 data: temp
	 				 }).then(function (httpResponse) {
	 								$scope.eventsProgram = httpResponse.data.eventsProgram;
									$scope.avlEventsPrograms.push(ep);
	 					},
	 					 function(response) {
	 							 // failure callback,handle error here
	 							 if(response.status==400){
	 									 console.log("Something went wrong while removing Event/Program");
	 							 }
	 					 });
				};

				$scope.selected = [];
				toggle = function (item, list) {
							var idx = list.indexOf(item);
							if (idx > -1) {
								list.splice(idx, 1);
							}
							else {
								list.push(item);
							}
							//console.log(list);
				};
				//Adding Event/Program for this employee
				$scope.addEventProgram = function(item){
 				 toggle(item,$scope.selected);
 				 var temp = {fullName:employeeData.fullName, eventProgram:item };
 				 $http({
 						 url: '/addEventProgram',
 						 method: 'POST',
 						 data: temp
 				 }).then(function (httpResponse) {
 								$scope.eventsProgram = httpResponse.data.eventsProgram;
								var index = $scope.avlEventsPrograms.indexOf(item);
								if (index > -1) {
								    $scope.avlEventsPrograms.splice(index, 1);
								}
 					},
 					 function(response) {
 							 // failure callback,handle error here
 							 if(response.status==400){
 									 console.log("Something went wrong while adding Event/Program.");
 							 }
 					 });
   		 };
}]);
