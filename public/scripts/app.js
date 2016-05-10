
var diagnostics = angular.module('diagnostics', ['ui.router', 'ui.bootstrap', 'LocalStorageModule', 'checklist-model',
    'ngAnimate', 'ngSanitize', 'ngScrollbar', 'swxSessionStorage', 'multipleSelect', 'angular-accordion']);

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
        }).state('profile',
        {
            url: '/profile',
            templateUrl: '../views/profile.html',
            controller:'profileController'
        }).state('services',
        {
            url: '/services',
            templateUrl: '../views/services.html',
            controller:'servicesController'
        })
    })

    diagnostics.run(['$state', '$rootScope', '$sessionStorage', function ($state, $rootScope, $sessionStorage) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (fromState.name == 'services'){
                $sessionStorage.empty();
            }
        });
    }]);