'use strict';
/**
 * @ngdoc function
 * @name blockChainApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the blockChainApp
 */
app.controller('showBlocksCtrl', ['$scope', '$rootScope', '$cookieStore', 'ShowBlockService', '$state', function ($scope, $rootScope, $cookieStore, ShowBlockService, $state) {
    $("body").removeClass("login_body");
    $scope.showModal = false;
    $scope.insertDet = {};
    $scope.toggleModal = function (oid) {
        ShowBlockService.fetchData(oid).then(function (blockData) {
            $scope.popupResult = blockData.data;
            $scope.blkNumb = blockData.data.height;
            $scope.timestamp = $scope.popupResult.nonHashData.localLedgerCommitTimestamp;
            $scope.showModal = !$scope.showModal;
        }, function (error) {
            console.log("Error while fetching block data: " + error);
            $scope.displayLoading = false;
        });
    };
    $scope.logout = function () {
        $cookieStore.remove('loginTempData');
        window.history.forward(-1);
        $state.go('login');
    }
    $scope.currenttResult = [];
    $scope.networkResult = [];
    $scope.recentResult = [];
    $scope.currentStatus = function () {
        $scope.displayLoading = true;
        ShowBlockService.getCurrentStatus().then(function (response) {
            $scope.currenttResult = response.data;
            //$scope.displayLoading = false;
        }, function (error) {
            console.log("Error while fetching block data: " + error);
            $scope.displayLoading = false;
        });
    }
    $scope.networkStatus = function () {
        $scope.displayLoading = true;
        ShowBlockService.getNetworkDetails().then(function (response) {
            $scope.networkResult = response.data.peers;
            //$scope.displayLoading = false;
        }, function (error) {
            console.log("Error while fetching block data: " + error);
            $scope.displayLoading = false;
        });
    }
    $scope.recentBlocks = function (odid) {
        $scope.displayLoading = true;
        ShowBlockService.getCurrentStatus().then(function (response) {
            $scope.recentResult = [];
            var n = response.data.height;
            $scope.height = n;
            var oid = odid;
            for (var i = n - 1; i > 0; i--) {
                if (oid == 0) {
                    ShowBlockService.fetchData(i).then(function (blockData) {
                        $scope.recentResult.push(blockData.data);
                    }, function (error) {
                        console.log("Error while fetching block data: " + error);
                        $scope.displayLoading = false;
                    });
                }
                else {
                    if (oid == i) {
                        ShowBlockService.fetchData(i).then(function (blockData) {
                            $scope.recentResult.push(blockData.data);
                        }, function (error) {
                            console.log("Error while fetching block data: " + error);
                            $scope.displayLoading = false;
                        });
                    }
                }
            }
            $scope.displayLoading = false;
        }, function (error) {
            console.log("Error while fetching block data: " + error);
            $scope.displayLoading = false;
        });
    }
    $scope.currentStatus();
    $scope.networkStatus();
    $scope.recentBlocks(0);
}]);
app.directive('modal', function () {
    return {
        transclude: true
        , restrict: 'E'
        , template: '<div class="modal fade">' + '<div class="modal-dialog blk_modal_cus">' + '<div class="modal-content" style="border-radius:0px;">' + '<div class="modal-header" style="background-color:#f5f5f5;border-bottom:#f5f5f5;">' + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + '<h4 class="modal-title blk_popup_head">Block {{blkNumb}}</h4>' + '</div>' + '<div class="modal-body modal-body-cus modal-scroll" ng-transclude style="border-radius:0px;"></div>' + '</div>' + '</div>' + '</div>'
        , replace: true
        , link: function postLink(scope, element, attrs) {
            scope.$watch(attrs.visible, function (value) {
                if (value == true) {
                    $('.left-arrow').hide();
                    $(element).modal('show');
                    setTimeout(function () {
                        var hgt = $(".modal-content").height();
                        hgt = (hgt / 2) + 'px';
                        $('.left-arrow').attr('style', 'margin-top:' + hgt);
                        $('.left-arrow').show();
                    }, 1000);
                }
                else $(element).modal('hide');
            });
        }
    , };
});