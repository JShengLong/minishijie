// pages/myorder/myorder.js
let app =  getApp();

  
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        m_id:'',//客户id
        page:1,
    },
    details: function () {
        wx.navigateTo({
            url: '../details/details'
        })
    },
    /**
     * 客户订单列表
     */
    customerOrder:function(){
        var that=this;
        app.request({
            load: false,
            url: "/member/customerOrder",
            data:{
                m_id:that.data.m_id,
                page:that.data.page 
            },
            method: 'post',
            success: function (res) {
                var list=that.data.list;
                list=list.concat(res.data);
                console.log(res)
                that.setData({
                    list:list,
                })
            }
        }) 
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            m_id:options.m_id
        })
        this.customerOrder();
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
        this.setData({
            page:this.data.page+1
        })
        this.customerOrder();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})