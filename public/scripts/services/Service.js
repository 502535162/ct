diagnostics.factory('restService', function($rootScope, $http, localStorageService) 
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

    restService.updateAccount = function (details, callback) {
		$http.post('/update', details).then(function(response){
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

    restService.createPatientRec = function (details, callback) {
    	userdetails = localStorageService.get('userdetails');
		$http.post('/createPatientRec', {token:userdetails.token, data:details}).then(function(response){
			console.log(response);
			callback(response.data)
		}, function(response){
			callback(response.data)
		});
    };

    restService.createServiceRec = function (details, callback) {
    	userdetails = localStorageService.get('userdetails');
		$http.post('/createServiceRec', {token:userdetails.token, data:details}).then(function(response){
			console.log(response);
			callback(response.data)
		}, function(response){
			callback(response.data)
		});
    };

    restService.createsalesRec = function (details, callback) {
    	userdetails = localStorageService.get('userdetails');
		$http.post('/createsalesRec', {token:userdetails.token, data:details}).then(function(response){
			console.log(response);
			callback(response.data)
		}, function(response){
			callback(response.data)
		});
    };

    restService.getPatientRec = function (details, callback) {
		$http.post('/getPaitentRec', details).then(function(response){
			console.log(response);
			callback(response.data)
		}, function(response){
			callback(response.data)
		});
    };

    return restService;
});
