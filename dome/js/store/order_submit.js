myApp.controller('order_submit', function ($rootScope, $scope, $http, $stateParams, $location, $timeout, SignService) {
    $scope.cartids = $location.search().cartIDs;
    $scope.skuid = $location.search().skuid;
    $scope.num = $location.search().num;
    $scope.itemID = $location.search().itemid;
    $scope.address_num = 2;
    $scope.address_add = {};
    $scope.address_add.receiver = $scope.address_add.receiver;
    $scope.address_add.mobile = $scope.address_add.mobile;
    $scope.address_add.postcode = $scope.address_add.postcode;
    $scope.address_add.address = $scope.address_add.address;
    $scope.address_add.isDefault = $scope.address_add.isDefault;
    $scope.address_add.addrID = $scope.address_add.addrID;
    $scope.address_add.remark = $scope.address_add.remark;
    $('.mobile').blur(checkPhone);
    $('.Email').blur(checkEmail);
    //获取收货地址集
    $scope.limit = 3;
    $scope.incrementLimit = function () {
        SignService.getHttp("/account/live").then(function (result) {
            $scope.code = result.code;
            $scope.messages = result.message;
            if ($scope.code == 0 && $scope.messages == "在线") {
                $scope.limit = 20;
            } else {
                $rootScope.layer1("登陆超时!，请登陆!", "/login");
            }
        })
    };
    $scope.decrementLimit = function () {
        $scope.limit = 3;
    };
    $scope.address_num = 0;
    SignService.getHttp("/address/list").then(function (result) {
        $scope.addressList = result;
        $scope.address_num = $scope.addressList.length
    })
    var addressData = {
        "fromCart": true,
        "invoice": 0,
        "invoiceTitle": "",
        "logistics": 0,
        "orders": [
            {
                "num": 0,
                "skuID": 0
            }
        ],
        "receiver": {
            "address": "",
            "city": "",
            "district": "",
            "mobile": "",
            "postcode": "",
            "receiver": "",
            "state": ""
        },
        "remark": ""
    };
    $scope.checkText = function () {
        if ($scope.remark.length > 50) {
            $rootScope.layer2("最多50字!")
            $scope.remark = $scope.remark.substr(0, 50);
        }
    };
    $scope.Add_pitchon = "/address/default";
    addressData.orders = [];
    // 获取要支付的商品
    if ($scope.cartids == undefined) {
        SignService.getHttp("/item/skuDetail?itemID=" + $scope.itemID + "&skuID=" + $scope.skuid + "&num=" + $scope.num).then(function (rs) {
            $scope.waitSubmitList = rs.result.shopCartItem;
            $scope.supplierName = rs.result.supplierName;
            angular.forEach($scope.waitSubmitList, function (data1, index, array) {
                var skuID_num = {};
                skuID_num.num = data1.skuAcount;
                skuID_num.skuID = data1.skuID;
                addressData.orders.push(skuID_num);
            })
            $scope.Address_click = function () {
                $scope.Add_pitchon = "/address/sigle?addrID=" + this.address.addressID;
            }
            $scope.Addr_click = function () {
                $scope.Add_pitchon = "";
            }
            $scope.order_Submit = function () {
                if ($scope.Add_pitchon == "") {
                    $rootScope.layer2("您还没有选择收货地址!")
                } else {
                    $http.get(Request_URL + $scope.Add_pitchon).then(function (result) {
                        if (result.data == "") {
                            $rootScope.layer2("您还没有选择收货地址!")
                        } else {
                            addressData.receiver.address = result.data.address;
                            addressData.receiver.city = result.data.city;
                            addressData.receiver.district = result.data.district;
                            addressData.receiver.mobile = result.data.phone;
                            addressData.receiver.postcode = result.data.zip;
                            addressData.receiver.state = result.data.province;
                            addressData.receiver.receiver = result.data.name;
                            addressData.remark = $scope.remark;
                            $http({
                                method: 'POST',
                                url: Request_URL + "/trade/add",
                                data: addressData,
                                headers: {'Content-Type': 'application/json'}
                            }).then(function (result) {
                                console.log(addressData)
                                debugger;
                                console.log(result.data);
                                $scope.tradeID = result.data.tradeID;
                                $rootScope.layer1("订单提交成功！!", "/paytwo?tradeID=" + $scope.tradeID)
                            });
                        }
                    })

                }
            }
        })
    } else {
        SignService.shopp_cart($scope.cartids).then(function (result) {
            $scope.waitSubmitList = result.data;
            angular.forEach($scope.waitSubmitList, function (data1, index, array) {
                var skuID_num = {};
                skuID_num.num = data1.skuAcount;
                skuID_num.skuID = data1.skuID;
                addressData.orders.push(skuID_num);
            })
            $scope.Address_click = function () {
                $scope.Add_pitchon = "/address/sigle?addrID=" + this.address.addressID;
            }
            $scope.Addr_click = function () {
                $scope.Add_pitchon = "";
            }
            $scope.order_Submit = function () {
                if ($scope.Add_pitchon == "") {
                    $rootScope.layer2("您还没有选择收货地址!")
                } else {
                    $http.get(Request_URL + $scope.Add_pitchon).then(function (result) {
                        console.log(result.data)
                        if (result.data == "") {
                            $rootScope.layer2("您还没有选择收货地址!")
                        } else {
                            addressData.receiver.address = result.data.address;
                            addressData.receiver.city = result.data.city;
                            addressData.receiver.district = result.data.district;
                            addressData.receiver.mobile = result.data.phone;
                            addressData.receiver.postcode = result.data.zip;
                            addressData.receiver.state = result.data.province;
                            addressData.receiver.receiver = result.data.name;
                            addressData.remark = $scope.remark;
                            $http({
                                method: 'POST',
                                url: Request_URL + "/trade/add",
                                data: addressData,
                                headers: {'Content-Type': 'application/json'}
                            }).then(function (result) {
                                console.log(addressData)
                                debugger;
                                console.log(result.data);
                                $scope.tradeID = result.data.tradeID;
                                $rootScope.layer1("订单提交成功！!", "/paytwo?tradeID=" + $scope.tradeID)
                            });
                        }
                    })

                }
            }

        })
    }
    $scope.add_address = function () {
        SignService.getHttp("/account/live").then(function (result) {
            $scope.code = result.code;
            $scope.messages = result.message;
            if ($scope.code == 0 && $scope.messages == "在线") {
                $(".pay_address_wrap").fadeIn();
                $("#myadd_baocun").show();
                $("#myadd_xiugai").hide();
                $scope.huan = 0;
                $scope.address_add.district = null;
                $scope.address_add.state = null;
                $scope.address_add.city = null;
            } else {
                $rootScope.layer1("登陆超时!，请登陆!", "/login");
            }
        })
    }
    $scope.close_add = function () {
        $(".pay_address_wrap").fadeOut();
        $scope.address_add.receiver = null;
        $scope.address_add.mobile = null;
        $scope.address_add.postcode = null;
        $scope.address_add.address = null;
        $scope.address_add.addrID = null;
        $scope.address_add.district = null;
        $scope.address_add.state = null;
        $scope.address_add.city = null;
        $scope.huan = 0;
    }
    //获取省
    SignService.getHttp("/address/region/list").then(function (result) {
        $scope.provinceList = result;

    })
    //获取市
    $scope.pClick = function () {
        SignService.getHttp("/address/region/childList?parentCode=" + this.province.areaCode).then(function (result) {
            $scope.cityList = result;
        })
        $scope.address_add.state = this.province.name;
        console.log(this.province.name);
    }
    // 获取地区
    $scope.pClick1 = function () {
        SignService.getHttp("/address/region/childList?parentCode=" + this.city.areaCode).then(function (result) {
            $scope.districtList = result;
        })
        $scope.address_add.city = this.city.name;
    }
    // 地区点击
    $scope.pClick2 = function () {
        $scope.address_add.district = this.district.name;
    }
    //点击确认添加新地址
    $scope.addressAdd = function () {
        SignService.getHttp("/account/live").then(function (result) {
            $scope.code = result.code;
            $scope.messages = result.message;
            if ($scope.code == 0 && $scope.messages == "在线") {
                debugger;
                if ($scope.address_add.receiver == null || $scope.address_add.mobile == null || $scope.address_add.district == null || $scope.address_add.address == null || $scope.address_add.state == null || $scope.address_add.city == null) {
                    $rootScope.layer2("信息有误，请核对信息!")
                } else {
                    if ($scope.address_add.isDefault == undefined) {
                        $scope.address_add.isDefault = false;
                        $http({
                            method: 'POST',
                            url: Request_URL + "/address/add",
                            params: $scope.address_add
                        }).then(function (result) {
                            SignService.getHttp("/address/list").then(function (result) {
                                $scope.addressList = result;
                                $scope.address_num = $scope.addressList.length
                            })
                            $rootScope.layer2("添加地址成功!");
                            $('.pay_address_wrap').fadeOut();
                        });
                    } else {
                        $http({
                            method: 'POST',
                            url: Request_URL + "/address/add",
                            params: $scope.address_add
                        }).then(function (result) {
                            SignService.getHttp("/address/list").then(function (result) {
                                $scope.addressList = result;
                                $scope.address_num = $scope.addressList.length
                            })
                            $rootScope.layer2("添加地址成功!");
                            $('.pay_address_wrap').fadeOut();
                        });
                    }
                }
            } else {
                $rootScope.layer1("登陆超时!，请登陆!", "/login");
            }
        })
        // $http({
        //     method: 'POST',
        //     url: Request_URL + "/address/add",
        //     params: $scope.address_add
        // }).then(function (result) {
        //     $scope.promptMessage = "添加新地址成功!"
        //     $(".promptMessage").css({
        //         transform: 'scale(1,1)',
        //         transition: 'all 0.1s linear',
        //     })
        //     SignService.getHttp("/address/list").then(function (result) {
        //         $scope.addressList = result;
        //         $scope.address_num = $scope.addressList.length
        //     })
        //     $timeout(function () {
        //         $(".promptMessage").css({
        //             transform: 'scale(0,0)',
        //             transition: 'all 0.1s linear',
        //         })
        //         $timeout(function () {
        //             $('.pay_address_wrap').fadeOut();
        //             window.location.reload();
        //         }, 300);
        //     }, 500);
        // });
    }
    //删除收货地址
    $scope.delete_address = function () {
        $scope.address_add.addrID = this.address.addressID;
        SignService.getHttp("/account/live").then(function (result) {
            $scope.code = result.code;
            $scope.messages = result.message;
            if ($scope.code == 0 && $scope.messages == "在线") {
                $.mbox({
                    area: ["250px", "auto"],
                    border: [0, .5, "#666"],
                    dialog: {
                        msg: "确定要删除该地址吗",
                        btns: 2,
                        type: 3,
                        btn: ["确定", "取消"],
                        yes: function () {
                            $http({
                                method: 'POST',
                                url: Request_URL + "/address/delete",
                                params: {
                                    addrIDs: $scope.address_add.addrID
                                }
                            }).then(function (rs) {
                                SignService.getHttp("/address/list").then(function (result) {
                                    $scope.addressList = result;
                                    $scope.address_num = $scope.addressList.length
                                })
                            })
                        },
                        no: function () { //点击右侧按钮：失败
                            return false;
                        }
                    }
                });
            } else {
                $rootScope.layer1("登陆超时!，请登陆!", "/login");
            }
        })
    }
    $scope.huan = 0;
    $scope.huan1 = function () {
        $scope.huan = 0;
        $scope.address_add.district = null;
        $scope.address_add.state = null;
        $scope.address_add.city = null;
    }
    // 编辑收货地址
    $scope.edit_address = function () {
        $scope.address_add.addrID = this.address.addressID;
        $scope.huan = 1;
        SignService.getHttp("/account/live").then(function (result) {
            $scope.code = result.code;
            $scope.messages = result.message;
            if ($scope.code == 0 && $scope.messages == "在线") {
                $('.pay_address_wrap').fadeIn();
                SignService.getHttp("/address/sigle?addrID=" + $scope.address_add.addrID).then(function (result) {
                    $scope.address_sigle = result;
                    $scope.address_add.receiver = $scope.address_sigle.name;
                    $scope.address_add.mobile = $scope.address_sigle.phone;
                    $scope.address_add.postcode = $scope.address_sigle.zip;
                    $scope.address_add.address = $scope.address_sigle.address;
                    $scope.address_add.state = $scope.address_sigle.province;
                    $scope.address_add.city = $scope.address_sigle.city;
                    $scope.address_add.district = $scope.address_sigle.district;
                    $(window).scrollTop(0);
                    $scope.Edit_address = function () {
                        SignService.getHttp("/account/live").then(function (result) {
                            $scope.code = result.code;
                            $scope.messages = result.message;
                            if ($scope.code == 0 && $scope.messages == "在线") {
                                if ($scope.address_add.receiver == null || $scope.address_add.mobile == null || $scope.address_add.district == null || $scope.address_add.address == null || $scope.address_add.state == null || $scope.address_add.city == null) {
                                    $rootScope.layer2("信息有误，请核对信息!")
                                } else {
                                    if ($scope.address_add.isDefault == undefined) {
                                        $scope.address_add.isDefault = false;
                                        $http({
                                            method: 'POST',
                                            url: Request_URL + "/address/update",
                                            params: $scope.address_add
                                        }).then(function (result) {
                                            $rootScope.layer("修改地址成功!")
                                            $('.pay_address_wrap').fadeOut();
                                            $scope.huan = 0;
                                        });
                                    } else {
                                        $http({
                                            method: 'POST',
                                            url: Request_URL + "/address/update",
                                            params: $scope.address_add
                                        }).then(function (result) {
                                            $rootScope.layer("修改地址成功!")
                                            $('.pay_address_wrap').fadeOut();
                                            $scope.huan = 0;
                                        });
                                    }
                                }
                            } else {
                                $rootScope.layer1("登陆超时!，请登陆!", "/login");
                            }
                        })
                    }
                })
            } else {
                $rootScope.layer1("登陆超时!，请登陆!", "/login");
            }
        })
    }
    //设为默认地址
    $scope.Default_address = function () {
        $scope.address_add.addrID = this.address.addressID;
        SignService.getHttp("/account/live").then(function (result) {
            $scope.code = result.code;
            $scope.messages = result.message;
            if ($scope.code == 0 && $scope.messages == "在线") {
                $http({
                    method: 'POST',
                    url: Request_URL + "/address/default/set",
                    params: {
                        addrID: $scope.address_add.addrID
                    }
                }).then(function () {
                    $rootScope.layer("设置默认成功!")
                })
            } else {
                $rootScope.layer1("登陆超时!，请登陆!", "/login");
            }
        })
    }

    $scope.allPrices = function () {
        $scope.allprice = 0;
        angular.forEach($scope.waitSubmitList, function (data, index, array) {
            $scope.totalPrice = data.skuAcount * data.salesPrice;
            allpric = parseFloat($scope.totalPrice);
            $scope.allprice += allpric;
            $scope.allprice = parseFloat(($scope.allprice).toFixed(2));
        })
        return $scope.allprice;

    };
    $scope.num = null;
    $scope.skuID = null;
})