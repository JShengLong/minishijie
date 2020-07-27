// pages/wallet/wallet.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentData:1,
        member:{},
        page:1,
        list:[],
    },
    // tab切换
    changeTab: function(e) {
        const that = this;
        that.setData({
            page:1,
            list:[],
            currentData: e.currentTarget.dataset.current
        })
        that.get_data();
    },
    get_data:function() {
        var that=this;
        app.request({
            load: false,
            url: "/member/myWallet",
            data: {
                type:that.data.currentData,
                page: that.data.page,
            },
            method: 'post',
            success: function (res) {
                console.log("数据", res);
                var list=that.data.list;
                list=list.concat(res.data);
                that.setData({
                    list:list
                })
            }
        })
    },
    info:function(e){
        wx.navigateTo({
          url: '/pages/topups/bill?id='+e.currentTarget.dataset.id,
        })
    },
    member_info:function() {
        var that=this;
        app.request({
            load: false,
            url: "/member/member",
            method: 'post',
            success: function (res) {
                console.log(res)
                that.setData({
                    member:res.data
                })
            }
        }) 
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
       
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.get_data();
        this.member_info();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        this.setData({
            list:[],
            page:1,
            currentData:"1",
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var that=this;
        that.setData({
            page:that.data.page+1,
        })
        that.get_data();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})