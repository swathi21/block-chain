'use strict';
/**
 * @ngdoc function
 * @description
 * # LoginCtrl
 */
app.controller('loginCtrl', ['UserLoginService', '$scope', '$cookieStore', '$state', '$rootScope', '$timeout', function (UserLoginService, $scope, $cookieStore, $state, $rootScope, $timeout) {
    $('body').addClass('login_body');
    $scope.loginButtonClick = function () {
        $scope.displayLoading = true;
        UserLoginService.authenticateUser($scope.username, $scope.password).then(function (response) {
            $cookieStore.put('loginTempData', {
                userName:$scope.username,
                password: $scope.password
            });
            if (localStorage.getItem("fileData") === null) {
                localStorage.setItem("fileData", 0);
            }
            
            $rootScope.logUser = $cookieStore.get('loginTempData').userName;
            $scope.displayLoading = false;
            $state.go('dashboard');
        }, function (error) {
            $scope.displayError = "username or password is incorrect";
            $scope.displayLoading = false;
        });
    }
    
}]);