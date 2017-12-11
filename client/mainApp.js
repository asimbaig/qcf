var myApp = angular.module('myApp',['ngRoute','ngFileUpload','720kb.datepicker']);

myApp.config(['$routeProvider',function($routeProvider){
	$routeProvider
	.when('/Login',{
		templateUrl: '/index.html',
		controller: 'LoginController'
	})
	.when('/Logout',{
		templateUrl: '/logout.html',
		controller: 'LogoutController'
	})
	.when('/header',{
		templateUrl: '/header.html',
		controller: 'headerController'
	})
	.when('/main',{
		templateUrl: 'main.html',
		controller: 'MainAppController'
	})
	.when('/home',{
		templateUrl: 'views/home.html',
		controller: 'mainController',
		controllerAs: 'mc'
	})
	.when('/aboutUs',{
		templateUrl: 'views/aboutUs.html',
		controller: 'mainController'
	})
	.when('/employeeRegister',{
		templateUrl: 'employeeRegister.html',
		controller: 'employeeController'
	})
	.when('/employeeMain',{
		templateUrl: 'views/employeeMain.html',
		controller: 'employeeProfileController'
	})
	.when('/companyRegister',{
		templateUrl: 'companyRegister.html',
		controller: 'companyController'
	})
	.when('/companyMain',{
		templateUrl: 'views/companyMain.html',
		controller: 'companyProfileController'
	})
	.when('/contact',{
		templateUrl: 'views/contact.html',
		controller: 'ContactController'
	})
	.when('/contact-success',{
		templateUrl: 'views/contact-success.html',
		controller: 'ContactController'
	})
	.when('/eventProgram',{
		templateUrl: 'views/event-program.html',
		controller: 'eventProgramController'
	})
	.when('/causeCharity',{
		templateUrl: 'views/cause-charity.html',
		controller: 'causeCharityController'
	})
	.otherwise({
		redirectTo: '/home'
	});
	//$locationProvider.html5Mode(true);
}]);

myApp.service('FileService', ['Upload','$window',function(Upload,$window){
            this.upload = function (file,http_url) {
								Upload.upload({
				            url: http_url, //webAPI exposed to upload the file
				            data:{file:file} //pass file as data, should be user ng-model
				        }).then(function (resp) { //upload function returns a promise
				            if(resp.data.error_code === 0){ //validate success
												localStorage.setItem("filename","uploads\\"+resp.data.fileName);
												alert('Successfully Register. ');
				            } else {
				                $window.alert('an error occured');
				            }
				        }, function (resp) { //catch error
				            $window.alert('Error status: ' + resp.status);
				        }, function (evt) {
				        });
				    };
}]);

myApp.run(function(){
});
