diagnostics.controller('homeController', function ($scope, $state, $sessionStorage, localStorageService) {
    $scope.isHome = true;
    // $scope.loginSuccess = localStorageService.get("loginSuccess");
    $scope.cities = [{name:'Hyderabad'}, {name:'Mumbai'}];
    $scope.selCity = "";

    $scope.showModal = false;
    $scope.toggleModal = function(){
        $scope.showModal = !$scope.showModal;
    };

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
        localStorageService.set("selService", serviceName);
    }

    $scope.redirectoServices = function(){
        localStorageService.set("selCity", $scope.selCity);
        $("#stateModal").modal('hide');
        setTimeout(function(){$state.go('services')}, 300);
    }

});