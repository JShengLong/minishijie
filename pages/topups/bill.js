// pages/topups/bil.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        datas: {},
    },
    get_data: function () {
        var that = this;
        app.request({
            load: false,
            url: "/member/walletInfo",
            data: {
                id: that.data.id
            },
            method: 'post',
            success: function (res) {
                console.log(res)
                that.setData({
                    datas: res.data
                })
            }
        })
    },
    info: function () {
        var that = this;
        switch (that.data.datas.b_type) {
            case 1:

                break;

            case 2:
                wx.navigateTo({
                    url: '/pages/myorder/details?o_id=' + that.data.datas.b_oid,
                })
                break;
            case 3:
                wx.navigateTo({
                    url: '/pages/myorder/refundDetails?id=' + that.data.datas.b_oid,
                })
                break;

        }
        // if(that.data.b_type==1){

        // }else if(that.data.b_type==2){

        // }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id
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
        this.get_data();
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