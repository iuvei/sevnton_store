/**
 * Created by Administrator on 2017/3/16.分类
 */
myApp.controller('classify', function ($rootScope, $scope, $http, $state, $timeout) {
    $http.get(Request_URL + "/category/list?nested=true")
        .then(function (result) {
            $scope.categoryList = result.data;
        }).catch(function (result) { //捕捉错误处理
        console.info(result);
    });
    $(window).scroll(function () {
        var lens = $(".nav_location_li").length;
        var scrollTop = parseInt($(document).scrollTop());//页面滚动的距离
        var j, Tops1, scroll, Tops, nums;
        scroll = parseInt(scrollTop + 180);//判断所需的滚动距离差
        nums = parseInt(lens - 1);//最后一个的下表
        if (scrollTop > 260) {
            $('.nav_location').addClass('nav_location1');
            $('.classify_content').addClass('classify_content1');
            for (var i = 0; i < lens; i++) {
                Tops = parseInt($(".classify_content_class:eq(" + i + ")").offset().top);
                if (i == nums) {
                    Tops1 = parseInt($(".classify_content_class:eq(" + nums + ")").offset().top + $(".classify_content_class:eq(" + nums + ")").height());
                    if (Tops < scroll && scroll < Tops1) {
                        $(".nav_location_li").removeClass("nav_location_li1")
                        $(".nav_location_li:eq(" + nums + ")").addClass("nav_location_li1")
                    }
                } else {
                    j = parseInt(i + 1)
                    Tops1 = parseInt($(".classify_content_class:eq(" + j + ")").offset().top);
                    if (Tops < scroll && scroll < Tops1) {
                        $(".nav_location_li").removeClass("nav_location_li1")
                        $(".nav_location_li:eq(" + i + ")").addClass("nav_location_li1")
                    }
                }
            }
        } else {
            $('.nav_location').removeClass('nav_location1');
            $('.classify_content').removeClass('classify_content1');
            $(".nav_location_li").removeClass("nav_location_li1")
        }
    });
})