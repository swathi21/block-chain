'use strict';
/**
 * @ngdoc function
 * @description
 * # DashboardCtrl
 */

app.controller('dashboardCtrl', ['DashboardService', 'UserLoginService', '$scope', '$cookieStore', '$state', '$rootScope', '$filter', 'ShowBlockService', '$q', 'orderByFilter','DashboardDetailsService', function (DashboardService, UserLoginService, $scope, $cookieStore, $state, $rootScope, $filter, ShowBlockService, $q, orderBy,DashboardDetailsService) {
    $scope.successMsg = 'start';
    $("body").removeClass("login_body");
    $scope.dashboardResult = [];
    $scope.logout = function () {
        $cookieStore.remove('loginTempData');
        window.history.forward(-1);
        $state.go('login');
    }
    $scope.clrs=[];
    $scope.clrs[0] = 'yellow-block';$scope.clrs[1] = 'orange-block';$scope.clrs[2] = 'orange-block';$scope.clrs[3] = 'orange-block';
    $scope.currentStatus = function () {
        $scope.displayLoading = true;
        DashboardService.getDashboardDetails().then(function (response) {
            var count = 0;
            var records = response.data.queryresult;
            
            $scope.propertyName = 'creation_date';
            $scope.reverse = true;
            records = orderBy(records, $scope.propertyName, $scope.reverse);
            var recordsLength = response.data.queryresult.length;
            var itemMod = recordsLength % 3;
            var itemCnt = parseInt(recordsLength / 3);
            itemCnt = (itemMod > 0) ? itemCnt + 1 : itemCnt;
            for (var i = 0; i < itemCnt; i++) {
                var array = [];
                for (var j = 0; j < 3; j++) {
                    if (records[count] != undefined) {
                        array.push(records[count]);
                        count++;
                    }
                    else {
                        break;
                    }
                }
                $scope.dashboardResult[i] = array;

            }
            //$scope.displayLoading = false;
        }, function (error) {
            console.log("Error while fetching block data: " + error);
            $scope.displayLoading = false;
        });
    }
    $scope.currentStatus();
    
    $(document).ready(function () {
        var margin = 0;
        $('.triggerSlide').on('click', function () {
            var amountDivs = $('.contentDiv').length;
            var whereTo = $(this).attr('id');
            whereTo == 'left' ? margin += 800 : margin -= 800;
            if (parseInt(margin) > 0) {
                margin = 0
                return false;
            }
            else if (margin <= -Math.abs(amountDivs * 800)) {
                margin = -Math.abs((parseInt(amountDivs) - 1) * 800);
                return false;
            }
            $('#slider').animate({
                marginLeft: margin
            });
        });
    });
    $scope.blockChain = function (oid) {
        $scope.chainResult = [];
        $scope.dashboardChainResult = [];
        $scope.displayLoading = true;
        ShowBlockService.getCurrentStatus().then(function (response) {
            var n = response.data.height;
            $scope.height = n;
            for (var i = n - 1; i > 0; i--) {
                $scope.chainResult.push(i);
            }
            var chcount = 0;
            var chrecords = $scope.chainResult;
            var chrecordsLength = chrecords.length;
            var chitemMod = chrecordsLength % 10;
            var chitemCnt = parseInt(chrecordsLength / 10);
            chitemCnt = (chitemMod > 0) ? chitemCnt + 1 : chitemCnt;
            for (var i = 0; i < chitemCnt; i++) {
                var charray = [];
                for (var j = 0; j < 10; j++) {
                    if (chrecords[chcount] != undefined) {
                        charray.push(chrecords[chcount]);
                        chcount++;
                    }
                    else {
                        break;
                    }
                }
                $scope.dashboardChainResult[i] = charray;
            }
            //$scope.displayLoading = false;
            var lgt=$scope.dashboardChainResult.length;
            $("#slider").width(lgt*800);
        }, function (error) {
            console.log("Error while fetching block data: " + error);
            $scope.displayLoading = false;
        });
    }
    $scope.blockChain();
    $scope.chainDetailsFun = function (num) {
        DashboardService.getChainDetails(num).then(function (response) {
            $scope.toolTipDetails = response.data;
        }, function (error) {
            console.log("Error while fetching block data: " + error);
            $scope.displayLoading = false;
        });
    }
    $scope.mouseOut = function (oid) {
        $scope.toolTipDetails = [];
    }
    $scope.startFun = function () {
        var datCnt = parseInt(localStorage.getItem('fileData')) + 1 ;
        console.log(datCnt);
        if(datCnt>56){
            datCnt=0; 
        }
        localStorage.setItem('fileData', datCnt);
        $scope.displayLoadingProgress = true;
        var file = '/scripts/JSON_Data/jsonData_' + datCnt + '.json';
       
        DashboardService.readJson(file).then(function (jsonData) {
            $scope.details = jsonData.data.invokeinput;
            $scope.makeNextRequest($scope.details, 0);
        }, function (error) {
            console.log("Error while inserting block data: " + error);
        });
    }
    $scope.makeNextRequest = function (inputArray, count) {
        $scope.loadMsg = 0;
        var per=parseInt(100/inputArray.length);
        if (count < inputArray.length) {
            DashboardService.insertBlockData(JSON.stringify(inputArray[count])).then(function (insertResponse) {
                $scope.makeNextRequest(inputArray, ++count);
                $scope.loadMsg = count * per;
                if ($scope.loadMsg > 100) {
                    $scope.loadMsg = 100;
                }
                $scope.currentStatus();
                $scope.blockChain();
            }, function (error) {
                console.log("Error while inserting block data: " + error);
            });
        }
        else {
            $scope.displayLoadingProgress = false;
            $scope.blockLength();
//            Commented by Umesh
//            $scope.successMsg = "File " + $scope.common + " inserted successfully";
            return true
        }
    }
    
    $scope.blkNum={};
    $scope.blockLength = function () {
        ShowBlockService.getCurrentStatus().then(function (response) {
            $scope.displayLoading = true;
            var n = response.data.height;
            $scope.height = n;
            DashboardService.getChainDetails(n-1).then(function (response) {
                var input=response.data.payload;
                var fields = input.split(',');
                var coid=fields[2];
                if(!$scope.blkNum[coid])
                    $scope.blkNum[coid]=[];  
                $scope.blkNum[coid].push(n-1);
                $scope.nextBlockDetails($scope.blkNum, n-2); 
            }, function (error) {
                console.log("Error while fetching block data: " + error);
                $scope.displayLoading = false;
            });
        }, function (error) {
            console.log("Error while fetching block data: " + error);
            $scope.displayLoading = false;
        });
    }
    
    $scope.nextBlockDetails = function (inputArray,count) {
        if (count > 0) {
            DashboardService.getChainDetails(count).then(function (insertResponse) {
               var input=insertResponse.data.payload;
                var fields = input.split(',');
                var coid=fields[2]; 
                        if(!inputArray[coid])
                        inputArray[coid]=[];
                    inputArray[coid].push(count);
                $scope.nextBlockDetails(inputArray, --count);
                
            }, function (error) {
                console.log("Error while inserting block data: " + error);
            });
        }
        else {
            $scope.blnum=[];
            $scope.blnum=inputArray;
            inputArray=[];
            $scope.displayLoading = false;
            return true
        }
    }
    $scope.blockLength();
 }]);