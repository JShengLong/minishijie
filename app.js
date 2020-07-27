//app.js
App({

    //数据
    data: {
        url: "http://shijie.581vv.com/mini"
        // url: "http://huishou.cn:1000/api"
        // url: "http://shijie.com/mini"
    },
    //------------------------
    //	初始化
    //------------------------
    onLaunch: function () {
        var that = this;
        that.request({
            load: false,
            url: "/login/userAgreement",
            data: {
                code: 'mininame'
            },
            method: 'post',
            success: function (res) {
                console.log("用户信息", res)
                wx.setNavigationBarTitle({
                    title: res.data
                })
            },
        })
    },


    //------------------------
    //	发送请求
    //------------------------
    request: function (obj) {
        var that = this;
        try {

            //	顶部转圈效果
            if (obj.load) {
                that.loading()
            } else {
                // that.pull();
            }

            //	定义数据传输数组
            obj.data = obj.data ? obj.data : {};

            obj.data["token"] = wx.getStorageSync('token') ? wx.getStorageSync('token') : "";

            //	定义传输类型,默认为POST
            obj.method = obj.method ? obj.method : "GET";

            //	定义数据类型,默认为json
            obj.dataType = obj.dataType ? obj.dataType : "json";
            // console.log(111,obj.data);
            //	发起请求
            wx.request({
                //	默认header
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                //	API网址由本文件顶部配置,后面跟控制器和方法
                url: that.data.url + obj.url,
                //	请求数据
                data: obj.data,
                //	请求类型
                method: obj.method,
                //	请求成功返回
                success: function (rs) {
                    console.log('request', rs);
                    if (rs.statusCode == 500 || rs.statusCode == 404) {
                        that.msg('网络异常');
                    }
                    if (rs.data.code == -1) {
                        // wx.navigateTo({
                        //     url: "/pages/authorization/authorization"
                        // })
                    }
                    //	加载效果


                    //	回调函数
                    obj.success ? obj.success(rs.data) : function () { };
                    if (obj.load) {
                        wx.hideLoading()
                    } else {
                        // that.pullEnd();
                    }

                },
                //	请求失败
                fail: function (rs) {

                    //	加载效果
                    if (obj.load) {
                        wx.hideLoading()
                    } else {
                        that.pullEnd();
                    }

                },
                //	无论成功失败都返回
                complete: function (rs) {

                    //	加载效果
                    if (obj.load) {
                        wx.hideLoading()
                    } else {
                        that.pullEnd();
                    }

                }
            })
        } catch (e) {
            console.log(e);
        }
    },


    //------------------------
    //	加载效果
    //------------------------
    loading: function () {
        wx.showLoading({
            title: "加载中",
            mask: true,
        })
    },


    //------------------------
    //	提示信息
    //------------------------
    msg: function (obj) {

        if (typeof obj == "string") {

            wx.showToast({
                'title': obj,
                'icon': 'none',
                duration: 3000,
            });
            return;

        }

        //	标题
        obj.title = obj.title ? obj.title : "系统提示";

        //	信息
        obj.value = obj.value ? obj.value : "提示信息";

        //	跳转页面
        obj.url = obj.url ? obj.url : "";

        //	确定文本
        obj.confirmText = obj.confirmText ? obj.confirmText : "确定";

        //	取消按钮
        obj.cancel = obj.cancel ? obj.cancel : false;

        //	是否关闭当前页面
        obj.close = obj.close ? obj.close : false;

        //	取消文本
        obj.cancelText = obj.cancelText ? obj.cancelText : "取消";

        //	调起
        wx.showModal({
            title: obj.title,
            content: obj.value,
            confirmText: obj.confirmText,
            showCancel: obj.cancel,
            cancelText: obj.cancelText,
            success: function (res) {

                switch (obj.url) {
                    case 'back':
                        wx.navigateBack();
                        return false;
                        break;
                    case "":
                        obj.success ? obj.success(res) : function () { };
                        break;
                    default:
                        if (obj.close) {
                            wx.redirectTo({
                                url: obj.url,
                            })
                        } else {
                            wx.navigateTo({
                                url: obj.url,
                            })
                        }
                        break;
                }
            },

        })
    },


    //------------------------
    //	下拉
    //------------------------
    pull: function () {
        wx.showNavigationBarLoading();
        wx.stopPullDownRefresh();
    },


    //------------------------
    //	关闭下拉效果
    //------------------------
    pullEnd: function () {
        wx.hideNavigationBarLoading()
    },


    //------------------------
    //	加载效果
    //------------------------
    load: function () {

        wx.showLoading({
            title: "加载中",
            mask: true,
        });

        setTimeout(function () {
            wx.hideLoading();
        }, 300)

    },


    //------------------------
    //	分享返回数据
    //------------------------
    share: function (obj) {

        //	获取加载的页面
        var pages = getCurrentPages();

        var currentPage = pages[pages.length - 1] //获取当前页面的对象

        if (obj) {
            var url = "/" + currentPage.route //当前页面url
        } else {
            var url = "/pages/index/index";
        }

        var options = currentPage.options;

        url = url + "?user_id=" + that.wechat().id;

        //  话题
        if (options.topic_id) {
            url = url + "&topic_id=" + options.topic_id;
        }

        //  产品
        if (options.product_id) {
            url = url + "&product_id=" + options.product_id;
        }

        var share = {
            title: '为你推荐',
            desc: '为你推荐',
            path: url,
        };

        console.log(share);

        return share;

    },
    //验证登录

    sigin: function (obj) {
        //	回调函数
        var that = this;
        that.request({
            url: '/member/isLogin',
            method: 'post',
            success: function (res) {
                if (res.code == -1) {
                    wx.showModal({
                        title: '去登录',
                        content: '检测到您未登录，确定跳转登录页面？',
                        showCancel: true,
                        cancelText: '取消',
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: "/pages/authorization/authorization"
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })

                    // that.msg('请进入个人中心授权登录');

                } else {
                    obj.success ? obj.success() : function () { };
                }
            }
        })
    }

})