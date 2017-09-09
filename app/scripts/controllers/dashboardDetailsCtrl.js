'use strict';
/**
 * @ngdoc function
 * @description
 * # LoginCtrl
 */
app.controller('dashboardDetailsCtrl', ['DashboardDetailsService', '$scope', '$cookieStore', '$state', '$rootScope', '$timeout','$stateParams', function (DashboardDetailsService, $scope, $cookieStore, $state, $rootScope, $timeout,$stateParams) {
    $("body").removeClass("login_body");
    $scope.detailsResult=[];$scope.productResult=[];
    var oid = $stateParams.odid;
    $scope.imgcls=[];
    $scope.imgcls[0] = 'cd-picture';$scope.imgcls[1] = 'cd-movie';$scope.imgcls[2] = 'cd-location';
    
    $scope.dashboardDetails = function () {
        $scope.displayLoading = true;
        DashboardDetailsService.getdashboardDetails(oid).then(function (response) {
            $scope.detailsResult=response.data.queryresult;;
            angular.forEach($scope.detailsResult, function(value, key) {
              if(key==0){
                $scope.productResult.push(value);
              }

            });
            setTimeout(function () {
                    var hgt = $(".dashboardDetails-Container").height()+35;
                    $('.side_bar').attr('style', 'min-height:' + hgt+"px");
            }, 500);
            $scope.displayLoading = false;
        }, function (error) {
            console.log("Error while fetching block data: " + error);
            $scope.displayLoading = false;
        });
    }
    $scope.dashboardDetails();
    $scope.logout=function()
    {
        $cookieStore.remove('loginTempData');
        window.history.forward(-1);
        $state.go('login');
    }
}]);