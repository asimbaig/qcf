myApp.controller('companyController',['Upload','$window','$scope','$http','$location','$route','FileService',function(Upload,$window,$scope,$http,$location,$route,FileService){
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
								localStorage.setItem("filename","");
								FileService.upload(vm.file,'/uploadcomp'); //call upload function
				}
          alert("Your Uploaded Picture saved.");
					var savedFileName = localStorage.getItem("filename");


          vm.data['causesCharities'] = $scope.selected;

					vm.data['logoPicture'] = savedFileName;

          var randomCode = makeRegCode()
          vm.data['empRegisterCode'] = randomCode;

          $http({
		          url: '/comReg',
		          method: 'POST',
		          data: vm.data
		      }).then(function (httpResponse) {
						var companyData ={
								ctive : httpResponse.data.active,
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
		    }else{
					alert("Please confirm your Password again.\n Or Verify Registration Code.");
					location.reload();
				}
    }
    function makeRegCode() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    };
}]);
