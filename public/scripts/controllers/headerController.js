diagnostics.controller('headerController', function ($scope, $state, $timeout, $rootScope, restService, localStorageService) {

   $scope.loginSuccess = false;
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
});