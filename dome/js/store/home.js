myApp.controller("home", ["$rootScope", "$q", "$scope", "$http", "SignService", "$interval", function ($rootScope, $q, $scope, $http, SignService, $interval) {
    $scope.SkuID_data = [];
    $http.get(Request_URL + "/index/main")
        .then(function (result) {
            $scope.banners = result.data;
        })
    $http.get(Request_URL + "/item/hot?from=0&limit=20")
        .then(function (result) {
            $scope.itemList = result.data;
        })
    $http.get(Request_URL + "/item/recommend")
        .then(function (result) {
            $scope.recommends = result.data;
        })
    $http.get(Request_URL + "/index/partnerList?from=0&limit=4")
        .then(function (result) {
            $scope.partnerList = result.data;
        })
//首页交易记录
    $http.get(Request_URL + "/trade/list?from=0&limit=5")
        .then(function (result) {
            $scope.tradeList = result.data.result.tradeList;
        })
    $http.get(Request_URL + "/category/list?nested=true")
        .then(function (result) {
            $scope.categoryList = result.data;
        })
    $scope.getChild = function (categoryID,categoryName) {
        $http.get(Request_URL + "/category/list?parents=" + categoryID + "&nested=true")
            .then(function (result) {
                $scope.categoryListChild = result.data;
                $scope.cateName = categoryName;
                $scope.bler = true;
            })
    }
    $scope.hid = function () {
        $scope.bler = false;
    }
    $http.get(Request_URL + "/index/contentConsult?from=0&limit=4")
        .then(function (result) {
            $scope.contentConsults = result.data.result.contentConsults;
        })
    $scope.last = function () {
        last ();
    };
    $scope.next = function () {
        next ();
    };
    $scope.timer = $interval(next,2000);
    //离开页面清除定时器
    $scope.$on('$destroy',function(){
        $interval.cancel($scope.timer);
    })
    $scope.offInterval = function () {
        $interval.cancel($scope.timer);
    }
    $scope.onInterval = function () {
        $scope.timer = $interval(next,2000);
    }
    var index = 0; //记录下标
    function next () {
        index++;
        if (index > $(".sect_ul li").length - 5) {
            index = 0;
        }
        $('.sect_ul').animate({left: -index * 220},"linear");
    }
    function last () {
        index--;
        if (index < 0) {
            index = $(".sect_ul li").length - 5;
        }
        $('.sect_ul').animate({left: -index * 220},"linear");
    }
    $('.carousel').carousel({
        interval: 5000
    })
}]);