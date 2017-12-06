myApp.controller('comLoginController',['$window','$scope','$http','$location','$route',function($window,$scope,$http,$location,$route){
 		 var vm = this;
		 vm.submitLogin = function(){ //function to call on form submit
			 				//console.log("In comLoginController");
							$http({
				          url: '/comLogin',
				          method: 'POST',
				          data: vm.data
				      }).then(function (httpResponse) {
								var companyData ={
										ctive : httpResponse.data.active,
										joinDate : httpResponse.data.joinDate,
										company : httpResponse.data.company,
										email : httpResponse.data.email,
										phone : httpResponse.data.phone,
										address : httpResponse.data.address,
										logoPicture : httpResponse.data.logoPicture,
										companyName : httpResponse.data.companyName,
										causesCharities: httpResponse.data.causesCharities,
										details: httpResponse.data.details
								};
								localStorage.setItem("companyData",JSON.stringify(companyData));

								//var tempObj = JSON.stringify(httpResponse);

									//console.log("Hello " + tempObj);
									$location.path('companyMain');

				      });
		 }

}]);
