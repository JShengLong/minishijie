// pages/address/address.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page:1,
        list:[],
        check:['','checked',''],
    },
    //删除
    delete:function(e){
        var that=this;
        wx.showModal({
            title: '提示',
            content: '确认删除此地址吗?',
            success:function(res){
                if(res.confirm){
                    app.request({
                        load: false,
                        url: "/member/deleteAddress",
                        data: {
                            id: e.currentTarget.dataset.id,
                        },
                        method: 'post',
                        success: function (res) {
                            if(res.code==0){
                                app.msg(res.msg);
                            }else{
                                that.setData({
                                    list:[],
                                    page:1,
                                })
                                that.get_list();
                            }
                           
                        }
                    })
                }else{
                    console.log('用户点击取消')
                }
            }
        })
    },
    //编辑跳转
    edit:function(e){
        wx.navigateTo({
            url: '../address/modify?id='+e.currentTarget.dataset.id
        })
    },
    defl:function (e) {
        console.log(e.currentTarget.dataset.index);  
        app.request({
            load: false,
            url: "/member/setDefault",
            data: {
                id: e.currentTarget.dataset.index,
            },
            method: 'post',
            success: function (res) {
               app.msg(res.msg);
            }
        })
    },
    get_list:function(){
        var that=this;
        app.request({
            load: false,
            url: "/member/myAddress",
            data: {
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
        this.get_list();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({
            list:[],
            page:1,
        })
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
        this.setData({
            page:this.data.page+1,
        })
        this.get_list();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})