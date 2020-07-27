// pages/myorder/logistics.js
var WxParse = require('../../wxParse/wxParse.js');
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:'',
        storageRoom:{},
        details:{},

    },
    get_data:function(){
        var that = this;
        app.request({
            load: false,
            url: "/member/viewLogistics",
            data:{
                o_id:that.data.id
            },
            method: 'post',
            success: function (res) {
                console.log("详情", res)
                that.setData({
                    details:res.data,
                })
                if(res.data.order.o_distribution_mode==1||res.data.order.o_distribution_mode==4){
                    WxParse.wxParse('article', 'html',  res.data.logistics, that,0);
                }
            },
        })
    },
    get_data1:function(){
        var that = this;
        app.request({
            load: false,
            url: "/order/storageRoom",
            method: 'post',
            success: function (res) {
                console.log("详情", res)
                that.setData({
                    storageRoom:res.data,
                })
            },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id:options.o_id,
        })
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
        app.sigin();
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