myApp.controller("shopping_cart", ["$rootScope", "$scope", "$state", "$timeout", "$http", '$filter', "$interval", "SignService",
    function ($rootScope, $scope, $state, $timeout, $http, $filter, $interval, SignService) {
        $scope.nums = 0;
        //查询购物车
        SignService.shopp_cart(0).then(function (result) {
            $scope.cartList = result.data;
            $scope.cartList.forEach(function (value, index) {
                value.check = 'flase';
                value.price = '';
            });
            $scope.nums = $scope.cartList.length;
            $(window).scroll(function () {
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
                var windowHeight = $(this).height() + 590;
                if (scrollTop + windowHeight > scrollHeight) {
                    $('.all_cartPric').addClass('all_cartpric');
                } else {
                    $('.all_cartPric').removeClass('all_cartpric');
                }
            });
        })
        //修改商品
        $scope.update = function () {
            $scope.shoppId = this.cartMesiz.shoppingCartID;
            $scope.skuAcount = this.cartMesiz.skuAcount;
            SignService.getHttp("/account/live").then(function (result) {
                $scope.code = result.code;
                $scope.messages = result.message;
                if ($scope.code == 0 && $scope.messages == "在线") {
                    $http({
                        method: 'POST',
                        url: Request_URL + "/cart/update",
                        params: {
                            cartID: $scope.shoppId,
                            num: $scope.skuAcount
                        }
                    })
                } else {
                    $rootScope.layer1("登陆超时!，请登陆!","/login");
                }
            })
        }
        //总价格的计算
        $scope.allPrices = function () {
            $scope.allprice = 0;
            $scope.nums = 0;
            $scope.SkuID = [];
            angular.forEach($scope.cartList, function (data, index, array) {
                $scope.nums += 1;
                data.price = parseFloat((data.skuAcount * data.salesPrice).toFixed(2));
                $scope.id = parseInt(data.shoppingCartID)
                if (data.check == true) {
                    $scope.SkuID.push($scope.id)
                    $scope.allprice += data.price;
                    $scope.allprice = parseFloat($scope.allprice.toFixed((2)))
                }
            })
            return $scope.allprice;
        };
        // $scope.n = "13498";
        // $filter('urlFilter')($scope.n);
        //删除购物车商品
        $scope.delete = function () {
            $scope.shoppId = this.cartMesiz.shoppingCartID
            SignService.getHttp("/account/live").then(function (result) {
                $scope.code = result.code;
                $scope.messages = result.message;
                if ($scope.code == 0 && $scope.messages == "在线") {
                    $.mbox({
                        area: ["250px", "auto"], //弹框大小
                        border: [0, .5, "#666"],
                        dialog: {
                            msg: "Are you sure you want to delete this item",
                            btns: 2,   //1: 只有一个按钮   2：两个按钮  3：没有按钮 提示框
                            type: 3,   //1:对钩   2：问号  3：叹号
                            btn: ["Sure", "Cancel"],  //自定义按钮
                            yes: function () {  //点击左侧按钮：成功
                                $http({
                                    method: 'POST',
                                    url: Request_URL + "/cart/delete",
                                    params: {
                                        cartIDs: $scope.shoppId,
                                    }
                                }).then(function () {
                                    SignService.shopp_cart(0).then(function (result) {
                                        $scope.cartList = result.data;
                                        $scope.cartList.forEach(function (value, index) {
                                            value.check = 'flase';
                                            value.price = '';
                                        });
                                        $scope.nums = $scope.cartList.length;
                                    })
                                })
                            },
                            no: function () { //点击右侧按钮：失败
                                return false;
                            }
                        }
                    });
                } else {
                    $rootScope.layer1("登陆超时!，请登陆!","/login");
                }
            })

        }
        $scope.deletes = function () {
            var cartIDs = '';
            if ($scope.SkuID.length >= 1) {
                for (var i = 0; i < $scope.SkuID.length; i++) {
                    if (i < $scope.SkuID.length - 1) {
                        cartIDs += $scope.SkuID[i] + ",";
                    } else {
                        cartIDs += $scope.SkuID[i];
                    }
                }
                $scope.cartid = cartIDs;
                SignService.getHttp("/account/live").then(function (result) {
                    $scope.code = result.code;
                    $scope.messages = result.message;
                    if ($scope.code == 0 && $scope.messages == "在线") {
                        $.mbox({
                            area: ["250px", "auto"], //弹框大小
                            border: [0, .5, "#666"],
                            dialog: {
                                msg: "Are you sure you want to delete this item",
                                btns: 2,   //1: 只有一个按钮   2：两个按钮  3：没有按钮 提示框
                                type: 3,   //1:对钩   2：问号  3：叹号
                                btn: ["Sure", "Cancel"],  //自定义按钮
                                yes: function () {  //点击左侧按钮：成功
                                    $http({
                                        method: 'POST',
                                        url: Request_URL + "/cart/delete",
                                        params: {
                                            cartIDs: $scope.cartid,
                                        }
                                    }).then(function () {
                                        SignService.shopp_cart(0).then(function (result) {
                                            $scope.cartList = result.data;
                                            $scope.cartList.forEach(function (value, index) {
                                                value.check = 'flase';
                                                value.price = '';
                                            });
                                            $scope.nums = $scope.cartList.length;
                                        })
                                    })
                                },
                                no: function () { //点击右侧按钮：失败
                                    return false;
                                }
                            }
                        });
                    } else {
                        $rootScope.layer1("登陆超时!，请登陆!","/login");
                    }
                })
            } else {
                $rootScope.layer2("您还没有选择商品!")
            }

        }
        //猜你喜欢
        $http.get(Request_URL + "/item/recommend").then(function (result) {
            $scope.recommends = result.data;
        }).catch(function (result) { //捕捉错误处理
            console.info(result);
        });
        //去结算
        $scope.clic_skuid = function () {
            var cartID = '';
            if ($scope.SkuID.length >= 1) {
                SignService.getHttp("/account/live").then(function (result) {
                    $scope.code = result.code;
                    $scope.messages = result.message;
                    if ($scope.code == 0 && $scope.messages == "在线") {
                        for (var i = 0; i < $scope.SkuID.length; i++) {
                            if (i < $scope.SkuID.length - 1) {
                                cartID += $scope.SkuID[i] + ",";
                            } else {
                                cartID += $scope.SkuID[i];
                            }
                        }
                        $scope.cartid = cartID
                        location.href = URL_ID + "/order_submit?cartIDs=" + $scope.cartid;
                    } else {
                        $rootScope.layer1("登陆超时!，请登陆!","/login");
                    }
                })
            } else {
                $rootScope.layer2("您还没有选择商品!");
            }
        }
        //按单价排序
        $scope.CartSort = function (arg) {
            angular.forEach($scope.cartList, function (data, index, array) {
                arguments.callee['CartSort(' + arg + ')'] = !arguments.callee['CartSort(' + arg + ')']
                $scope.cartList = $filter('orderBy')($scope.cartList, arg, arguments.callee['CartSort(' + arg + ')'])
            })

        }
        $scope.last = function () {
            last();
        };
        $scope.next = function () {
            next();
        };
        $scope.timer = $interval(next, 2000);
        //离开页面清除定时器
        $scope.$on('$destroy', function () {
            $interval.cancel($scope.timer);
        })
        $scope.offInterval = function () {
            $interval.cancel($scope.timer);
        }
        $scope.onInterval = function () {
            $scope.timer = $interval(next, 2000);
        }
        var index = 0; //记录下标
        function next() {
            index++;
            if (index > $(".shopping_sect_ul li").length - 4) {
                index = 0;
            }
            $('.shopping_sect_ul').animate({left: -index * 300}, "linear");
        }

        function last() {
            index--;
            if (index < 0) {
                index = $(".shopping_sect_ul li").length - 4;
            }
            $('.shopping_sect_ul').animate({left: -index * 300}, "linear");
        }

    }]);
