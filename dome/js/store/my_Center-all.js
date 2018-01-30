/**
 * Created by Administrator on 2017/3/20.
 */
//个人中心首页
myApp.controller('my_center-all', function ($rootScope, $scope, $http, $state, $timeout, $location) {
    $scope.paySatus = $location.search().statu;
    //分页
    $http.get(Request_URL + "/trade/list?from=0&limit=10&tradeStatus=" + $location.search().statu).then(function (rs) {
        if (rs.data.code == 0) {
            $scope.tradeList = rs.data.result.tradeList;
            $scope.page = rs.data.result.page;
        }
    })
    $scope.$on('$locationChangeSuccess', function () {
        $scope.paySatus = $location.search().statu;
        $http.get(Request_URL + "/trade/list?from=0&limit=10&tradeStatus=" + $scope.paySatus).then(function (rs) {
            if (rs.data.code == 0) {
                $scope.tradeList = rs.data.result.tradeList;
                $scope.page = rs.data.result.page;
            }
        })
    })
    //初始化page
    $scope.page = {
        pageNo: 1,
        pageSize: 15,
        totalCount: 0,
        pageCount: 0
    };
    //获取查询结果
    function getList() {
        $http.get(Request_URL + "/trade/list?from=" + ($scope.page.pageNo - 1) * $scope.page.pageSize + "&limit=" + $scope.page.pageSize + "&tradeStatus=" + $scope.paySatus).then(function (rs) {
            if (rs.data.code == 0) {
                $scope.tradeList = rs.data.result.tradeList;
                $scope.page = rs.data.result.page;
            } else {
                alert(rs.data.errorMsg);
            }
        }).catch(function (rs) { //捕捉错误处理

        });
    }

    $scope.previous = function () {
        if ($scope.page.totalCount > 0 && $scope.page.pageNo > 1) {
            $scope.page.pageNo -= 1;
            getList();
        }
    };
    $scope.next = function () {
        if ($scope.page.totalCount > 0
            && $scope.page.pageNo < $scope.page.pageCount) {
            $scope.page.pageNo += 1;
            getList();
        }
    };
    $scope.first = function () {
        if ($scope.page.totalCount > 0 && $scope.page.pageNo > 1) {
            $scope.page.pageNo = 1;
            getList();
        }
    };
    $scope.last = function () {
        if ($scope.page.totalCount > 0
            && $scope.page.pageNo < $scope.page.pageCount) {
            $scope.page.pageNo = $scope.page.pageCount;
            getList();
        }
    };
    $scope.updateReceive = function (tradeID) {
        $http({
            method: 'POST',
            url: Request_URL + "/trade/receive",
            params: {tradeID: tradeID}
        }).then(function (rs) {
            $rootScope.layer("收货成功!")

        }).catch(function (rs) { //捕捉错误处理

        });
    }


})

// 收货地址
myApp.controller('my_center-address', function ($rootScope, $scope, $http, $state, $timeout, SignService) {
    $scope.headeraddH1 = "新增收货地址";
    $scope.address_add = {};
    $scope.address_add.receiver = $scope.address_add.receiver;
    $scope.address_add.mobile = $scope.address_add.mobile;
    $scope.address_add.postcode = $scope.address_add.postcode;
    $scope.address_add.address = $scope.address_add.address;
    $scope.address_add.isDefault = $scope.address_add.isDefault;
    $scope.address_add.addrID = $scope.address_add.addrID;
    //获取收货地址集
    $scope.address_num = 0;
    SignService.getHttp("/address/list").then(function (result) {
        $scope.addressList = result;
        $scope.address_num = $scope.addressList.length
    })
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
                console.log($scope.address_add);
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
                            $rootScope.layer("添加地址成功!");
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
                            $rootScope.layer("添加地址成功!");
                            $('.pay_address_wrap').fadeOut();
                        });
                    }
                }
            } else {
                $rootScope.layer1("登陆超时!，请登陆!", "/login");
            }
        })

    }
    //删除收货地址
    $scope.delete_address = function () {
        $scope.address_add.addrID = this.address.addressID;
        SignService.getHttp("/account/live").then(function (result) {
            $scope.code = result.code;
            $scope.messages = result.message;
            if ($scope.code == 0 && $scope.messages == "在线") {
                $.mbox({
                    area: ["250px", "auto"], //弹框大小
                    border: [0, .5, "#666"],
                    dialog: {
                        msg: "确定要删除该地址吗",
                        btns: 2,   //1: 只有一个按钮   2：两个按钮  3：没有按钮 提示框
                        type: 3,   //1:对钩   2：问号  3：叹号
                        btn: ["确定", "取消"],  //自定义按钮
                        yes: function () {  //点击左侧按钮：成功
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
    $scope.edit_address = function () {
        $scope.headeraddH1 = "编辑收货地址"
        $scope.huan = 1;
        $scope.address_add.addrID = this.address.addressID;
        SignService.getHttp("/account/live").then(function (result) {
            $scope.code = result.code;
            $scope.messages = result.message;
            if ($scope.code == 0 && $scope.messages == "在线") {
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
                                            $scope.headeraddH1 = "新增收货地址";
                                            $scope.huan1()
                                        });
                                    } else {
                                        $http({
                                            method: 'POST',
                                            url: Request_URL + "/address/update",
                                            params: $scope.address_add
                                        }).then(function (result) {
                                            $rootScope.layer("修改地址成功!")
                                            $('.pay_address_wrap').fadeOut();
                                            $scope.huan1()
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
})

//账号绑定

myApp.controller('my_center-bindAccount', function ($rootScope, $scope, $http, $state, $timeout) {
})

//浏览历史

myApp.controller('my_center-browHistory', function ($rootScope, $scope, $http, $state, $timeout) {
    $scope.page = {
        pageNo: 1,
        pageSize: 15,
        totalCount: 0,
        pageCount: 0
    };

    $http.get(Request_URL + "/item/historyItem?from=0&limit=10").then(function (rs) {
        if (rs.data.code == 0) {
            $scope.historyList = rs.data.result.itemList;
            console.log($scope.historyList)
            $scope.page = rs.data.result.page;
        } else {
            alert(rs.data.errorMsg);
        }
    }).catch(function (rs) { //捕捉错误处理
        console.log()

    });
    //获取查询结果
    function getList() {
        console.log(($scope.page.pageNo - 1) * $scope.page.pageSize)
        console.log($scope.page.pageSize)
        $http.get(Request_URL + "/item/historyItem?from=" + ($scope.page.pageNo - 1) * $scope.page.pageSize + "&limit=" + $scope.page.pageSize).then(function (rs) {
            if (rs.data.code == 0) {
                $scope.historyList = rs.data.result.itemList;
                $scope.page = rs.data.result.page;
            } else {
                alert(rs.data.errorMsg);
            }
        }).catch(function (rs) { //捕捉错误处理

        });
    }

    $scope.previous = function () {
        if ($scope.page.totalCount > 0 && $scope.page.pageNo > 1) {
            $scope.page.pageNo -= 1;
            getList();
        }
    };
    $scope.next = function () {
        if ($scope.page.totalCount > 0
            && $scope.page.pageNo < $scope.page.pageCount) {
            $scope.page.pageNo += 1;
            getList();
        }
    };
    $scope.first = function () {
        if ($scope.page.totalCount > 0 && $scope.page.pageNo > 1) {
            $scope.page.pageNo = 1;
            getList();
        }
    };
    $scope.last = function () {
        if ($scope.page.totalCount > 0
            && $scope.page.pageNo < $scope.page.pageCount) {
            $scope.page.pageNo = $scope.page.pageCount;
            getList();
        }
    };

    $scope.freeHisotry = function () {
        $http.get(Request_URL + "/item/delHistory").then(function (rs1) {
            if (rs1.data.code == 0) {
                $http.get(Request_URL + "/item/historyItem?from=" + ($scope.page.pageNo - 1) * $scope.page.pageSize + "&limit=" + $scope.page.pageSize).then(function (rs) {
                    if (rs.data.code == 0) {
                        $scope.historyList = rs.data.result.itemList;
                        $scope.page = rs.data.result.page;
                    } else {
                        alert(rs.data.errorMsg);
                    }
                }).catch(function (rs) { //捕捉错误处理

                });
            } else {
                alert(rs1.data.errorMsg);
            }
        })
    }
})

//收藏商品

myApp.controller('my_center-houseGoods', function ($rootScope, $scope, $http, $state, $timeout) {
    $scope.color11 = {"color": "#44aaf6"}
    $scope.deleteFav = function (itemID) {
        var itemIds = new Array();//创建一个数组
        itemIds.push(itemID);
        $http.get(Request_URL + "/item/delFavourite?itemIds=" + itemIds).then(function (result) {
            if (result.data.code == 0) {
                $rootScope.layer2("删除成功!");
                $http.get(Request_URL + "/item/favouriteList?from=0&limit=10&valid=1").then(function (rs) {
                    if (rs.data.code == 0) {
                        $scope.favouriteList = rs.data.result.favList;
                        $scope.page = rs.data.result.page;
                    } else {
                        alert(rs.data.errorMsg);
                    }
                }).catch(function (rs) { //捕捉错误处理
                    console.log()

                });
            } else {
                $rootScope.layer2("删除失败!");
            }
        }).catch(function (result) { //捕捉错误处理

        });
    }
    // $rootScope.pagePage("/item/favouriteList?from=0&valid=1&limit=","10","/item/favouriteList?valid=1&from=","&limit=")
    //分页
    //初始化page
    $scope.page = {
        pageNo: 1,
        pageSize: 15,
        totalCount: 0,
        pageCount: 0
    };

    $http.get(Request_URL + "/item/favouriteList?from=0&limit=10&valid=1").then(function (rs) {
        if (rs.data.code == 0) {
            $scope.favouriteList = rs.data.result.favList;
            $scope.page = rs.data.result.page;
        } else {
            alert(rs.data.errorMsg);
        }
    }).catch(function (rs) { //捕捉错误处理
        console.log()

    });
    //获取查询结果
    function getList() {
        $http.get(Request_URL + "/item/favouriteList?valid=1&from=" + ($scope.page.pageNo - 1) * $scope.page.pageSize + "&limit=" + $scope.page.pageSize).then(function (rs) {
            if (rs.data.code == 0) {
                $scope.favouriteList = rs.data.result.favList;
                $scope.page = rs.data.result.page;
            } else {
                alert(rs.data.errorMsg);
            }
        }).catch(function (rs) { //捕捉错误处理

        });
    }

    $scope.previous = function () {
        if ($scope.page.totalCount > 0 && $scope.page.pageNo > 1) {
            $scope.page.pageNo -= 1;
            getList();
        }
    };
    $scope.next = function () {
        if ($scope.page.totalCount > 0
            && $scope.page.pageNo < $scope.page.pageCount) {
            $scope.page.pageNo += 1;
            getList();
        }
    };
    $scope.first = function () {
        if ($scope.page.totalCount > 0 && $scope.page.pageNo > 1) {
            $scope.page.pageNo = 1;
            getList();
        }
    };
    $scope.last = function () {
        if ($scope.page.totalCount > 0
            && $scope.page.pageNo < $scope.page.pageCount) {
            $scope.page.pageNo = $scope.page.pageCount;
            getList();
        }
    };

})

//________________________________________________收藏店铺__________________________________________________

myApp.controller('my_center-houseShop', function ($rootScope, $scope, $http, $state, $timeout) {
    $http.get(Request_URL + "/supplier/favSupplierList").then(function (rs) {
        if (rs.data.code == 0) {
            $scope.favSupplierList = rs.data.result.favSupplierList;
        } else {
            alert(rs.data.errorMsg);
        }
    }).catch(function (rs) { //捕捉错误处理
        console.log()
    });

})

//消息提醒

myApp.controller('my_center-messageReminder', function ($rootScope, $scope, $http, $state, $timeout) {
    $scope.color5 = {"color": "#44aaf6"}
})

//————————————————————————————————————————————————————订单中心——————————————————————————————————————————————————————————————————————————

myApp.controller('my_center-order', function ($rootScope, $scope, $http, $state, $timeout, $location) {
    //分页
    //初始化page
    $scope.paySatus = $location.search().statu;
    //分页
    $http.get(Request_URL + "/trade/list?from=0&limit=10&tradeStatus=" + $location.search().statu).then(function (rs) {
        if (rs.data.code == 0) {
            $scope.tradeList = rs.data.result.tradeList;
            $scope.page = rs.data.result.page;
            $scope.tradeList.forEach(function (value, index) {
                value.check = 'flase';
                value.price = '';
            });
            console.log($scope.tradeList)
        }
    })
    $scope.$on('$locationChangeSuccess', function () {
        $scope.paySatus = $location.search().statu;
        console.log($scope.paySatus)
        $http.get(Request_URL + "/trade/list?from=0&limit=10&tradeStatus=" + $scope.paySatus).then(function (rs) {
            if (rs.data.code == 0) {
                $scope.tradeList = rs.data.result.tradeList;
                $scope.page = rs.data.result.page;
            }
        })
    })
    $scope.page = {
        pageNo: 1,
        pageSize: 15,
        totalCount: 0,
        pageCount: 0
    };
    //获取查询结果
    function getList() {
        $http.get(Request_URL + "/trade/list?from=" + ($scope.page.pageNo - 1) * $scope.page.pageSize + "&limit=" + $scope.page.pageSize).then(function (rs) {
            if (rs.data.code == 0) {
                $scope.tradeList = rs.data.result.tradeList;
                $scope.page = rs.data.result.page;
            } else {
                alert(rs.data.errorMsg);
            }
        }).catch(function (rs) { //捕捉错误处理

        });
    }

    $scope.previous = function () {
        if ($scope.page.totalCount > 0 && $scope.page.pageNo > 1) {
            $scope.page.pageNo -= 1;
            getList();
        }
    };
    $scope.next = function () {
        if ($scope.page.totalCount > 0
            && $scope.page.pageNo < $scope.page.pageCount) {
            $scope.page.pageNo += 1;
            getList();
        }
    };
    $scope.first = function () {
        if ($scope.page.totalCount > 0 && $scope.page.pageNo > 1) {
            $scope.page.pageNo = 1;
            getList();
        }
    };
    $scope.last = function () {
        if ($scope.page.totalCount > 0
            && $scope.page.pageNo < $scope.page.pageCount) {
            $scope.page.pageNo = $scope.page.pageCount;
            getList();
        }
    };


    $scope.updateReceive = function (tradeID) {
        $http({
            method: 'POST',
            url: Request_URL + "/trade/receive",
            params: {tradeID: tradeID}
        }).then(function (rs) {
            $rootScope.layer("收货成功!");

        }).catch(function (rs) { //捕捉错误处理

        });
    }


})

//个人资料

myApp.controller('my_center-personalData', function ($rootScope, $scope, $http, $state, $timeout, fileReader, SignService) {
    $scope.imageSrc = null;
    $scope.imageSrc1 = null;
    // console.log($scope.gData.userData.picUrl)
    // console.log($scope.gData.userData)
            $scope.submits = function () {
        console.log($rootScope.gData.userData)
        debugger;
                SignService.getHttp("/account/live").then(function (result) {
                    $rootScope.gData.code = result.code;
                    $rootScope.gData.messages = result.message;
                    if ($rootScope.gData.code == 0 && $rootScope.gData.messages == "在线") {
                        $http({
                            method: 'POST',
                            url: Request_URL + "/account/modify",
                            data: $rootScope.gData.userData,
                            headers: {'Content-Type': 'application/json'}
                        }).then(function (result) {
                            $rootScope.layer("修改个人资料成功!")
                        });
                    }else {
                        $rootScope.layer1("登录超时，请登陆!", "/login")
                    };
                });
            }
    $scope.getFile = function (nameid) {
        fileReader.readAsDataUrl($scope.file, $scope)
            .then(function (result) {
                $scope.save(nameid);
                if ($scope.id == 'touXiang') {
                    $scope.imageSrc = result;
                } else if ($scope.id == 'YYzhiZhao') {
                    $scope.imageSrc1 = result;
                }
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
                var urlimg = rs.data
                if ($scope.id == 'touXiang') {
                    $scope.gData.userData.picUrl = urlimg.substr(2, urlimg.length - 2);
                } else if ($scope.id == 'YYzhiZhao') {
                    $scope.gData.userData.companyPicUrl = urlimg.substr(2, urlimg.length - 2);
                }
            })
    }
    /*$scope.fileNameChanged = function (files) {
     if(!(files[0].type.indexOf("image")!=-1)){
     alert('只能上传图片');
     return;
     }

     $http({
     method:'POST',
     url:Request_URL+'/file/getOssSign',
     params:{
     'fileName':files[0].name
     }
     }).then(function (rs) {
     var host = rs.data.host;
     var policyBase64 = rs.data.policy;
     var accessid = rs.data.accessid;
     var signature = rs.data.signature;
     var expire = parseInt(rs.data.expire);
     var key = rs.data.path;
     var cdnHost = rs.data.cdnHost;
     $scope.key = key;
     $scope.policy = policyBase64;
     $scope.OSSAccessKeyId = accessid;
     $scope.success_action_status = 200;
     $scope.Signature = signature;
     console.log(cdnHost+"/"+key );
     $http({
     method:'POST',
     url:host,
     params:{
     'key':key,
     'policy':policyBase64,
     'OSSAccessKeyId':accessid,
     'success_action_status':200,
     'Signature':signature
     }
     }).then(function (rs1) {
     console.log(rs1)
     })

     }).catch(function (rs) { //捕捉错误处理

     });
     }*/
})

//待收货

myApp.controller('my_center-Receiving', function ($rootScope, $scope, $http, $state, $timeout) {
})

//安全设置

myApp.controller('my_center-scurity', function ($rootScope, $scope, $http, $state, $timeout) {
})