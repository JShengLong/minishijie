// pages/list/list.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wishList: [{
                collected: 1,
                id: 1
            },
            {
                collected: 0,
                id: 2
            },
            {
                collected: 1,
                id: 3
            },
            {
                collected: 1,
                id: 4
            },
            {
                collected: 0,
                id: 5
            },
            {
                collected: 0,
                id: 6
            }
        ],
        page:1,
        list:[],
    },
    //跳转详情页
    godetails: function(e) {
        wx.navigateTo({
            url: '../details/details?p_id='+e.currentTarget.dataset.id
        })
    },
    // 更改收藏状态
    onCollectionTap: function(event) {
        // 获取当前点击下标
        var index = event.currentTarget.dataset.index;
        // data中获取列表
        var message = this.data.wishList;
        for (let i in message) { //遍历列表数据
            if (i == index) { //根据下标找到目标
                var collectStatus = false
                if (message[i].collected == 0) { //如果是没点赞+1
                    collectStatus = true
                    message[i].collected = parseInt(message[i].collected) + 1
                    message[i].dzzs = parseInt(message[i].dzzs) + 1
                } else {
                    collectStatus = false
                    message[i].collected = parseInt(message[i].collected) - 1
                    message[i].dzzs = parseInt(message[i].dzzs) - 1
                }
                wx.showToast({
                    title: collectStatus ? '收藏成功' : '取消收藏',
                })
            }
        }
        this.setData({
            wishList: message
        })
    },
    get_list:function(){
        var that=this;
        app.request({
            load: false,
            url: "/member/myCollection",
            data: {
                id:that.data.id,
            },
            method: 'post',
            success: function (res) {
                var list=that.data.list;
                list=list.concat(res.data);
                that.setData({
                    list:list   
                })
            }
        })

    },
    quxiao:function(e) {
        console.log(e);
        var that=this;
        app.request({
            load: false,
            url: "/product/collection",
            data: {
                p_id:e.currentTarget.dataset.id,
            },
            method: 'post',
            success: function (res) {
               app.msg('取消成功');
               that.setData({
                   list:[],
                   page:1
               })
               that.get_list();
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
        this.get_list();
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
            page:this.data.page+1,
        })
        this.get_list();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})