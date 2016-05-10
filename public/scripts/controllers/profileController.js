diagnostics.controller('profileController', function ($scope, $state, restService, localStorageService) {
    $scope.details = {};
    $scope.signupAlert = '';

    $scope.details = localStorageService.get('userdetails');

	$scope.updateform = function()
    {
		if (angular.isUndefined($scope.details.email) || angular.isUndefined($scope.details.firstname) 
            || angular.isUndefined($scope.details.lastname) || angular.isUndefined($scope.details.mobile) 
            || $scope.details.email == '' || $scope.details.firstname == '' || $scope.details.lastname == '' ||
            $scope.details.mobile == '') 
        {
            if(angular.isUndefined($scope.details.firstname) || $scope.details.firstname == ''){
                $scope.signupAlert = "Please Enter Firstname"
            }

            else if(angular.isUndefined($scope.details.lastname) || $scope.details.lastname == ''){
                $scope.signupAlert = "Please Enter Lastname"
            }

            else if(angular.isUndefined($scope.details.email) || $scope.details.email == ''){
                $scope.signupAlert = "Please Enter Valid Email"
            }

            else if(angular.isUndefined($scope.details.mobile) || $scope.details.mobile == ''){
                $scope.signupAlert = "Please Enter Valid Moible Number"
            }
        }
        else{
            var obj = {email:$scope.details.email, firstname:$scope.details.firstname, lastname:$scope.details.lastname, 
                mobile:$scope.details.mobile, token:$scope.details.token}

        	restService.updateAccount(obj, function(res){
        		if(res.success == true){
                    $scope.signupAlert = res.message;
                    localStorageService.set('userdetails',$scope.details)
        		}
        		else if(res.success == false){
                    $scope.signupAlert = res.message;
        		}
        	})
        }
	}
});