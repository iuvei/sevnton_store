/**
 * Created by Administrator on 2017/3/16.资讯
 */
myApp.controller('information', function ($rootScope, $scope, $http, $state, $timeout) {
    //初始化page
    $scope.page = {
        pageNo: 1,
        pageSize: 15,
        totalCount: 0,
        pageCount: 0
    };
    $http.get(Request_URL + "/index/contentConsult?from=0&limit=4").then(function (result) {
        $scope.contentConsults = result.data.result.contentConsults;
        $scope.page = result.data.result.page;
    }).catch(function (result) { //捕捉错误处理
    });
    //获取查询结果
    function getList() {
        $http.get(Request_URL + "/index/contentConsult?from=" + ($scope.page.pageNo - 1) * $scope.page.pageSize + "&limit=" + $scope.page.pageSize).then(function (rs) {
            if (rs.data.code == 0) {
                $scope.contentConsults = result.data.result.contentConsults;
                $scope.page = result.data.result.page;
            } else {
                alert(rs.result.errorMsg);
            }
        }).catch(function (rs) { //捕捉错误处理

        });
    }

    $scope.previous = function () {
        if ($scope.page.totalCount > 0 && $scope.page.pageNo > 1) {
            $scope.page.pageNo -= 1;
            getList();
        }
    };
    $scope.next = function () {
        if ($scope.page.totalCount > 0
            && $scope.page.pageNo < $scope.page.pageCount) {
            $scope.page.pageNo += 1;
            getList();
        }
    };
    $scope.first = function () {
        if ($scope.page.totalCount > 0 && $scope.page.pageNo > 1) {
            $scope.page.pageNo = 1;
            getList();
        }
    };
    $scope.last = function () {
        if ($scope.page.totalCount > 0
            && $scope.page.pageNo < $scope.page.pageCount) {
            $scope.page.pageNo = $scope.page.pageCount;
            getList();
        }
    };
})