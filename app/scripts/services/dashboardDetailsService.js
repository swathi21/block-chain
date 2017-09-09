 'use strict';

/**
 * @ngdoc function
 * @name
 * @description
 * # UserLoginService
 * User Service for user authentication
 */
app.factory('DashboardDetailsService', ['$q', '$http','$rootScope', function ($q, $http, $rootScope) 
{
    var dashboardDetailsService = {};
    dashboardDetailsService.getdashboardDetails = function (odrid) {
         var deferred = $q.defer();
         $http({
             method: 'GET'
             , url: 'http://52.204.221.24:8085/process_query?order_id='+odrid
         }).then(function (dashDetails) {
             deferred.resolve(dashDetails);
         }, function (error) {
             deferred.reject(error);
         });
         return deferred.promise;
     }
    return dashboardDetailsService;
}]);