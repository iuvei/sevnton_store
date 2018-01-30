/**
 * 自定义标签和事件(directive)
 */
// 加 (购物车)
myApp.directive('myAdds', function () {
    return {
        link: function (scope, element, attr) {
            element.click(function () {
                var This = this;
                angular.forEach(scope.cartList, function (data, index, array) {
                    if (attr.cartid == data.shoppingCartID) {
                        data.skuAcount = parseInt(data.skuAcount) + 1;
                        scope.update();
                        scope.allPrices();
                        scope.$apply();//刷新视图
                    }
                });
            });
        }
    }
})
// 减 (购物车)
myApp.directive('myMinus', function () {
    return {
        link: function (scope, element, attr) {
            element.click(function () {
                var This = this
                angular.forEach(scope.cartList, function (data, index, array) {
                    if (attr.cartid == data.shoppingCartID) {
                        if (data.skuAcount <= 1) {
                            $.mbox({
                                area: ["250px", "auto"], //弹框大小
                                border: [0, .5, "#666"],
                                dialog: {
                                    msg: "Do you want delete this Item?",
                                    btns: 2,   //1: 只有一个按钮   2：两个按钮  3：没有按钮 提示框
                                    type: 3,   //1:对钩   2：问号  3：叹号
                                    btn: ["Sure", "Cancel"],  //自定义按钮
                                    yes: function () {  //点击左侧按钮：成功
                                        data.skuID = 0;
                                        $(This).siblings('input').val(0);
                                        scope.delete();
                                        scope.cartList.splice(index, 1)
                                    },
                                    no: function () { //点击右侧按钮：失败
                                        return false;
                                    }
                                }
                            });
                        } else {
                            data.skuAcount = parseInt(data.skuAcount) - 1;
                            scope.update();
                        }
                        ;
                        scope.allPrices();
                        scope.$apply();
                    }
                });
            });
        }
    }
})
//全选，全不选(购物车)
myApp.directive('allOrcan', function () {
    return function (scope, element, attr) {
        element.click(function () {
            var isCheck = $(this).find('input').prop('checked');
            if (isCheck) {
                $('.one_check').prop('checked', true);
            } else {
                $('input[type=checkbox]').not($('input[type=checkbox]').eq(0)).prop('checked', false);
            }
            angular.forEach(scope.cartList, function (data, index, array) {
                scope.allPrices();
                data.check = isCheck;
            })
            scope.$apply();
        })
    }
})
// 购物车选中(购物车)
myApp.directive('oneCheck', function () {
    return function (scope, element, attr) {
        element.click(function () {
            var This = this
            angular.forEach(scope.cartList, function (data, index, array) {
                if (attr.cartid == data.shoppingCartID) {
                    var isCheck = $(This).prop('checked');
                    data.check = isCheck;
                    scope.allPrices();
                    scope.$apply();
                }
            })
            var len = $(".one_check:checkbox:checked").length;
            var oneLength = $('.one_check').length;
            if (len >= oneLength) {
                $('.all_check').prop('checked', true);
            } else {
                $('.all_check').prop('checked', false);
            }
        });
    }
})
// 删除商品(购物车)
myApp.directive('myDelete', function () {
    return {
        link: function (scope, element, attr) {
            element.click(function () {
                var This = this
                angular.forEach(scope.cartList, function (data, index, array) {
                    if (attr.cartid == data.shoppingCartID) {
                        scope.delete();
                        scope.$apply();
                    }
                })
                if ($(This).text() == "删除选中商品") {
                    scope.deletes();
                }
            })
        }
    }
})
//规格点击事件
var color = '';
var size = '';
myApp.directive('toggleClass', function () {
    return function (scope, element, attr) {
        element.click(function thisFunction() {
            var This = this;
            var colorall = [];
            var colorshi = [];
            var sizeall = [];
            var sizeshi = [];
            var details = $(This).text();
            angular.forEach(scope.Detail.skuList, function (data, index, array) {
                if (details == $.trim(data.skuName1)) {
                    for (var i = 0; i < $(".xiangqing_Color").length; i++) {
                        if ($(".xiangqing_Color:eq(" + i + ")").text() == data.skuName0) {
                            colorshi.push(i)
                        }
                    }
                } else if (details == $.trim(data.skuName0)) {
                    // scope.sligenum();
                    for (var i = 0; i < $(".xiangqing_Size").length; i++) {
                        if ($(".xiangqing_Size:eq(" + i + ")").text() == data.skuName1) {
                            sizeshi.push(i)
                        }
                    }
                } else if (attr.skuname == $.trim(data.skuName)) {
                    if ($(This).text() == "Go Buy") {
                        if (data.inventory > scope.text){
                            scope.once_Buy(data.skuID)
                        }else {
                            scope.tantizhi()
                        }
                    } else if ($(This).text() == "Add to Cart") {
                        scope.add_shopCart(data.skuID)
                    }
                }
                scope.$apply();
            })
            if ($(This).hasClass("xiangqing_Size")) {
                $(This).toggleClass('xiangqing_size');
                if ($('.xiangqing_size').length > 1) {
                    size = $(This).text()
                    scope.jiti(color, size)
                    $(".xiangqing_Size").removeClass('xiangqing_size')
                    $(This).toggleClass('xiangqing_size');
                    for (var j = 0; j < $(".xiangqing_Size").length; j++) {
                        if ($(".xiangqing_Color:eq(" + j + ")").hasClass("hover1") == false) {
                            $(".xiangqing_Color:eq(" + j + ")").addClass("hover1");
                            $(".xiangqing_Color:eq(" + j + ")").removeClass("fou")
                            $(".xiangqing_Color:eq(" + j + ")").bind("click", thisFunction);
                        }
                    }
                    for (var i = 0; i < $(".xiangqing_Color").length; i++) {
                        colorall.push(i)
                    }
                    var colorfou = difference(colorall, colorshi);
                    for (var i = 0; i < colorfou.length; i++) {
                        $(".xiangqing_Color:eq(" + colorfou[i] + ")").removeClass("hover1");
                        $(".xiangqing_Color:eq(" + colorfou[i] + ")").addClass("fou")
                        $(".xiangqing_Color:eq(" + colorfou[i] + ")").unbind("click");
                    }
                } else if ($('.xiangqing_size').length > 0) {
                    size = $(This).text()
                    scope.jiti(color, size)
                    for (var i = 0; i < $(".xiangqing_Color").length; i++) {
                        colorall.push(i)
                    }
                    var colorfou = difference(colorall, colorshi);
                    for (var i = 0; i < colorfou.length; i++) {
                        $(".xiangqing_Color:eq(" + colorfou[i] + ")").removeClass("hover1");
                        $(".xiangqing_Color:eq(" + colorfou[i] + ")").addClass("fou")
                        $(".xiangqing_Color:eq(" + colorfou[i] + ")").unbind("click");
                    }
                } else {
                    size = '';
                    scope.jiti(color, size)
                    for (var i = 0; i < $(".xiangqing_Color").length; i++) {
                        colorall.push(i)
                    }
                    var colorfou = difference(colorall, colorshi);
                    for (var i = 0; i < colorfou.length; i++) {
                        $(".xiangqing_Color:eq(" + colorfou[i] + ")").addClass("hover1");
                        $(".xiangqing_Color:eq(" + colorfou[i] + ")").removeClass("fou");
                        $(".xiangqing_Color:eq(" + colorfou[i] + ")").bind("click", thisFunction);
                    }
                }
                scope.$apply();
            } else if ($(This).hasClass("xiangqing_Color")) {
                $(This).toggleClass('xiangqing_color')
                if ($('.xiangqing_color').length > 1) {
                    color = $(This).text()
                    scope.jiti(color, size)
                    $(".xiangqing_Color").removeClass('xiangqing_color')
                    $(This).toggleClass('xiangqing_color')
                    for (var j = 0; j < $(".xiangqing_Size").length; j++) {
                        if ($(".xiangqing_Size:eq(" + j + ")").hasClass("hover2") == false) {
                            $(".xiangqing_Size:eq(" + j + ")").addClass("hover2");
                            $(".xiangqing_Size:eq(" + j + ")").removeClass("fou1")
                            $(".xiangqing_Size:eq(" + j + ")").bind("click", thisFunction);
                        }
                    }
                    for (var i = 0; i < $(".xiangqing_Size").length; i++) {
                        sizeall.push(i)
                    }
                    var sizefou = difference(sizeall, sizeshi);
                    for (var i = 0; i < sizefou.length; i++) {
                        $(".xiangqing_Size:eq(" + sizefou[i] + ")").removeClass("hover2");
                        $(".xiangqing_Size:eq(" + sizefou[i] + ")").addClass("fou1");
                        $(".xiangqing_Size:eq(" + sizefou[i] + ")").unbind("click");
                    }
                } else if ($('.xiangqing_color').length == 1) {
                    color = $(This).text()
                    scope.jiti(color, size)
                    for (var i = 0; i < $(".xiangqing_Size").length; i++) {
                        sizeall.push(i)
                    }
                    var sizefou = difference(sizeall, sizeshi);
                    for (var i = 0; i < sizefou.length; i++) {
                        $(".xiangqing_Size:eq(" + sizefou[i] + ")").removeClass("hover2");
                        $(".xiangqing_Size:eq(" + sizefou[i] + ")").addClass("fou1");
                        $(".xiangqing_Size:eq(" + sizefou[i] + ")").unbind("click");
                    }
                } else {
                    color = '';
                    scope.jiti(color, size)
                    for (var i = 0; i < $(".xiangqing_Size").length; i++) {
                        sizeall.push(i)
                    }
                    var sizefou = difference(sizeall, sizeshi);
                    for (var i = 0; i < sizefou.length; i++) {
                        $(".xiangqing_Size:eq(" + sizefou[i] + ")").addClass("hover2");
                        $(".xiangqing_Size:eq(" + sizefou[i] + ")").removeClass("fou1");
                        $(".xiangqing_Size:eq(" + sizefou[i] + ")").bind("click", thisFunction);
                    }
                }
                scope.$apply();
            } else if ($('#values').length > 0 && $('#values1').length > 0) {
                if (color == '' || size == '') {
                    scope.skJudeg();
                }
            } else if ($('#values').length > 0 && $('#values1').length <= 0) {
                if (color == '') {
                    scope.skJudeg();
                }
            }
            if ($('#price').length == 1) {
                $("#Prices").hide();
            } else {
                $("#Prices").show();
            }
            scope.$apply();
        })
    }
})
//地址管理点击事件
myApp.directive('addressClick', function () {
    return {
        link: function (scope, element, attr) {
            element.click(function () {
                var This = this
                angular.forEach(scope.addressList, function (data, index, array) {
                    if (attr.addrid == data.addressID) {
                        if ($(This).hasClass('delete_address')) {
                            scope.delete_address();
                        } else if ($(This).hasClass('default_address') == true || $(This).hasClass('Default') == true) {
                            scope.Default_address();
                        } else if ($(This).hasClass('Edit_address')) {
                            scope.edit_address();
                            $("#myadd_baocun").hide();
                            $("#myadd_xiugai").show();
                        } else {
                            var LI = $(This).parents('li');
                            LI.toggleClass('address_sigle');
                            LI.find('.jiaojiao').toggleClass("jiaojiao1")
                            if ($(".address_sigle").length > 1) {
                                $(".addreSigle").removeClass("address_sigle");
                                $('.jiaojiao').removeClass("jiaojiao1")
                                LI.toggleClass("address_sigle")
                                LI.find('.jiaojiao').toggleClass("jiaojiao1")
                                scope.Address_click()
                            } else if ($(".address_sigle").length == 1) {
                                scope.Address_click();
                            } else {
                                scope.Addr_click();
                            }
                        }
                        scope.$apply();
                    }
                })
            })
        }
    }
})
//搜索左侧菜单点击
myApp.directive('seachLeft', function () {
    return {
        link: function (scope, element, attr) {
            element.click(function () {
                var This = this;
                $(".defColor").removeClass("seachThis");
                $(This).addClass("seachThis");
            })
        }
    }
})
//帮助页面左侧点击
myApp.directive('helpLeft', function () {
    return {
        link: function (scope, element, attr) {
            element.click(function () {
                $(".type1_con").removeClass("helpCent_active");
                $(this).toggleClass("helpCent_active");
                $(this).parent("li").find(".icon").toggleClass("icon-youjiantou1");
                $(this).parent("li").find(".icon").toggleClass("icon-xiajiantou3");
                $(this).parent("li").find(".helpCent_type2").slideToggle();
            })
        }
    }
})
myApp.directive('help1Left', function () {
    return {
        link: function (scope, element, attr) {
            element.click(function () {
                $(".type2_con>a").removeClass("helpCent_active");
                $(this).children("a").toggleClass("helpCent_active");
                $(this).parent("li").find(".helpCent_type3").slideToggle()
            })
        }
    }
})
// $(".seach_Menu").click(function () {
//     $(this).children(".seach_Menucontent").show();
// })
//支付方式
myApp.directive('payMode', function () {
    return {
        link: function (scope, element, attr) {
            element.click(function () {
                var This = this;
                var isCheck = $(This).prop("checked");
                angular.forEach(scope.YesModepay, function (data, index, array) {
                    if (attr.id == data.id) {
                        if (isCheck) {
                            $(This).parents(".pay2_checkS").find("input").prop("checked", false)
                            $(This).prop("checked", true);
                            scope.pay_mode();
                            scope.$apply();
                        }
                    }
                })
            })
        }
    }
})
//查询默认地址
myApp.directive('defaultAdd', function () {
    return {
        link: function (scope, element, attr) {
            if (attr.default == 1) {
                $(this).addClass("defaultA");
            }
        }
    }
})
//店铺搜索页面的商品按钮
myApp.directive('zuoLi', function () {
    return {
        link: function (scope, element, attr) {
            element.click(function () {
                var This = this;
                var index = $(This).attr("data");
                console.log(index)
                var maxNum = $(This).parent(".store_content_li2").find(".store_content_li_P").length;
                if (index == 0){
                    index=Math.ceil(maxNum / 3)-1;
                    $(This).attr("data",index);
                    $(This).next().attr("data",index)
                }else {
                    index--;
                    $(This).attr("data",index)
                    $(This).next().attr("data",index)
                }
                var px = -420 * index;
                $(This).parent(".store_content_li2").find(".store_content_li22").animate({left: px}, "linear")
            })
        }
    }
})
//店铺搜索页面的商品按钮
myApp.directive('youLi', function () {
    return {
        link: function (scope, element, attr) {
            element.click(function () {
                var This = this;
                var index = $(This).attr("data");
                console.log(index)
                var maxNum = $(This).parent(".store_content_li2").find(".store_content_li_P").length;

               if (index >= Math.ceil(maxNum / 3)-1){
                   index=0;
                   $(This).attr("data",index)
                   $(This).prev().attr("data",index)
               }else {
                   index++;
                   $(This).attr("data",index)
                   $(This).prev().attr("data",index)
               }
                var px = -420 * index;
                $(This).parent(".store_content_li2").find(".store_content_li22").animate({left: px}, "linear")
            })
        }
    }
})
//弹出框
myApp.directive('helloWorld', function () {
    return {
        template: '<p style="font-size: 20px;color: white;line-height: 150px;text-align: center;"><b>{{promptMessage}}</b></p>',
    }
})
//全部分类按钮
myApp.directive('classIfy', function () {
    return {
        link: function (scope, element, attr) {
            element.click(function () {
                var This = this;
                var indexs = $(This).index()
                var topPx = $(".classify_content_class:eq(" + indexs + ")").offset().top - $(".nav_location").height();
                $('html, body').animate({scrollTop: topPx}, 'linear');
            })
        }
    }
})
// myApp.directive('headerHtml', function () {
//     return {
//         restrict: 'E',
//         templateUrl: "views/header.html",
//         controller: ['$scope', '$http', "$location", function ($scope, $http, $location) {
//
//         }]
//     };
// });
myApp.directive('ensureUnique', function ($http) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            scope.$watch(attrs.ngModel, function (value) {
                if (!value) return;
                $http({
                    method: 'POST',
                    url: Request_URL+"/account/isBoolean",
                    params: {userName: value}
                }).then(function (rs) {
                    ctrl.$setValidity('unique', rs.data);
                }).catch(function (rs) {
                    ctrl.$setValidity('unique', false);

                })
            })
        }
    }
})
//图片上传标签
myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(event){
                scope.id = attrs.id;
                scope.$apply(function(){
                    modelSetter(scope, element[0].files);
                });
                //附件预览
                scope.file = (event.srcElement || event.target).files[0];
                scope.getFile(attrs.id);
            });
        }
    };
}]);

//图片放大
myApp.directive('enlargePic',function(){//enlargePic指令名称，写在需要用到的地方img中即可实现放大图片
    return{
        restrict: "AE",
        link: function(scope,elem){
            elem.bind('click',function($event){
                var img = $event.srcElement || $event.target;
                angular.element(document.querySelector(".mask"))[0].style.display = "block";
                angular.element(document.querySelector(".bigPic"))[0].src = img.src;
            })
        }
    }
})
myApp.directive('closePic',function(){
        return{
            restrict: "AE",
            link: function(scope,elem){
                elem.bind('click',function($event){
                    angular.element(document.querySelector(".mask"))[0].style.display = "none";
                })
            }
        }
    });
/**
 * filter 自定义筛选
 */
myApp.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);
//根据名字过滤
myApp.filter('unique', function () {
    return function (collection, keyname) {
        var output = [],
            keys = [];
        angular.forEach(collection, function (item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    }
});
//限制文字输出个数
myApp.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});


//数组合并取不同
function difference(arr1, arr2) {
    var c = [];
    for (var i = 0; i < arr1.length; i++) {
        var stra = arr1[i];
        var count = 0;
        for (var j = 0; j < arr2.length; j++) {
            var strb = arr2[j];
            if (stra == strb) {
                count++;
            }
        }
        if (count == 0) {//表示数组1的这个值没有重复的，放到返回列表中
            c.push(stra);
        }
    }
    return c;
}









