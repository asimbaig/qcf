var myApp = angular.module('myApp',['ngRoute','ngFileUpload','720kb.datepicker']);

myApp.config(['$routeProvider',function($routeProvider){
	$routeProvider
	.when('/home',{
		templateUrl: 'views/home.html',
		controller: 'mainController',
		controllerAs: 'mc'
	})
	.when('/aboutUs',{
		templateUrl: 'views/aboutUs.html',
		controller: 'mainController'
	})
	.when('/employeeLogin',{
		templateUrl: 'views/employeeLogin.html',
		controller: 'empLoginController'
	})
	.when('/employeeRegister',{
		templateUrl: 'views/employeeRegister.html',
		controller: 'employeeController'
	})
	.when('/employeeMain',{
		templateUrl: 'views/employeeMain.html',
		controller: 'employeeProfileController'
	})
	.when('/companyLogin',{
		templateUrl: 'views/companyLogin.html',
		controller: 'comLoginController'
	})
	.when('/companyRegister',{
		templateUrl: 'views/companyRegister.html',
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
            this.upload = function (file) {
				        Upload.upload({
				            url: '/upload', //webAPI exposed to upload the file
				            data:{file:file} //pass file as data, should be user ng-model
				        }).then(function (resp) { //upload function returns a promise
				            if(resp.data.error_code === 0){ //validate success
				                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
				            } else {
				                $window.alert('an error occured');
				            }
				        }, function (resp) { //catch error
				            $window.alert('Error status: ' + resp.status);
				        }, function (evt) {
				            /*console.log(evt);
				            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
				            progress = 'progress: ' + progressPercentage + '% '; // capture upload progress*/
				        });
				    };
}]);


myApp.run(function(){
});
