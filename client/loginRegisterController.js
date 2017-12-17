//Registering loginRegisterController with Main application module 'myApp' & injecting dependencies
myApp.controller('loginRegisterController',['$window','$scope','$http','$location','$route',function($window,$scope,$http,$location,$route){
     var vm = this;

     $http.get('/getStaff').then(function(response){
    			 $scope.allStaff = response.data;
     });

     vm.submitAdminLogin = function(){ //function to call on form submit
              //Ajax post call to verify staff login details
          		$http({
				          url: '/adminLogin',
				          method: 'POST',
				          data: vm.data
				      }).then(function (httpResponse) {
                var staffData ={
                    email : httpResponse.data.email,
                    role : httpResponse.data.role
                };
                if(httpResponse.data.role==='admin'){
                      localStorage.setItem("staffFlag","true");
                      localStorage.setItem("staffData",JSON.stringify(staffData));

                 }else if(httpResponse.data.role==='user'){
                      localStorage.setItem("staffFlag","false");
                      localStorage.setItem("staffData",JSON.stringify(staffData));

                 }else{
                      localStorage.setItem("staffData","");
                      localStorage.setItem("staffFlag","");
                }
                $window.location.href = '/adminHome.html';
				      },
                function(response) {
                    // failure callback,handle error here
                    // response.data.message will be "Invalid Email/Password"
                    if(response.status==400){
                        console.log(response.data.message);
                        $scope.message = response.data.message;
                    }
                });
		 }

     vm.registerStaff = function(){ //function to call on form submit
           if(vm.data.staffPass1===vm.data.staffPass2){
             //Ajax post call to save new staff in Database
             $http({
                 url: '/staffReg',
                 method: 'POST',
                 data: vm.data
             }).then(function (httpResponse) {
               var staffData ={
                   email : httpResponse.data.email,
                   role : httpResponse.data.role
               };
               if(httpResponse.data.role==='admin'){
                     localStorage.setItem("staffFlag","true");
                }else{
                     localStorage.setItem("staffFlag","false");
                }

               localStorage.setItem("staffData",JSON.stringify(staffData));
               $window.location.href = '/adminHome.html';

             },
              function(response) {
                  // failure callback,handle error here
                  if(response.status==400){
                      console.log("Something went wrong while registering Employee!!");
                  }
              });
           }else{
             alert("Please confirm your Password again.");
             if(httpResponse.status==400){
                 console.log(response.data.message);
             }
             location.reload();
          }

      }

    $scope.removeStaff = function(Email){
        var flag = confirm("Are you sure\nYou want to delete "+ Email +"'s record permanently?");

        if(flag===true){
               //alert(emp_ppic);
              var temp = {
                      email:Email
                    };
              $http({
                  url: '/RemoveStaff',
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
                        console.log("Something went wrong,while removing Staff");
                    }
                });
        }

      };
}]);
