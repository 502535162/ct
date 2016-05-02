diagnostics.directive('appheader', function ( $compile, $state) {
    return {
        restrict: 'EA', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements        
        templateUrl: "../../views/header.html",
        controller: function($scope, $element, $attrs, localStorageService, $sessionStorage){
        	$scope.loginSuccess = localStorageService.get("loginSuccess");
        	if($scope.loginSuccess == undefined)
        		$scope.loginSuccess = false;

        	$scope.userdetails = localStorageService.get("userdetails");
        	$scope.stateLogin = function(){
		        $state.go('login');
		    }

		    $scope.stateSignup = function(){
		        $state.go('signup');
		    }

		    $scope.stateHome = function(){
		        $state.go('home');
		    } 

		    $scope.$on('login', function(event, value) {
		        $scope.loginSuccess = value;
		    });

		    $scope.stateLogout = function(){
		        localStorageService.clearAll();
		        $sessionStorage.empty();
		        $scope.loginSuccess = false;
		    }
        }
     }
});