diagnostics.factory('restService', function($rootScope, $http) 
{
    var restService = {};
    var url = "http://localhost:8081";
    var socket = null;

	restService.getStatusmenu = function(){
		return statusMenu;
	}

    restService.login = function (credentials, callback) {
		$http.post('/signin', credentials).then(function(response){
			console.log(response);
			callback(response.data)
		}, function(response){
			callback(response.data)
		});
    };

    restService.forgotpassword = function (details, callback) {
		$http.post('/forgotPassword', details).then(function(response){
			console.log(response);
			callback(response.data)
		}, function(response){
			callback(response.data)
		});
    };

    restService.createAccount = function (details, callback) {
		$http.post('/signup', details).then(function(response){
			console.log(response);
			callback(response.data)
		}, function(response){
			callback(response.data)
		});
    };

    restService.getpackages = function (callback) {
		$http.get('/getpackages').then(function(response){
			console.log(response);
			callback(response.data)
		}, function(response){
			callback(response.data)
		});
    };

    restService.getPackageInfo = function (details, callback) {
		$http.post('/getPackagesinfo', details).then(function(response){
			console.log(response);
			callback(response.data)
		}, function(response){
			callback(response.data)
		});
    };

    restService.getProfilesInfo = function (callback) {
		$http.post('/getProfilesInfo').then(function(response){
			console.log(response);
			callback(response.data)
		}, function(response){
			callback(response.data)
		});
    };

    restService.getTestsInfo = function (callback) {
		$http.post('/getTestsInfo').then(function(response){
			console.log(response);
			callback(response.data)
		}, function(response){
			callback(response.data)
		});
    };

    return restService;
});
