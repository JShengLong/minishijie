// pages/myorder/myorder.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentData: 0,
        list: [0, 1, 2],
        status: '', //状态
        order_list: [], //订单列表
        page: 1, //分页
        payment_password: '',
        showPayPwdInput: false, //是否展示密码输入层
        payFocus: true, //文本框焦点
        id:'',
    },
    // tab切换
    changeTab: function (e) {
        const that = this;
        that.setData({
            currentData: e.currentTarget.dataset.current,
            page: 1,
            status: e.currentTarget.dataset.current,
            order_list: [],
        })
        that.get_data();
    },
    //去付款
    pay: function (e) {
        wx.navigateTo({
            url: '../pay/pay?id=' + e.currentTarget.dataset.id
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
                    //     id:e.currentTarget.dataset.id,
                    // }); 
                    app.request({
                        load: false,
                        url: "/member/confirmOrder",
                        data: {
                            id:e.currentTarget.dataset.id,
                        },
                        method: 'post',
                        success: function (res) {
                            if(res.code==0){
                                app.msg(res.msg);
                            }else{
                                // wx.navigateTo({
                                //     url: '../evaluation/write?o_id='+that.data.id,
                                // })
                                that.setData({
                                    order_list:[],
                                    page:1
                                })
                                that.get_data();
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
                    wx.navigateTo({
                        url: '../evaluation/write?o_id='+that.data.id,
                    })
                    // that.setData({
                    //     order_list:[],
                    //     page:1
                    // })
                    // that.get_data();
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
                            id:e.currentTarget.dataset.id,
                        },
                        method: 'post',
                        success: function (res) {
                            if(res.code==0){
                                app.msg(res.msg);
                            }else{
                                that.setData({
                                    order_list:[],
                                    page:1
                                })
                                that.get_data();
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
                            id:e.currentTarget.dataset.id,
                        },
                        method: 'post',
                        success: function (res) {
                            if(res.code==0){
                                app.msg(res.msg);
                            }else{
                                that.setData({
                                    order_list:[],
                                    page:1
                                })
                                that.get_data();
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
    write: function (e) {
        console.log(1)
        wx.navigateTo({
            url: '../evaluation/write?o_id='+e.currentTarget.dataset.id,
        })
    },
    //订单详情
    look: function (e) {
        wx.navigateTo({
            url: '../myorder/details?o_id=' + e.currentTarget.dataset.id
        })
    },
    //再次购买
    looks:function(e){
        var that=this;
        app.request({
            load: false,
            url: "/order/corder",
            data: {
                id:e.currentTarget.dataset.id,
            },
            method: 'post',
            success: function (res) {
                if(res.data.xiadan_type=="cart"){
                    wx.navigateTo({
                        url: '../order/order?c_id='+res.data.c_id
                    })
                }else{
                    wx.navigateTo({
                        url: '../order/order?p_id='+res.data.p_id+'&num='+res.data.num+'&sku_id='+res.data.sku_id+'&c_id=',
                    })
                }
            },
        })
    },
    //查看物流
    looklogic: function (e) {
        wx.navigateTo({
            url: '../myorder/logistics?o_id=' + e.currentTarget.dataset.id
        })
    },
    //申请退款
    refund: function (e) {
        // wx.navigateTo({
        //     url: '../myorder/refund'
        // })
        wx.navigateTo({
            url: '../myorder/details?o_id=' + e.currentTarget.dataset.id
        })
    },
    get_data: function () {
        var that = this;
        app.request({
            load: false,
            url: "/member/myOrderList",
            data: {
                status: that.data.status,
                page: that.data.page
            },
            method: 'post',
            success: function (res) {
                console.log("订单列表", res)
                var order_list = that.data.order_list;
                order_list = order_list.concat(res.data)
                that.setData({
                    order_list: order_list
                })
            },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.status) {
            this.setData({
                status: options.status
            })
        }
        if (options.currentData) {
            this.setData({
                currentData: options.currentData
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
        this.get_data();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({
            order_list:[],
            page:1,
        })
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
        var that = this;
        that.setData({
            page: that.data.page + 1,
        })
        that.get_data();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})