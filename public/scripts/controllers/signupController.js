diagnostics.controller('signupController', function ($scope, $state, restService) {
    $scope.details = {};
    $scope.signupAlert = '';

	$scope.submitsignupform = function()
    {
		if (angular.isUndefined($scope.details.email) || angular.isUndefined($scope.details.password) || 
            angular.isUndefined($scope.details.firstname) || angular.isUndefined($scope.details.lastname) || 
            angular.isUndefined($scope.details.mobile) || angular.isUndefined($scope.details.cnfpassword) || $scope.details.email == '' || 
            $scope.details.password == '' || $scope.details.firstname == '' || $scope.details.lastname == '' ||
            $scope.details.mobile == '' || $scope.details.cnfpassword == '') 
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

            else if(angular.isUndefined($scope.details.password) || $scope.details.password == ''){
                $scope.signupAlert = "Please Enter password"
            }
        }
        else{
            
            if($scope.details.cnfpassword != $scope.details.password){
                $scope.signupAlert = "Password and Confirm Password are not same."
            }

            var obj = {email:$scope.details.email, password:$scope.details.password, firstname:$scope.details.firstname, 
                lastname:$scope.details.lastname, mobile:$scope.details.mobile}
        	restService.createAccount(obj, function(res){
        		if(res.success == true){
                    $state.go('home');
        		}
        		else if(res.success == false){
                    $scope.signupAlert = res.message;
        		}
        	})
        }
	}
});