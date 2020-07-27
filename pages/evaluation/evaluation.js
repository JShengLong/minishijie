// pages/evaluation/evaluation.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgList: [
            "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=508387608,2848974022&fm=26&gp=0.jpg",
            "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1022109268,3759531978&fm=26&gp=0.jpg",
            "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3139953554,3011511497&fm=26&gp=0.jpg"
        ], //评论图片
        id:'',
        page:1,
        list:[],
        star:[],
        stars:[],
    },
    //预览图片，放大预览
    preview(event) {
        var imgs=this.data.list[event.currentTarget.dataset.index].img;
        console.log(imgs);
        console.log(event.currentTarget.dataset.src)
        let currentUrl = event.currentTarget.dataset.src
        wx.previewImage({
            current: currentUrl, // 当前显示图片的http链接
            urls:imgs // 需要预览的图片http链接列表
        })
    },
    get_list:function() {
        var that = this;
        app.request({
            load:false,
            url: "/product/productComment",
            data: {
                p_id: that.data.id,
                page:that.data.page
            },
            method: 'post',
            success: function(res) {
                console.log("评价列表", res)
                var list=that.data.list;
                list=list.concat(res.data);
               
                that.setData({
                    list:list
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            id:options.id
        })
        this.get_list();
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
        this.get_list();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})