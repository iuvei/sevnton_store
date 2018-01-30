/**
 * Created by Administrator on 2017/4/6.
 */
myApp.controller('helpCenter',function ($scope,$http,$stateParams,$location,SignService) {
    initRequer ($location.search().helpID);
    $scope.$on('$locationChangeSuccess',function () {
        initRequer ($location.search().helpID);
    })
    function initRequer (helpID) {
        $http.get(Request_URL + "/index/helpDetail?helpID="+helpID)
            .then(function (result) {
                $scope.helpDetails = result.data.details;
                console.log($scope.helpDetails)
            })
    }
})