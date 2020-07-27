// pages/contact/contact.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        contact:'',
        customer:'',
    },

    contact:function(){
        var that = this;
        app.request({
            load: false,
            url: "/login/userAgreement",
            method: 'post',
            data:{
                code:'customer '
            },
            success: function (res) {
                console.log("人工客服", res)
                that.setData({
                    contact:res.data
                })
                
            },
        })
    },
    customer:function(){
        var that = this;
        app.request({
            load: false,
            url: "/login/userAgreement",
            method: 'post',
            data:{
                code:'customer_time  '
            },
            success: function (res) {
                console.log("客服工作时间", res)
                that.setData({
                    customer:res.data
                })
                
            },
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
        this.contact();
        this.customer();
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