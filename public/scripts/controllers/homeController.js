diagnostics.controller('homeController', function ($scope, $state, $sessionStorage, localStorageService) {
    $scope.isHome = true;
    // $scope.loginSuccess = localStorageService.get("loginSuccess");

    $(".dropdown").hover(            
        function() {
            $('.dropdown-menu', this).stop( true, true ).fadeIn("fast");
            $(this).toggleClass('open');
            $('b', this).toggleClass("caret caret-up");                
        },
        function() {
            $('.dropdown-menu', this).stop( true, true ).fadeOut("fast");
            $(this).toggleClass('open');
            $('b', this).toggleClass("caret caret-up");                
    });

    $scope.homeLoad = function(){
        $scope.$watch('$viewContentLoaded', function(){
            // CAMERA SLIDER
            $("#camera_wrap_1").camera({
                alignment: 'center',
                autoAdvance: false,
                mobileAutoAdvance: true,
                barDirection: 'leftToRight',
                barPosition: 'bottom',
                loader: 'none',
                opacityOnGrid: false, 
                cols: 12,
                height: '50%',
                playPause: false,
                pagination: false
            });
        });
    }

    $scope.stateHome = function(){
        
    }

    $scope.$watch('$viewContentLoaded', function(){
        
    });

    $scope.stateServices = function(serviceName){
        $state.go('services', { serviceame: serviceName});
    }

    var selServices = JSON.parse(localStorageService.get("selServices"));
    if(selServices != null)
        setTimeout(function(){$state.go('services')}, 0);

});