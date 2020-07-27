// pages/order/order.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectindex: 0,
        select: ['普通快递', '圆通快递', '中通快递'],
        code: "35004452100211",
        id: '', //订单id
        details: {},
        storageRoom: {},
        showPayPwdInput: false, //是否展示密码输入层
        payFocus: true, //文本框焦点
        payment_password:'',
    },
    //再次购买
    looks: function (e) {
        var that = this;
        if (that.data.details.xiadan_type == "cart") {
            wx.navigateTo({
                url: '../order/order?c_id=' + that.data.details.c_id
            })
        } else {
            wx.navigateTo({
                url: '../order/order?p_id=' + that.data.details.p_id + '&num=' + that.data.details.num + '&sku_id=' + that.data.details.sku_id + '&c_id=',
            })
        }
    },
    // 一键复制事件
    copyBtn: function (e) {
        var that = this;
        wx.setClipboardData({
            //准备复制的数据
            data: that.data.code,
            success: function (res) {
                wx.showToast({
                    title: '复制成功',
                });
            }
        });
    },
     //去付款
     pay: function (e) {
        wx.navigateTo({
            url: '../pay/pay?id=' + this.data.id
        })
    },
     //查看物流
     looklogic: function (e) {
        wx.navigateTo({
            url: '../myorder/logistics?o_id=' + this.data.id
        })
    },
    //收货
    sure: function (e) {
        console.log(e)
        var that=this;
        wx.showModal({
            title: '提示',
            content: e.currentTarget.dataset.info,
            showCancel: true,
            cancelText: '取消',
            success:function(res){
                if (res.confirm) {
                    // that.setData({ 
                    //     showPayPwdInput: true,
                    //     payFocus: true ,
                    // }); 
                    app.request({
                        load: false,
                        url: "/member/confirmOrder",
                        data: {
                            id:that.data.id,
                        },
                        method: 'post',
                        success: function (res) {
                            if(res.code==0){
                                app.msg(res.msg);
                            }else{
                                that.get_data();
                                // wx.navigateTo({
                                //     url: '../evaluation/write?o_id='+this.data.id,
                                // })
                            }
                        },
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    /**
     * 退款中
     */
    ing:function(e){
        wx.navigateTo({
            url: '/pages/myorder/refundDetails?id=' + e.currentTarget.dataset.id,
        })
    },
    /**
     * 隐藏支付密码输入层
     */
    hidePayLayer: function () {
        /**获取输入的密码**/
        var val = this.data.payment_password;
        /**在这调用支付接口**/
        this.setData({
            showPayPwdInput: false,
            payFocus: false,
            payment_password: ''
        });
        return val;

    },
    confirmOrder:function(val){
        var that=this;
        app.request({
            load: false,
            url: "/member/confirmOrder",
            data: {
                id:that.data.id,
                payment_password:val
            },
            method: 'post',
            success: function (res) {
                if(res.code==0){
                    app.msg(res.msg);
                }else{
                    that.get_data();
                    // wx.navigateTo({
                    //     url: '../evaluation/write?o_id='+this.data.id,
                    // })
                }
            },
        })
    },
     /**
     * 获取焦点
     */
    getFocus: function () {
        this.setData({
            payFocus: true
        });
    },
    /**
     * 输入密码监听
     */
    inputPwd: function (e) {
        this.setData({
            payment_password: e.detail.value
        });

        if (e.detail.value.length >= 6) {
            var val=this.hidePayLayer();
            this.confirmOrder(val);
        }
    },
    //删除
    delete: function (e) {
        var that=this;
        wx.showModal({
            title: '提示',
            content: '删除订单？',
            showCancel: true,
            cancelText: '取消',
            success:function(res) {
                if(res.confirm){
                    app.request({
                        load: false,
                        url: "/member/delOrder",
                        data: {
                            id:that.data.id,
                        },
                        method: 'post',
                        success: function (res) {
                            if(res.code==0){
                                app.msg(res.msg);
                            }else{
                                wx.navigateBack({
                                    delta: 1
                                  })
                            }
                        },
                    })
                }else{
                    console.log('用户点击了取消')
                }
            }
        })
    },
    //取消订单
    cancel: function (e) {
        var that=this;
        wx.showModal({
            title: '提示',
            content: '取消订单？',
            showCancel: true,
            cancelText: '取消',
            success: function (res) {
                if (res.confirm) {
                    app.request({
                        load: false,
                        url: "/member/cancelOrder",
                        data: {
                            id:that.data.id,
                        },
                        method: 'post',
                        success: function (res) {
                            if(res.code==0){
                                app.msg(res.msg);
                            }else{
                                that.get_data();
                                that.get_data1();
                            }
                        },
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    //评价
    write: function () {
        console.log(1)
        wx.navigateTo({
            url: '../evaluation/write?o_id='+this.data.id,
        })
    },
    //退款申请
    refund: function (e) {
        wx.navigateTo({
            url: '../myorder/refund?o_id='+this.data.id+'&d_id='+e.currentTarget.dataset.id
        })
    },
    get_data: function () {
        var that = this;
        app.request({
            load: false,
            url: "/member/orderDetails",
            data: {
                o_id: that.data.id
            },
            method: 'post',
            success: function (res) {
                console.log("详情", res)
                that.setData({
                    details: res.data,
                    code: res.data.o_sn
                })
            },
        })
    },
    get_data1: function () {
        var that = this;
        app.request({
            load: false,
            url: "/order/storageRoom",
            method: 'post',
            success: function (res) {
                console.log("详情", res)
                that.setData({
                    storageRoom: res.data,
                })
            },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.o_id) {
            this.setData({
                id: options.o_id,
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // app.sigin();
        this.get_data();
        this.get_data1();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})