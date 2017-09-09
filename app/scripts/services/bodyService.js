 'use strict';

/**
 * @ngdoc function
 * @name
 * @description
 * # UserLoginService
 * User Service for user authentication
 */
app.factory('BodyService', function() {
  var bodyClass = '';
  return {
    bodyClass: function() {
      return bodyClass;
    },
    setBodyClass: function(newBodyClass) {
      bodyClass = newBodyClass;
    }
  };
});