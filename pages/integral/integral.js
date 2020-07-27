// pages/integral/integral.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentData: 1,
        member:{},
        page:1,
        list:[],
    },

    // tab切换
    changeTab: function(e) {
        const that = this;
        that.setData({
            currentData: e.currentTarget.dataset.current,
            page:1,
            list:[],
        })
        that.get_data();
    },
    /**
     * 查看订单详情
     */
    look:function(e){
     wx.navigateTo({
       url: '../myorder/details?o_id='+e.currentTarget.dataset.b_item_id,
     })
    },
    get_data:function() {
        var that=this;
        app.request({
            load: false,
            url: "/member/integralList",
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
    bill:function(e) {
        console.log(e);
        wx.navigateTo({
          url: '/pages/integral/bill?id='+e.currentTarget.dataset.id+'&info='+e.currentTarget.dataset.info+'&isplus='+e.currentTarget.dataset.isplus+'&time='+e.currentTarget.dataset.time+'&total='+e.currentTarget.dataset.total,
          complete: (res) => {},
          fail: (res) => {},
          success: (result) => {},
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.get_data();
        this.member_info();
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
        
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
    
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