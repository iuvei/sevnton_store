/**
 * Created by Administrator on 2017/3/29.
 */
myApp.controller("supplier", function ($rootScope, $scope, $http, $location, $timeout, SignService) {
    $scope.supplierid = $location.search().supplid;
    $scope.limits = 10;
    $http({
        method: 'POST',
        url: Request_URL + "/supplier/main",
        params: {supplierID: $scope.supplierid}
    }).then(function (rs) {
        $scope.suppliers = rs.data.result.supplier;
        $scope.shul = $scope.suppliers.itemList.length
        console.log(rs.data.result.supplier);
        $scope.clic_limits = function () {
            $scope.limits = $scope.shul;
            console.log($scope.limits);
        }
        $scope.isclic_limits = function () {
            $scope.limits = 10;
            console.log($scope.limits);
        }
    });
})