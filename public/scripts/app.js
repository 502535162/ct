
var diagnostics = angular.module('diagnostics', ['ui.router', 'ui.bootstrap', 'LocalStorageModule', 'luegg.directives', 
    'ngAnimate', 'ngSanitize', 'ngScrollbar', 'swxSessionStorage', 'multipleSelect', 'ui.bootstrap.datetimepicker']);

    diagnostics.config(function ($stateProvider, $urlRouterProvider)
    {
        $urlRouterProvider.otherwise("/home");

        $stateProvider.state('home',
        {
            url: '/home',
            templateUrl: '../views/home.html',
            controller:'homeController'
        }).state('login',
        {
            url: '/login',
            templateUrl: '../views/login.html',
            controller:'loginController'
        }).state('signup',
        {
            url: '/signup',
            templateUrl: '../views/signup.html',
            controller:'signupController'
        }).state('services',
        {
            url: '/services',
            templateUrl: '../views/services.html',
            controller:'servicesController'
        })
    })

    diagnostics.run(['$state', '$rootScope', function ($state, $rootScope, commservService) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if ((fromState.name == 'home') || (fromState.name == 'home.chat')){
                
            }
        });
    }]);