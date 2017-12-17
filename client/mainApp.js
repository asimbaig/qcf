/**
 * 	Its main entry point for angular front-end.
 */
 //Register new module named myApp and injecting dependencies
var myApp = angular.module('myApp',['ngRoute','ngFileUpload','720kb.datepicker']);

//Configing routes for 'Views' and associating controllers with them
myApp.config(['$routeProvider',function($routeProvider){
	//$locationProvider.html5Mode(true);
	$routeProvider

	.when('/Login',{templateUrl: '/index.html',controller: 'LoginController'})
	.when('/adminLogin',{templateUrl: '/adminLogin.html',controller: 'loginRegisterController'})
	.when('/registerStaff',{templateUrl: 'views/staffRegister.html',controller: 'loginRegisterController'})
	.when('/Logout',{templateUrl: '/logout.html',controller: 'LogoutController'})
	.when('/header',{templateUrl: '/header.html',controller: 'headerController'})
	.when('/adminHeader',{templateUrl: '/adminHeader.html',controller: 'adminHeaderController'})
	.when('/home',{templateUrl: 'views/home.html',controller: 'homeController',controllerAs: 'mc'})
	.when('/aboutUs',{templateUrl: 'views/aboutUs.html',controller: 'homeController'})
	.when('/employeeRegister',{templateUrl: 'employeeRegister.html',controller: 'employeeController'})
	.when('/employeeMain',{templateUrl: 'views/employeeMain.html',controller: 'employeeProfileController'})
	.when('/companyRegister',{templateUrl: 'companyRegister.html',controller: 'companyController'})
	.when('/companyMain',{templateUrl: 'views/companyMain.html',controller: 'companyProfileController'})
	.when('/contact',{templateUrl: 'views/contact.html',controller: 'ContactController'})
	.when('/contact-success',{templateUrl: 'views/contact-success.html',controller: 'ContactController'})
	.when('/eventProgram',{templateUrl: 'views/event-program.html',controller: 'eventProgramController'})
	.when('/causeCharity',{templateUrl: 'views/cause-charity.html',controller: 'causeCharityController'})

	.when('/removeEventProgram',{templateUrl: 'views/removeEventProgram.html',controller: 'eventProgramController'})
	.when('/removeCauseCharity',{templateUrl: 'views/removeCauseCharity.html',controller: 'causeCharityController'})
	.when('/removeCompany',{templateUrl: 'views/removeCompany.html',controller: 'companyController'})
	.when('/removeEmployee',{templateUrl: 'views/removeEmployee.html',controller: 'employeeController'})
	.when('/removeStaff',{templateUrl: 'views/removeStaff.html',controller: 'loginRegisterController'})
	.otherwise({redirectTo: '/home'});

}]);

myApp.run(function(){
});
