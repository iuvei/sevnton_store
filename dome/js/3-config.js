<<<<<<< .mine
myApp.config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
	
||||||| .r284
myApp.config(function ($stateProvider, $urlRouterProvider) {
	
=======
myApp.config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
    // // Initialize get if not there
    // if (!$httpProvider.defaults.headers.get) {
    //     $httpProvider.defaults.headers.get = {};
    // }
    // // Enables Request.IsAjaxRequest() in ASP.NET MVC
    // $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    // //禁用IE对ajax的缓存
    // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    // $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
>>>>>>> .r825
//if (!$httpProvider.defaults.headers.get) {
//      $httpProvider.defaults.headers.get = {};
//  }
//  // Enables Request.IsAjaxRequest() in ASP.NET MVC
//  $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
//  //禁用IE对ajax的缓存
//  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
//  $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
     $urlRouterProvider.when("", "/home");

<<<<<<< .mine
     $stateProvider
||||||| .r284
     $urlRouterProvider.when("", "/pay2");

     $stateProvider
=======
    $urlRouterProvider.when("", "/home");
    $stateProvider
>>>>>>> .r825
        .state("home", {
            url: "/home",
            controller: "home",
            reload: true,
            templateUrl: "views/home.html",
        })
        .state("login", {
            url: "/login",
            controller: "login",
            reload: true,
            templateUrl: "views/login.html",
        })
        .state("register", {
            url: "/register",
            controller: "register",
            reload: true,
            templateUrl: "views/register.html",
        })
        .state("xiangqing", {
            url: "/xiangqing",
            controller: "xiangqing",
            reload: true,
            templateUrl: "views/xiangqing.html",
        })
        .state("seach", {
            url: "/seach",
            controller: "seach",
            reload: true,
            templateUrl: "views/seach.html",
        })
        .state("seach.store", {//搜索店鋪
            url: "/store",
            reload: true,
            templateUrl: "views/seach_store.html",
            // controller: "seach"
        })
        .state("seach.goods", {//待收货
            url: "/goods",
            reload: true,
            templateUrl: "views/seach_goods.html",
            // controller: "seach"
        })
        .state("shopping_cart", {
            url: "/shopping_cart",
            controller: "shopping_cart",
            reload: true,
            templateUrl: "views/shopping_cart.html",
        })
        .state("order_submit", {
            url: "/order_submit",
            controller: "order_submit",
            reload: true,
            templateUrl: "views/order_submit.html",
        })
        .state("froget_pwd", {
            url: "/froget_pwd",
            controller: "froget_pwd",
            reload: true,
            templateUrl: "views/froget_pwd.html",
        })
        .state("information", {
            url: "/information",
            controller: "information",
            reload: true,
            templateUrl: "views/information.html",
        })
        .state("my_Center", {//个人中心
            url: "/my_Center",
            controller: "my_Center",
            reload: true,
            templateUrl: "views/my_Center.html",
        })
        .state("my_Center.all", {//个人中心首页
            url: "/all",
            reload: true,
            templateUrl: "views/my_center-all.html",
            controller: "my_center-all"
        })
        .state("my_Center.address", {// 收货地址
            url: "/address",
            reload: true,
            templateUrl: "views/my_center-address.html",
            controller: "my_center-address"
        })
        .state("my_Center.bindAccount", {//账号绑定
            url: "/bindAccount",
            reload: true,
            templateUrl: "views/my_center-bindAccount.html",
            controller: "my_center-bindAccount"
        })
        .state("my_Center.browHistory", {//浏览历史
            url: "/browHistory",
            reload: true,
            templateUrl: "views/my_center-browHistory.html",
            controller: "my_center-browHistory"
        })
        .state("my_Center.houseGoods", {//收藏商品
            url: "/houseGoods",
            reload: true,
            templateUrl: "views/house_Goods.html",
            controller: "my_center-houseGoods"
        })
        .state("my_Center.houseShop", {//收藏店铺
            url: "/houseShop",
            reload: true,
            templateUrl: "views/my_center-houseShop.html",
            controller: "my_center-houseShop"
        })
        .state("my_Center.messageReminder", {//消息提醒
            url: "/messageReminder",
            reload: true,
            templateUrl: "views/my_center-messageReminder.html",
            controller: "my_center-messageReminder"
        })
        .state("my_Center.order", {//订单中心
            url: "/order",
            reload: true,
            templateUrl: "views/my_center-order.html",
            controller: "my_center-order"
        })
        .state("my_Center.personalData", {//个人资料
            url: "/personalData",
            reload: true,
            templateUrl: "views/my_center-personalData.html",
            controller: "my_center-personalData"
        })
        .state("my_Center.Receiving", {//待收货
            url: "/Receiving",
            reload: true,
            templateUrl: "staticPage/my_center-Receiving.html",
            controller: "my_center-Receiving"
        })
        .state("my_Center.scurity", {//安全设置
            url: "/scurity",
            reload: true,
            templateUrl: "views/my_center-scurity.html",
            controller: "my_center-scurity"
        })
        .state("classify", {
            url: "/classify",
            controller: "classify",
            reload: true,
            templateUrl: "views/classify.html",
        })
        .state("paytwo", {
            url: "/paytwo",
            controller: "paytwo",
            reload: true,
            templateUrl: "views/paytwo.html",
        })
        .state("paythree", {
            url: "/paythree",
            controller: "paythree",
            reload: true,
            templateUrl: "views/paythree.html",
        })
        .state("AliPay", {
            url: "/AliPay",
            controller: "AliPay",
            reload: true,
            params: {AliPay: null},
            templateUrl: "views/AliPay.html",
        })
        .state("supplier", {
            url: "/supplier",
            controller: "supplier",
            reload: true,
            templateUrl: "views/supplier.html",
        })
        .state("helpCenter", {
            url: "/helpCenter",
            controller: "helpCenter",
            reload: true,
            templateUrl: "views/helpCenter.html",
        })
});