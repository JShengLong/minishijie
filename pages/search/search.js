// pages/search/search.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        history: false,
        hislist: [0, 1, 2],
        tuijian_data:[],//热门推荐
        search_data:[],//历史记录
        ins:'',//输入的内容
        count:0,
    },
    // //搜素
    // search: function() {
    //     wx.navigateTo({
    //         url: '../search/result'
    //     })
    // },
    //清除
    clear: function() {
        var that=this;
        wx.showModal({
            title: '温馨提示',
            content: '确认清空历史记录？',
            showCancel: true,
            success: function (res) {
                if (res.confirm) {
                    app.request({
                        load: false,
                        url: "/member/emptyHistorySearch",
                        method: 'post',
                        success: function (res) {
                            if(res.code==0){
                                app.msg(res,msg);
                            }else{
                                that.search();
                            }
                        },
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
                
            },
            fail: function (res) {},
            complete: function (res) {},
        })  
    },
    //推荐
    request_data:function(){
        var that = this;
        app.request({
            url: "/login/userAgreement",
            method: 'post',
            data:{
                code:'tuijianbiaoqian'
            },
            success: function (res) {
                that.setData({
                    tuijian_data:res.data
                })
                
            }
        })
    },
    //历史记录
    search:function(){
        var that = this;
        app.request({
            url: "/Search/historySearch",
            method: 'post',
            success: function (res) {
                    that.setData({
                        search_data:res.data,
                        count:res.data.length
                    })

            }
        })
    },
    /**
     * 获取输入框输入的内容
     */
    ins:function(e){
        var that=this;
        that.setData({
            ins: e.detail.value
        })
    },
    /**
     * 热门推荐搜索
     */
    remen:function(e){
        var that = this;
        wx.navigateTo({
            url: '/pages/search/result?search_data=' + e.currentTarget.dataset.value,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },
    /**
     * 搜索事件
     */
    btn:function(){
        var that=this;
        // if (that.data.ins==''){
        //     app.msg('请输入搜索内容')
        // }
        wx.navigateTo({
            url: '/pages/search/result?search_data='+that.data.ins,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
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
        this.request_data();
        this.search();
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})