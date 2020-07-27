// pages/myorder/myorder.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        page: 1,
    },
    //删除
    delete: function (e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '删除订单？',
            showCancel: true,
            cancelText: '取消',
            success: function (res) {
                if (res.confirm) {
                    app.request({
                        load: false,
                        url: "/member/delRefund",
                        data: {
                            id: e.currentTarget.dataset.id
                        },
                        method: 'post',
                        success: function (res) {
                            if (res.code == 0) {
                                app.msg(res.msg);
                            } else {
                                that.setData({
                                    page: 1,
                                    list: [],
                                })
                                that.get_list();
                            }

                        },
                    })
                } else {
                    console.log('用户点击了取消')
                }
            }
        })
    },
    //订单详情
    look: function (e) {
        wx.navigateTo({
            url: '../myorder/refundDetails?id=' + e.currentTarget.dataset.id
        })
    },
    //订单详情
    refund: function (e) {
        wx.navigateTo({
            url: '../myorder/refund?o_id=' + e.currentTarget.dataset.o_id + '&d_id=' + e.currentTarget.dataset.d_id
        })
    },
    details: function (e) {
        wx.navigateTo({
            url: '../myorder/refundDetails?id=' + e.currentTarget.dataset.id
        })
    },
    get_list: function () {
        var that = this;
        app.request({
            load: false,
            url: "/member/refundList",
            data: {
                page: that.data.page
            },
            method: 'post',
            success: function (res) {
                console.log(res.data)
                var list = that.data.list;
                list = list.concat(res.data);
                that.setData({
                    list: list,
                })

            },
        })
    },
    //再次购买
    looks: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../order/order?p_id=' +  e.currentTarget.dataset.p_id + '&num=' +  e.currentTarget.dataset.num + '&sku_id=' + e.currentTarget.dataset.sku_id + '&c_id=',
        })

    },
    /**
     * 
     * 填写物流单号
     * @param {*} 
     */
    writelogistics: function (e) {
        wx.navigateTo({
            url: '../myorder/writelogistics?id=' + e.currentTarget.dataset.id
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.get_list();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({
            list:[],
            page:1
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
        this.setData({
            page: this.data.page + 1
        })
        this.get_list();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})