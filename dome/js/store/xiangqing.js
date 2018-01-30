myApp.controller("xiangqing", function ($rootScope, $scope, $http, $location, $timeout, $interval, SignService) {
    $scope.URL = $location.absUrl();
    $scope.itemID = $location.search().itemID;
    $scope.skuName = '';
    $scope.jiti = function (a, b) {
        if (b == '') {
            $scope.skuName = a;
            $scope.skuNames = a+" ";
        } else if (a == '') {
            $scope.skuName = b;
        } else {
            $scope.skuName = a + " " + b;
        }
    }
    //最低价格集
    $scope.minPrice = [];
    //最高价格集
    $scope.maxPrice = [];
    $scope.bubbleSort = function (array) {
        var i = 0, len = array.length, j, d;
        for (var i = 0; i < len; i++) {
            for (j = 0; j < len; j++) {
                if (array[i] < array[j]) {
                    d = array[j];
                    array[j] = array[i];
                    array[i] = d;
                }
            }
        }
        return array;
    }
    //商品详情
    $scope.values1 = '';
    //Request_URL + '/item/' + $scope.itemID + '/detail'
    SignService.getHttp('/item/' + $scope.itemID + '/detail')
        .then(function (result) {
            $scope.Detail = result;
            $scope.description = result.itemDetail;
            $scope.skulist = result.skuList;
            console.log($scope.skulist)
            $scope.Value = result.skuPropValue;
            if ($scope.Value == null) {
                $scope.values = '';
            } else {
                if ($scope.Value.indexOf(";") != -1) {
                    $scope.values = $scope.Value.split(";")[0];
                    $scope.values1 = $scope.Value.split(";")[1];
                } else {
                    $scope.values = $scope.Value;
                }
            }
            angular.forEach($scope.skulist, function (data, index, array) {
                $scope.minPrice.push(data.marketPrice);
                $scope.maxPrice.push(data.salesPrice)

            })
            $scope.bubbleSort($scope.maxPrice)
            $scope.bubbleSort($scope.minPrice)
            $scope.sigleMinPrice = $scope.minPrice[0];
            $scope.sigleMaxPrice = $scope.maxPrice[$scope.maxPrice.length - 1];
        })
    //详情页右侧推荐
    $http.get(Request_URL + "/item/hot?from=0&limit=4")
        .then(function (result) {
            $scope.itemList = result.data;
        })
//详情页底部推荐
    $http.get(Request_URL + "/item/recommend")
        .then(function (result) {
            $scope.recommends = result.data;
        })
    //判断是否选规格
    $scope.skJudeg = function () {
        $rootScope.layer2("请选择商品规格!")
    }
    //判断是否登录
    $scope.PanDuanDL = function () {
        SignService.getHttp("/account/live").then(function (result) {
            $scope.messagess = result.message;
            $scope.codes = result.code;
            if ($scope.codes == 201 && $scope.messagess == "离线") {
                $scope.code = 201;
            } else {
                $scope.code = 0;
            }
        })
    }
    $scope.PanDuanDLtan = function () {
        $rootScope.layer2("您还未登陆,请先登陆!")
    }
    //添加购物车
    $scope.add_shopCart = function (id) {
        SignService.getHttp("/account/live").then(function (result) {
            $scope.messagess = result.message;
            $scope.codes = result.code;
            if ($scope.codes == 201 && $scope.messagess == "离线") {
                $rootScope.layer1("您还未登陆,请先登陆!", "/login")
            } else {
                $http({
                    method: 'POST',
                    url: Request_URL + "/cart/add",
                    params: {
                        skus: id,
                        num: $scope.text
                    }
                }).then(function (rs) {
                    var codes = rs.data.code;
                    if (codes == 0) {
                        $rootScope.layer2(rs.data.result)
                        SignService.shopp_cart(0).then(function (result) {
                            $rootScope.cartList = result.data;
                            $rootScope.cartIDs = $rootScope.cartList.length;
                        })
                    }
                    if (codes == 99999) {
                        $rootScope.layer2(rs.data.result)
                    }

                })
            }
        })
    }
    // 立即购买
    $scope.once_Buy = function (id) {
        SignService.getHttp("/account/live").then(function (result) {
            $scope.messagess = result.message;
            $scope.codes = result.code;
            if ($scope.codes == 201 && $scope.messagess == "离线") {
                $rootScope.layer1("您还未登陆,请先登陆!", "/login")
            } else {
                location.href = URL_ID + "/order_submit?itemid=" + $scope.itemID + "&skuid=" + id + "&num=" + $scope.text;
            }
        })
    }
    $scope.tantizhi = function () {
        $rootScope.layer2("库存不足!")
    }
    // 数量按钮
    $scope.text = 1;
    $scope.add = function () {
        $scope.text += 1;
    };
    $scope.DS = false;
    $scope.subtract = function () {
        if ($scope.text <= 1) {
            $scope.text = 1;
            $scope.DS = true;
        } else if ($scope.text > 1) {
            $scope.text -= 1;
            $scope.DS = false;
        }
    }
    $scope.judge = function (num) {
        if (num < 1) {
            num = 1;
        }
    }

    var index = 0; //记录下标

    $scope.next = function () {
        next()
    };
    $scope.last = function () {
        last()
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
    function next() {
        index++;
        if (index > $(".sect_ul li").length - 5) {
            index = 0;
        }
        $('.sect_ul').animate({left: -index * 220}, "linear");
    }

    function last() {
        index--;
        if (index < 0) {
            index = $(".sect_ul li").length - 5;
        }
        $('.sect_ul').animate({left: -index * 220}, "linear");
    }

    var manyPictures = document.getElementById('manyPictures');
    var imgs = manyPictures.getElementsByClassName('imgs');//获取到底部6张小图片
    var small = document.getElementById('small');
    var big = document.getElementById('big');
    var areaDiv = document.getElementById('area');
    var smallImg = document.getElementById('smallimg');
    var bigImg = document.getElementById('bigimg');
    var conD = document.getElementById('con_drawing');
    var storeName = document.getElementById('hailanHome');
    $scope.tan = function (pic) {
        $('#smallimg').attr("src", pic);
        $('#bigimg').attr("src", pic);
    }
    //为大图添加鼠标移入事件
    small.onmouseenter = function () {
        areaDiv.style.display = 'block';
        big.style.display = 'block';
    }
    //鼠标移出事件
    small.onmouseleave = function () {
        areaDiv.style.display = 'none';
        big.style.display = 'none';
    }

    var content = document.getElementById("content");
    var con = document.getElementById('con_wrap');
    var con_drawing = document.getElementById("con_drawing");
    //添加鼠标移动事件
    small.onmousemove = function (e) {

        var event1 = window.event || e;

        var mouseX = event1.clientX - $("#small").offset().left - $("#area").width() / 2;
        var mouseY = event1.clientY - $("#small").offset().top + $(document).scrollTop() - $("#area").height() / 2;

        var maxX = small.offsetWidth - areaDiv.offsetWidth;
        var maxY = small.offsetHeight - areaDiv.offsetHeight;
        if (mouseX < 0) {
            mouseX = 0;
        }
        if (mouseX > maxX) {
            mouseX = maxX;
        }
        if (mouseY < 0) {
            mouseY = 0;
        }
        if (mouseY > maxY) {
            mouseY = maxY;
        }
        //修改areaDiv的位置,随鼠标移动
        areaDiv.style.left = mouseX + 'px';
        areaDiv.style.top = mouseY + 'px';
        //修改大图的移动
        big.scrollLeft = (bigImg.offsetWidth - big.clientWidth) * mouseX / maxX;
        big.scrollTop = (bigImg.offsetHeight - big.clientHeight) * mouseY / maxY;
    }
})