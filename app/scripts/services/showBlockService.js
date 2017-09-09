 'use strict';
 /**
  * @ngdoc function
  * @name
  * @description
  * # UserLoginService
  * User Service for user authentication
  */
 app.factory('ShowBlockService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
     var showBlockService = {};
     showBlockService.fetchData = function (odrid) {
         var deferred = $q.defer();
         $http({
             method: 'GET'
             , url: 'http://52.204.221.24:7050/chain/blocks/' + odrid
         }).then(function (blockStatus) {
            blockStatus.data['height']=odrid;
             deferred.resolve(blockStatus);
         }, function (error) {
             deferred.reject(error);
         });
         return deferred.promise;
     }

     showBlockService.getCurrentStatus = function () {
         var deferred = $q.defer();
         $http({
             method: 'GET'
             , url: 'http://52.204.221.24:7050/chain'
         }).then(function (currentStatus) {
             deferred.resolve(currentStatus);
         }, function (error) {
             deferred.reject(error);
         });
         return deferred.promise;
     }

     showBlockService.getNetworkDetails = function () {
         var deferred = $q.defer();
         $http({
             method: 'GET'
             , url: 'http://52.204.221.24:7050/network/peers'
         }).then(function (networkStatus) {
             deferred.resolve(networkStatus);
         }, function (error) {
             deferred.reject(error);
         });
         return deferred.promise;
     }

     return showBlockService;
  }]);