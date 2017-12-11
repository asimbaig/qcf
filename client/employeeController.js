myApp.controller('employeeController',['Upload','$window','$scope','$http','$location','$route','FileService',function(Upload,$window,$scope,$http,$location,$route,FileService){
 var vm = this;
 vm.submitFile = function(){ //function to call on form submit
   if (vm.upload_form.file.$valid && vm.file) { //check if file is valid
         localStorage.setItem("filename","");
         FileService.upload(vm.file,'/uploadEmp'); //call upload function
     }
  $http({
       url: '/empRegCode',
       method: 'POST',
       data: vm.data
   }).then(function (httpResponse) {

     if(vm.data.empPass1===vm.data.empPass2 && httpResponse.data.flag==='true'){
             alert("Your Uploaded Picture saved.");
             var savedFileName = localStorage.getItem("filename");
             vm.data['profilePicture'] = savedFileName;
           $http({
               url: '/empReg',
               method: 'POST',
               data: vm.data
           }).then(function (httpResponse2) {
             var employeeData ={
                 active : httpResponse2.data.active,
                 joinDate : httpResponse2.data.joinDate,
                 email : httpResponse2.data.email,
                 phone : httpResponse2.data.phone,
                 address : httpResponse2.data.address,
                 profilePicture : httpResponse2.data.profilePicture,
                 fullName : httpResponse2.data.fullName,
                 role : httpResponse2.data.role,
                 empRegisterCode: httpResponse2.data.empRegisterCode
             };
             localStorage.setItem("employeeData",JSON.stringify(employeeData));
             localStorage.setItem("EmployeeFlag","true");
             localStorage.setItem("CompanyFlag","false");

             $window.location.href = '/main.html';

           },
  					 function(response) {
  							 // failure callback,handle error here
  							 if(response.status==400){
  									 console.log("Something went wrong while registering Employee!!");
  							 }
  					 });

       }else{
         alert("Please confirm your Password again.\n Or Verify Registration Code.");
         location.reload();
       }
   },
     function(response) {
         // failure callback,handle error here
         if(response.status==400){
             console.log(response.data.message);
         }
     });


    }
}]);
