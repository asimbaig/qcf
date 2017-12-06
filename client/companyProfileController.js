myApp.controller('companyProfileController',['Upload','$window','$scope','$http','$location','$route',function(Upload,$window,$scope,$http,$location,$route){

				var companyData = JSON.parse(localStorage.getItem("companyData"));
				$scope.comImage = companyData.logoPicture;
				$scope.comName = companyData.companyName ;
				$scope.comJoinDate = companyData.joinDate;
				$scope.compCausesCharities = companyData.causesCharities;

				$http({
						 url: '/loadAvailableCharities',
						 method: 'POST',
						 data: {companyName:companyData.companyName}
				 }).then(function (httpResponse) {
					 //var tempObj = JSON.stringify(httpResponse);
					 //console.log("allCausesCharities>>>>>><<<<<<< " + tempObj);
					 var tempArray = [];
					 	for(var t in httpResponse.data){
						 				tempArray.push(httpResponse.data[t].title);
					 	}
						//console.log("allCausesCharities>>>>>><<<<<<< " + tempArray);
					 	 $scope.allCausesCharities = tempArray;
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
				 //console.log(charity);
				 var temp = {compName:companyData.companyName, causeCharity:charity };
				 $http({
						 url: '/RemoveCauseCharity',
						 method: 'POST',
						 data: temp
				 }).then(function (httpResponse) {
					 		//console.log("In remove response");

							//var tempObj = JSON.stringify(httpResponse);

								//console.log("tempObj " + tempObj);
								//console.log("httpResponse.data.causesCharities :"+httpResponse.data.causesCharities);

								$scope.compCausesCharities = httpResponse.data.causesCharities;
								$scope.allCausesCharities.push(charity);
								//location.reload();
					});
  		 };

			 $scope.addCauseCharity = function(charity){
				 toggle(charity,$scope.selected);
				 //console.log(charity);
				 var temp = {compName:companyData.companyName, causeCharity:charity };
				 $http({
						 url: '/addCauseCharity',
						 method: 'POST',
						 data: temp
				 }).then(function (httpResponse) {
					 		//console.log("In add response");

							//var tempObj = JSON.stringify(httpResponse);

								//console.log("tempObj " + tempObj);
								//console.log("httpResponse.data.causesCharities :"+httpResponse.data.causesCharities);

								$scope.compCausesCharities = httpResponse.data.causesCharities;
								var index = $scope.allCausesCharities.indexOf(charity);
								if (index > -1) {
								    $scope.allCausesCharities.splice(index, 1);
								}
								//location.reload();
								//$route.reload();
					});
  		 };

}]);
