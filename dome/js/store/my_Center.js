/**
 * Created by Administrator on 2017/3/16.个人中心
 */
myApp.controller('my_Center', function ($rootScope, $scope, $http, $state, $timeout, $location) {
    $scope.urlPath = function () {
        $scope.urlpath = $location.path();
        return console.log($scope.urlpath);
    }
    $state.go(".all?statu=")
    $http.get(Request_URL + "/trade/list?from=0&limit=5")
        .then(function (result) {
            $scope.tradeList = result.data;
        }).catch(function (result) { //捕捉错误处理
    });
})