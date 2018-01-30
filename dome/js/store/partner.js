myApp.controller('partner',function ($scope,$http,$stateParams,$location,SignService) {
    $http.get(Request_URL + "/index/partnerList?from=0&limit=20")
        .then(function (result) {
            $scope.partnerList = result.data;
        })
})