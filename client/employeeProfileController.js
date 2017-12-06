myApp.controller('employeeProfileController',['Upload','$window','$scope','$http','$location','$route',function(Upload,$window,$scope,$http,$location,$route){
				var employeeData = JSON.parse(localStorage.getItem("employeeData"));

				$scope.empImage = employeeData.profilePicture;
				$scope.empName = employeeData.fullName ;
				$scope.empCompany = employeeData.company;
				$scope.eventsProgram = employeeData.eventsProgram;
				$scope.empJoinDate =  employeeData.joinDate;

				var companyChartiresCauses;

				$http({
						url: '/fetchCompany',
						method: 'POST',
						data: employeeData
				}).then(function (httpResponse) {
						$scope.compLogo = httpResponse.data.logoPicture;

						//companyChartiresCauses = httpResponse.data.causesCharities;
				});

				$http({
						 url: '/loadAvailableEvtProg',
						 method: 'POST',
						 data: {companyName:employeeData.company}
				 }).then(function (httpResponse) {
					 //var tempObj = JSON.stringify(httpResponse);
					 //console.log("allEventProgram>>>>>><<<<<<< " + tempObj);
					 var tempArray = [];
					 	for(var t in httpResponse.data){
						 				tempArray.push(httpResponse.data[t].title);
					 	}
						//console.log("allEventProgram----tempArray  >>>>>><<<<<<< " + tempArray);
						for(var i in tempArray){
								for(var j in employeeData.eventsProgram){
										if(tempArray[i]===employeeData.eventsProgram[j]){
													tempArray.splice(i, 1);
										}
								}
						}
					 	 $scope.avlEventsPrograms = tempArray;
				 });

				/*$http.get('/loadEvents').then(function(response){
							$scope.avlEventsPrograms = response.data;
							console.log("loadEvents-> "+JSON.stringify( response.data));
				});*/

				$scope.removeEventProgram=function(ep){

						console.log(ep);
	 				 var temp = {fullName:employeeData.fullName, eventProgram:ep };
	 				 $http({
	 						 url: '/RemoveEventProgram',
	 						 method: 'POST',
	 						 data: temp
	 				 }).then(function (httpResponse) {
	 					 		//console.log("In remove response");

	 							//var tempObj = JSON.stringify(httpResponse);

	 								//console.log("tempObj " + tempObj);
	 								//console.log("httpResponse.data.eventsProgram :"+httpResponse.data.eventsProgram);

	 								$scope.eventsProgram = httpResponse.data.eventsProgram;
									$scope.avlEventsPrograms.push(ep);
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
							console.log(list);
				};

				$scope.addEventProgram = function(item){
 				 toggle(item,$scope.selected);
 				 //console.log(employeeData.fullName+" >>>>>>>>>>>>>>>ITEM in AngJs>>>>>>>>>>>>>>>>>>>>>> "+item);
 				 var temp = {fullName:employeeData.fullName, eventProgram:item };
 				 $http({
 						 url: '/addEventProgram',
 						 method: 'POST',
 						 data: temp
 				 }).then(function (httpResponse) {
 					 		//console.log("In add response");

 							//var tempObj = JSON.stringify(httpResponse);

 								//console.log("tempObj " + tempObj);
 								//console.log("httpResponse.data.eventsProgram :"+httpResponse.data.eventsProgram);

 								$scope.eventsProgram = httpResponse.data.eventsProgram;
								var index = $scope.avlEventsPrograms.indexOf(item);
								if (index > -1) {
								    $scope.avlEventsPrograms.splice(index, 1);
								}
 					});
   		 };
}]);
