/**
 * Created by Administrator on 2017/3/16.支付2
 */
myApp.controller('paytwo', function ($rootScope, $scope, $http, $state, $location, $timeout, SignService) {
    $scope.tradeID = $location.search().tradeID;
    SignService.getHttp("/trade/pay/list").then(function (result) {
        $scope.Modepay = result;
    })
    SignService.getHttp("/trade/pay/way").then(function (result) {
        $scope.YesModepay = result;
    })
    $scope.paymodeID = null;
    $scope.pay_mode = function () {
        $scope.paymodeID = this.yespay.id
    }
    SignService.getHttp("/trade/" + $scope.tradeID + "/detail").then(function (result) {
        $scope.payPice = result.payment;
        $scope.tradeNO = result.tradeNO;
    })
    $scope.payMent = function () {
        if ($scope.paymodeID == null) {
            $rootScope.layer2('还没有选择付款方式!')
        } else {
            $http({
                method: 'POST',
                url: Request_URL + "/trade/pay/license",
                params: {
                    tradeID: $scope.tradeID,
                    way: $scope.paymodeID
                }
            }).then(function (result) {
                $state.go('AliPay', {AliPay: result.data.sign});
            })
        }

    }
})