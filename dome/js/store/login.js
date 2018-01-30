myApp.controller('login', function ($rootScope, $scope, $http, $state, $timeout, $cookies, $location) {
    $scope.registerName = $location.search().userName;
    $scope.registeris = $location.search().registerIs;
    if ($scope.registerName == undefined) {
        if ($cookies.get("userName") == undefined) {
            $scope.account = "";
            $scope.password = "";
        } else if ($cookies.get("userName").indexOf(";") == -1 && $cookies.get("userName").indexOf(";") != undefined) {
            $scope.account = $cookies.get("userName")
            $scope.password = "";
        } else {
            $scope.account = $cookies.get("userName").split(";")[0];
            var pwds = $cookies.get("userName").split(";")[1];
            var leng = pwds.length-20;
            var pwd = pwds.substr(10,leng);
            $scope.password = pwd
        }
    } else {
        $scope.account = $scope.registerName;
    }
    // $scope.promptMessage = "登录成功！将自动跳转到首页"
    $scope.login = function () {
        if ($scope.account != "" && $scope.password != "") {
            if ($scope.checkpwd) {
                $http({
                    method: 'POST',
                    url: Request_URL + "/account/login",
                    params: {account: $scope.account, password: $scope.password}
                }).then(function (result) {
                    $cookies.put('userName', $scope.account + ";" + $scope.rundoms() + $scope.password + $scope.rundoms());
                    $scope.message = result.data.message;
                    if ($scope.message == "登录成功") {
                        $rootScope.layer3("登录成功!")
                    } else {
                        $rootScope.layer2("用户名或密码错误!")
                    }
                });
            } else {
                $http({
                    method: 'POST',
                    url: Request_URL + "/account/login",
                    params: {account: $scope.account, password: $scope.password}
                }).then(function (result) {
                    // var encodeStr=base.encode(str);
                    $cookies.put('userName', $scope.account);
                    $scope.message = result.data.message;
                    if ($scope.message == "登录成功") {
                        if ($scope.registerName == undefined&&$scope.registeris == undefined) {
                            $rootScope.layer3("登录成功!")
                        } else {
                            $rootScope.layer1("登录成功!", "/home")
                        }
                    } else {
                        $rootScope.layer2("用户名或密码错误!")
                    }
                });
            }
        } else {
            $rootScope.layer2("请输入账号和密码!")
        }
    }
    //登录背景图
    $http.get(Request_URL + "/index/backGround")
        .then(function (result) {
            $scope.general = result.data.result;
        })
    $scope.rundoms = function () {
        var rnd = "";
        for (var i = 0; i < 10; i++) {
            rnd += Math.floor(Math.random() * 10);
        }
        return rnd;
    }
})