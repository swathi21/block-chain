 'use strict';
 /**
  * @ngdoc function
  * @name
  * @description
  * # UserLoginService
  * User Service for user authentication
  */
 app.factory('DashboardService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope)
     {
         var dashboardService = {};
         dashboardService.getDashboardDetails = function () {
             var deferred = $q.defer();
             $http({
                 method: 'GET'
                 , url: 'http://52.204.221.24:8085/process_query?order_id='
             }).then(function (currentStatus) {
                 deferred.resolve(currentStatus);
             }, function (error) {
                 deferred.reject(error);
             });
             return deferred.promise;
         }
         dashboardService.getChainDetails = function (num) {
             var deferred = $q.defer();
             $http({
                 method: 'GET'
                 , url: 'http://52.204.221.24:8089/getBLockDetails?blocknumber=' + num
             }).then(function (chainDetails) {
                 deferred.resolve(chainDetails);
             }, function (error) {
                 deferred.reject(error);
             });
             return deferred.promise;
         }
         dashboardService.insertBlockData = function (insData) {
             var deferred = $q.defer();
             $http({
                 method: 'POST'
                 , url: 'http://52.204.221.24:8085/process_invoke'
                 , data: insData
                 , json: true, //send the desired json data in the post....
                 headers: {
                     'Content-Type': 'application/json'
                 }
             }).then(function (success) {
                 deferred.resolve(success);
             }, function (error) {
                 deferred.reject(error);
             });
             return deferred.promise;
         }
         dashboardService.readJson = function (file) {
             var deferred = $q.defer();
             $http({
                 method: 'GET'
                 , url: file
             }).then(function (currentStatus) {
                 deferred.resolve(currentStatus);
             }, function (error) {
                 deferred.reject(error);
             });
             return deferred.promise;
         }
         return dashboardService;
}]);