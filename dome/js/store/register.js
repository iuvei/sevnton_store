myApp.controller("register", function ($rootScope, $scope, $http, $timeout, $stateParams, $state,fileReader) {
    $scope.sss = function () {
        console.log($scope.data)
    }
    $scope.data = {};
    $scope.data.userName = null;//用户名
    $scope.data.password = null;//密码
    $scope.data.confirmPassword = null;//再次输入密码
    $scope.registBtn = function () {
        $http({
            method: 'POST',
            url: Request_URL + "/account/register",
            params: $scope.data,//params作为url的参数
        }).then(function (result) {
            $rootScope.layer1("注册成功！将自动跳转到登录页面。", "/login?userName=" + $scope.data.userName);
        });
    }
    $scope.getFile = function (nameid) {
        fileReader.readAsDataUrl($scope.file, $scope)
            .then(function (result) {
                $scope.save(nameid);
                $scope.YYzhiZhaoSrc1 = result;
            });
    };
    $scope.save = function (id) {
        var fd = new FormData();
        var file = document.querySelector('#'+id).files[0];
        fd.append('myfiles', file);
        $http({
            method: 'POST',
            url: Request_URL + "/file/fileUpload",
            data: fd,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        })
            .then(function (rs) {
                //上传成功的操作
                var urlimg = rs.data;
                    $scope.companyPicUrl = urlimg.substr(2, urlimg.length - 2);
            })
    }
})