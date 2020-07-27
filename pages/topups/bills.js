// pages/topups/bil.js
let app =  getApp();

  
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:'',
        detail:{}
    },
    rechargeDetail:function(){
        var that = this;
        app.request({
            url: "/member/rechargeDetail",
            data:{id:that.data.id},
            method: 'post',
            success: function (res) {
                that.setData({
                    detail:res.data
                })
            },
        })
    },
    //预览图片，放大预览
    preview() {
        var that=this;
        var imgs=[that.data.detail.code];
        let currentUrl = that.data.detail.code
        wx.previewImage({
            current: currentUrl, // 当前显示图片的http链接
            urls:imgs // 需要预览的图片http链接列表
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id:options.id
        })
        this.rechargeDetail();
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