myApp.run(["$rootScope", "$q", "$state", "$http", "$window", "$location", "$timeout", "SignService",
    function ($rootScope, $q, $state, $http, $window, $location, $timeout, SignService) {
        $rootScope.URL_ID = URL_ID;
        $rootScope.cartIDs = 0;
        $rootScope.gData = {};
        $rootScope.gAction = {};
        $rootScope.styles = 'list';//搜索页显示样式默认(列表排列)
        $rootScope.headerIS = 0;//头部的切换(0为公用1为个人中心用)
        $rootScope.menuMainDown = function () {
            MenuMainDown()
        };
        $rootScope.menuMainUp = function () {
           MenuMainUp()
        };
        //底部部接口
        SignService.getHttp("/index/contentHelp").then(function (result) {
            $rootScope.contentHelp = result;
        });
        SignService.getHttp("/index/backGround").then(function (result) {
            // console.log(result);
            $rootScope.commData = result.result;
            $rootScope.favicon = result.result.favicon;
        });
        // 购物车数量显示
        SignService.shopp_cart(0).then(function (result) {
            $rootScope.cartList = result.data;
            $rootScope.cartIDs = $rootScope.cartList.length;
            $(window).scrollTop(0)
        });
        //头部购物车和个人中心
        $rootScope.accountLive = function (target) {
            SignService.getHttp("/account/live").then(function (result) {
                $rootScope.gData.messages = result.message;
                $rootScope.gData.code = result.code;
                if ($rootScope.gData.code == 201 && $rootScope.gData.messages == "离线") {
                    if (target.getAttribute('data') == "GRZX" || target.getAttribute('data') == "GWC") {
                        $rootScope.layer1("您还未登陆，请先登录!", "/login");
                    } else if (target.getAttribute('data') == "AutiLive") {
                        location.href = URL_ID + "/login";
                    }
                }else if ($rootScope.gData.code == 0 && $rootScope.gData.messages == "在线") {
                    if (target.getAttribute('data') == "GRZX" || target.getAttribute('data') == "AutiLive") {
                        location.href = URL_ID + "/my_Center/all?statu=";
                    } else if (target.getAttribute('data') == "GWC") {
                        location.href = URL_ID + "/shopping_cart";
                    }
                }
            })
        };

        //头部搜索菜单
        $rootScope.seachMenu = false;
        $rootScope.toggleseachMenu = function () {
            $rootScope.seachMenu = $rootScope.seachMenu === false ? true : false;
        };
        $http.get(Request_URL + "/category/list?nested=true")
            .then(function (result) {
                $rootScope.categoryList = result.data;
            });
        $rootScope.getChild = function (categoryID) {
            $http.get(Request_URL + "/category/list?parents=" + categoryID + "&nested=true")
                .then(function (result) {
                    $rootScope.categoryListChild = result.data;
                    $rootScope.bler = true;
                })
        };
        $rootScope.hid = function () {
            $rootScope.bler = false;
        };

        //登出接口
        $rootScope.gData.Logout = function () {
            $http({
                method: 'POST',
                url: Request_URL + "/account/logout"
            }).then(function () {
                $rootScope.layer1("You're Loginout Will to Login!", "/login");
            })
        };

        //收藏店铺
        $rootScope.favSupplier = function (id) {
            $http({
                method: 'POST',
                url: Request_URL + "/supplier/main",
                params: {supplierID: "1334003"}
            }).then(function (rs) {
                $rootScope.shouCang = rs.data;
                if ($rootScope.shouCang == 0) {
                    $rootScope.layer("Favorite Success!")
                } else {
                    $rootScope.layer("Favorite Success!")
                }
            })
        };
        $rootScope.path = "/home";
        //监听url变化
        $rootScope.$on('$locationChangeSuccess', function () {
            $rootScope.seach_value = null;
            $rootScope.brandID = '';
            $rootScope.categoryID = '';
            $rootScope.cType = '';
            $rootScope.ordercondition = '';
            $rootScope.start = '';
            $rootScope.end = '';
            $rootScope.supplierID = '';
            $rootScope.seles = "Item";//搜索框默认
            $rootScope.path = $location.path();//url path参数
            //购物车数量更新
            SignService.shopp_cart(0).then(function (result) {
                $rootScope.cartList = result.data;
                $rootScope.cartIDs = $rootScope.cartList.length;
                $(window).scrollTop(0)
            });

            //头部导航是否登录
            SignService.getHttp("/account/live").then(function (result) {
                $rootScope.gData.userData = result.authInfo.user;
                $rootScope.gData.code = result.code;
                $rootScope.gData.messages = result.message;
                if ($rootScope.gData.code == 0 && $rootScope.gData.messages == "在线") {
                    $rootScope.gData.user = "Hello，" + result.authInfo.user.userName; // 当前登录用户信息
                    $rootScope.gData.logout = true
                } else {
                    $rootScope.gData.user = "Hello,Plz Login";
                    $rootScope.gData.logout = false;
                }
            });
            //点击获取text
            $rootScope.vals = function (item) {
                $rootScope.nameva = item;
            };

            // 根据url path 判断头部
            if ($location.path() == "/my_Center" || $location.path() == "/my_Center/all" || $location.path() == "/my_Center/address" || $location.path() == "/my_Center/bindAccount" || $location.path() == "/my_Center/browHistory" || $location.path() == "/my_Center/houseGoods" || $location.path() == "/my_Center/houseShop" || $location.path() == "/my_Center/messageReminder" || $location.path() == "/my_Center/order" || $location.path() == "/my_Center/personalData" || $location.path() == "/my_Center/Receiving" || $location.path() == "/my_Center/scurity") {
                SignService.getHttp("/account/live").then(function (result) {
                    $rootScope.gData.code = result.code;
                    $rootScope.gData.messages = result.message;
                    if ($rootScope.gData.code == 0 && $rootScope.gData.messages == "在线") {
                        $rootScope.headerIS = 1;
                        $rootScope.headerH1 = "Personal Center"
                    } else {
                        location.href = URL_ID + "/login";
                        $rootScope.layer2("Login timeout!Plz Login Again!")
                    }
                })
            } else if ($location.path() == "/helpCenter") {
                $rootScope.headerIS = 1;
                $rootScope.headerH1 = "帮助中心"
            } else if ($location.path() == "/paytwo") {
                SignService.getHttp("/account/live").then(function (result) {
                    $rootScope.gData.code = result.code;
                    $rootScope.gData.messages = result.message;
                    if ($rootScope.gData.code == 0 && $rootScope.gData.messages == "在线") {
                        $rootScope.headerIS = 1;
                    } else {
                        location.href = URL_ID + "/login";
                        $rootScope.layer2("Login timeout!Plz Login Again!")
                    }
                })
            } else {
                $rootScope.headerIS = 0;
            }
            // 根据url path 判断该页面是否需要登录才能进入
            if ($location.path() == "/seach/goods") {
                $rootScope.seles = "Item";
                $rootScope.styles = $location.search().style;
                $rootScope.type1names = $location.search().type1name;
                $rootScope.type2names = $location.search().type2name;
                $rootScope.seach_value = $location.search().keyword;
                $rootScope.brandID = $location.search().brandID;
                $rootScope.categoryID = $location.search().categoryID;
                $rootScope.cType = $location.search().cType;
                $rootScope.ordercondition = $location.search().ordercondition;
                $rootScope.start = $location.search().start;
                $rootScope.end = $location.search().end;
                $rootScope.supplierID = $location.search().supplierID;
                $http.get(Request_URL + "/item/list?from=0&limit=12&keyword=" + $rootScope.seach_value + "&brandID=" + $rootScope.brandID +
                    "&categoryID=" + $rootScope.categoryID + "&cType=" + $rootScope.cType + "&ordercondition=" + $rootScope.ordercondition +
                    "&type=" + $rootScope.cType + "&start=" + $rootScope.start + "&end=" + $rootScope.end).then(function (rs) {
                    if (rs.data.code == 0) {
                        $rootScope.searhItemList = rs.data.result.itemList;
                        $rootScope.brandList = rs.data.result.brandList;
                        $rootScope.page = rs.data.result.page;
                    } else {
                        $rootScope.layer2(rs.data.errorMsg);
                    }
                })
            } else if ($location.path() == "/seach/store") {
                $rootScope.seach_value = $location.search().keyword;
                $rootScope.seles = "Shop";
                $http({
                    method: 'POST',
                    url: Request_URL + "/supplier/searchSupplier",
                    params: {supplierName: $rootScope.seach_value}
                }).then(function (rs) {
                    $rootScope.seachstore = rs.data.result.supplierList;
                    $rootScope.stroeNum = $rootScope.seachstore.length;
                });
            } else if ($location.path() == "/shopping_cart" || $location.path() == "/order_submit") {
                SignService.getHttp("/account/live").then(function (result) {
                    $rootScope.gData.code = result.code;
                    $rootScope.gData.messages = result.message;
                    if ($rootScope.gData.code != 0 || $rootScope.gData.messages != "在线") {
                        location.href = URL_ID + "/login";
                        $rootScope.layer2("Login timeout!Plz Login Again!")
                    }
                })

            }
        });
        //弹出框
        $rootScope.layer = function (mes) {//刷新页面的
            $rootScope.promptMessage = mes;
            $timeout(function () {
                $(".promptMessage").css({
                    transform: 'scale(1,1)',
                    transition: 'all 0.1s linear'
                })
            }, 100);
            $timeout(function () {
                $(".promptMessage").css({
                    transform: 'scale(0,0)',
                    transition: 'all 0.1s linear'
                });
                $timeout(function () {
                    window.location.reload();
                }, 110)
            }, 1000);
        };
        $rootScope.layer1 = function (mes, path) {//跳转页面的
            $rootScope.promptMessage = mes;
            $timeout(function () {
                $(".promptMessage").css({
                    transform: 'scale(1,1)',
                    transition: 'all 0.1s linear'
                })
            }, 100);
            $timeout(function () {
                $(".promptMessage").css({
                    transform: 'scale(0,0)',
                    transition: 'all 0.1s linear'
                });
                $timeout(function () {
                    location.href = URL_ID + path;
                }, 110)
            }, 1000);
        };
        $rootScope.layer2 = function (mes) {//只有弹出来
            $rootScope.promptMessage = mes;
            $timeout(function () {
                $(".promptMessage").css({
                    transform: 'scale(1,1)',
                    transition: 'all 0.1s linear'
                })
            }, 110);
            $timeout(function () {
                $(".promptMessage").css({
                    transform: 'scale(0,0)',
                    transition: 'all 0.1s linear'
                })
            }, 1000);
        };
        $rootScope.layer3 = function (mes) {//刷新页面的
            $rootScope.promptMessage = mes;
            $timeout(function () {
                $(".promptMessage").css({
                    transform: 'scale(1,1)',
                    transition: 'all 0.1s linear'
                })
            }, 100);
            $timeout(function () {
                $(".promptMessage").css({
                    transform: 'scale(0,0)',
                    transition: 'all 0.1s linear'
                });
                $timeout(function () {
                    window.history.back();
                }, 110)
            }, 1000);
        };
        //       $rootScope.$on('$locationChangeStart',function(){
        //     console.log('开始改变$location')
        // });
    }]);