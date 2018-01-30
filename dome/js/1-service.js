var myApp = angular.module("myApp", ["ui.router", "ngCookies", "me-lazyload"]);
myApp.factory('SignService', function ($http, $q) {
    var service = {};
    service.getHttp = function (id) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get(Request_URL + id)//读取数据的函数。
            .then(function (result) {
                deferred.resolve(result.data);
            }).catch(function (result) {
            deferred.reject(result);
        });
        return promise;
    }
    service.shopp_cart = function (id) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get(Request_URL + '/cart/list?cartIDs=' + id + '&status=1')//读取数据的函数。
            .then(function (result) {
                deferred.resolve(result);
            }).catch(function (result) {
            deferred.reject(result);
        });
        return promise;
    }
    return service;
});
myApp.factory('loginsss', function ($http) {
    var service = {};
    service.getHttp = function (id) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get(Request_URL + id)//读取数据的函数。
            .then(function (result) {
                var code = result.code;
                var messages = result.message;
                if (code == 0 && messages == "在线") {
                    $scope.tueyes = true;
                };
            }).catch(function (result) {
            deferred.reject(result);
        });
        return promise;
    }
    return service;
});
myApp.service('myService', function(SignService) {
    console.log('instance myService');
    var privateValue = "I am Private";
    this.variable = "This is public";
    this.getPrivate = function() {
        SignService.getHttp("/account/live").then(function (result) {
            var code = result.code;
            var messages = result.message;
            if (code == 0 && messages == "在线") {
                privateValue = true;
            };
            return privateValue
        });
    };
});
//图片上传服务
myApp.factory('fileReader', ["$q", "$log", function($q, $log){
    var onLoad = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();
        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);
        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
}])

// myApp.filter("urlFilter",function ($rootScope,$http) {
//     return function (input) {
//         if (input.indexOf("/cart")>=0){
//             return input;
//         }else {
//             return input;
//         }
//     }
// })