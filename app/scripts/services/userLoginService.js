'use strict';
/**
 * @ngdoc function
 * @name
 * @description
 * # UserLoginService
 * User Service for user authentication
 */
app.factory('UserLoginService', ['$q', '$http', '$cookies', '$cookieStore', function ($q, $http, $cookies, $cookieStore) {
        var userDetails = {};
        userDetails.isAuthenticated = function () {
            if ($cookieStore.get('loginData') != null) {
                return $cookieStore.get('loginData');
            }
            else if (userDetails.userData != null) {
                return userDetails.userData;
            }
            else {
                return null;
            }
        }
        userDetails.authenticateUser = function (userName, passWord) {
            var deferred = $q.defer();
            if (userName == 'admin' && passWord == 'admin') {
                deferred.resolve(true);
            }
            else {
                deferred.reject(false);
            }
            return deferred.promise;
        }
        return userDetails;
  }]);