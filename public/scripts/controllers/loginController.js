diagnostics.controller('loginController', function ($scope, $state, $timeout, $rootScope, restService, localStorageService) {
	$scope.loginSuccess = false;
	$scope.loginFailed  = false;
	$scope.isForgotPass = false;
    $scope.isProgress = false;
	$scope.credentials = {};
    $scope.forgotpass = {};
	$scope.loginAlert = "";
    $scope.fpAlert = "";

	$scope.forgotpassword = function(){
		$scope.isForgotPass = true;
	}

	$scope.submitloginform = function(){
		if (angular.isUndefined($scope.credentials.email) || angular.isUndefined($scope.credentials.password) || $scope.credentials.email == "" || $scope.credentials.password == "") {
            $scope.loginFailed = false;
            $scope.loginAlert = "Please Enter the below fields";
        }
        else{
            $scope.isProgress = true;
        	restService.login($scope.credentials, function(res){
                $scope.isProgress = false;
        		if(res.success == true){
        			$scope.loginSuccess = true;
        			$scope.loginAlert = '';
        			localStorageService.set("userdetails", res.userdetails);
        			localStorageService.set("loginSuccess", $scope.loginSuccess);
                    var selServices = localStorageService.get("selServices");
                    $rootScope.$broadcast('login', true);
                    if(selServices != null){
                        $state.go('services');
                    }else{
                       $state.go('home');  
                    }
					
        		}
        		else if(res.success == false)
        		{
        			$scope.loginSuccess = false;
        			$scope.loginAlert = res.message;
        			localStorageService.set("loginSuccess", $scope.loginSuccess);
        		}
        		
        	})
        }
	}

	$scope.submitForgotpassform = function(){
		if (angular.isUndefined($scope.forgotpass.email) || $scope.forgotpass.email == "") {
            $scope.loginFailed = false;
            $scope.fpAlert = "Please Enter the below fields";
        }
        else{
            restService.forgotpassword($scope.forgotpass, function(res){
                if(res.success == true){
                    $scope.fpAlert = res.message;
                }
                else if(res.success == false){
                    $scope.fpAlert = res.message;
                }
            })
        }
	}
});