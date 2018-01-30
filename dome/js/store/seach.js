myApp.controller('seach', function ($rootScope, $scope, $http, $location, $window, $filter, SignService) {
    $http.get(Request_URL + "/category/list?nested=true")
        .then(function (result) {
            $scope.categoryList = result.data;
            $scope.childcategoryList = result.data.categories;
            for (var i = 0; i < $scope.categoryList.length; i++) {
                $scope.categoryName1 = [];
                for (var j = 0; j < $scope.categoryList[i].categories.length; j++) {
                    var word = $scope.categoryList[i].categories[j].categoryName
                }
            }
        }).catch(function (result) { //捕捉错误处理
        console.info(result);
    });
    $scope.thisid = 0;
    $scope.getChild = function (categoryID) {
        $http.get(Request_URL + "/category/list?parents=" + categoryID + "&nested=true")
            .then(function (result) {
                $scope.thisid = categoryID;
                $scope.categoryListChild = result.data;
            }).catch(function (result) { //捕捉错误处理
            console.info(result);
        });
    }
    $scope.closeChild = function () {
        $scope.thisid = 0;
    }
    //店铺搜索页的店铺商品按钮事件
    $scope.numss = 0;
    $scope.li2zuo = function () {
        $scope.numss--;
        if ($scope.numss < 0) {
            $scope.numss = 0;
        }
    }
    $scope.li2you = function () {
        $scope.numss++;
        if ($scope.numss > Math.ceil(this.supplier.itemList.length / 3) - 1) {
            $scope.numss = Math.ceil(this.supplier.itemList.length / 3) - 1;
        }
    }
    //销量升降
    $scope.bol = true;
    $scope.Sales = function () {
        $scope.bol = $scope.bol === false ? true: false;
        if ($scope.bol){
            $rootScope.searhItemList = $filter('orderBy')($rootScope.searhItemList,"totalSales");
        }else {
            $rootScope.searhItemList = $filter('orderBy')($rootScope.searhItemList,"-totalSales");
        }
    }
    //价格升降
    $scope.bol1 = true;
    $scope.price = function () {
        $scope.bol1 = $scope.bol1 === false ? true: false;
        if ($scope.bol1){
            $rootScope.searhItemList = $filter('orderBy')($rootScope.searhItemList,"marketPrice","salesPrice");
        }else {
            $rootScope.searhItemList = $filter('orderBy')($rootScope.searhItemList,"-marketPrice","-salesPrice");
        }
    }
    //搜索页右侧推荐
    $http.get(Request_URL + "/item/hot?from=0&limit=4")
        .then(function (result) {
            $scope.itemList = result.data;
        }).catch(function (result) { //捕捉错误处理
        console.info(result);
    });
    //搜索店铺
    //条件搜索内容
    $rootScope.page = {
        pageNo: 1,
        pageSize: 12,
        totalCount: 0,
        pageCount: 0
    };
//获取查询结果
    function getList() {
        if ($location.path() == "/seach/goods") {
            $http.get(Request_URL + "/item/list?from=" + ($rootScope.page.pageNo - 1) * $rootScope.page.pageSize + "&limit=" + $rootScope.page.pageSize + "&keyword=" + $location.search().keyword + "&cType=" + $location.search().cType + "&categoryID=" + $location.search().categoryID).then(function (rs) {
                if (rs.data.code == 0) {
                    $rootScope.searhItemList = rs.data.result.itemList;
                    $rootScope.page = rs.data.result.page;
                } else {
                    alert(rs.data.errorMsg);
                }
            }).catch(function (rs) { //捕捉错误处理

            });
        } else if ($location.path() == "/seach/store") {
            $http({
                method: 'POST',
                url: Request_URL + "/supplier/searchSupplier",
                params: {supplierName: "null"}
            }).then(function (rs) {
                $rootScope.seachstore = rs.data.result.supplierList;
                $rootScope.page = rs.data.result.page;
                console.log($rootScope.seachstore)
            });
        }

    }

    $rootScope.previous = function () {
        if ($rootScope.page.totalCount > 0 && $rootScope.page.pageNo > 1) {
            $rootScope.page.pageNo -= 1;
            getList();
        }
    };
    $rootScope.next = function () {
        if ($rootScope.page.totalCount > 0
            && $rootScope.page.pageNo < $rootScope.page.pageCount) {
            $rootScope.page.pageNo += 1;
            getList();
        }
    };
    $rootScope.first = function () {
        if ($rootScope.page.totalCount > 0 && $rootScope.page.pageNo > 1) {
            $rootScope.page.pageNo = 1;
            getList();
        }
    };
    $rootScope.last = function () {
        if ($rootScope.page.totalCount > 0
            && $rootScope.page.pageNo < $rootScope.page.pageCount) {
            $rootScope.page.pageNo = $rootScope.page.pageCount;
            getList();
        }
    };
    $rootScope.addFav = function (itemID) {
        $http.get(Request_URL + "/item/addFavourite?itemId=" + itemID).then(function (rs) {
            if (rs.data.code == 0) {
                $rootScope.layer2("Favorite Success!")
            } else {
                $rootScope.layer2("Favorite Over!")
            }
        }).catch(function (rs) { //捕捉错误处理
            console.log()

        });
    }
})