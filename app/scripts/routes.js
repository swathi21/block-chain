'use strict';

/**
 * @ngdoc overview
 * @name blockChainApp routes
 * @description
 * # Routing for the application
 */
angular.module('app.routes', ['ui.router']).config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider) {
        //$locationProvider.html5Mode(true).hashPrefix('!');
        $stateProvider
            .state('secure', {
                template: '<ui-view/>',
                abstract: true,
                resolve: {
                    /*isAuthenticated: ['UserLoginService','$q', function(UserLoginService,$q){
                    	var defered = $q.defer();
                    	if(UserLoginService.isAuthenticated() == null){
                    		defered.reject("UNAUTHORIZED");
                    	}
                    	return defered.promise;
                    }]*/
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/loginPage.html',
                controller: 'loginCtrl'
            })
			.state('dashboard', {
                parent: 'secure',
                url: '/dashboard',
                templateUrl: 'views/layout.html',
                controller: 'dashboardCtrl'
            })
            .state('dashboardDetails', {
                url: '/dashboardDetails:odid',
                templateUrl: 'views/dashboardDetails.html',
                controller: 'dashboardDetailsCtrl'
            })
            .state('showBlocks', {
                url: '/showBlocks',
                templateUrl: 'views/showBlocks.html',
                controller: 'showBlocksCtrl'
            });
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            $state.go('login');
        });
}]);