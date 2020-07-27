// pages/address/modify.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        region: ['请选择', '请选择', '请选择'],
        regions:'',
        code:'',
        name:'',
        phone:'',
        address:'',
        id:'',
    },

    //选择地址
    bindRegionChange: function (e) {
        console.log('picker发送选择改变，携带值为', e)
        this.setData({
            region: e.detail.value,
            regions:e.detail.value.join('-'),
            code: e.detail.code[2],
        })
    },
    update_name:function(e) {
        this.setData({
            name:e.detail.value,
        })
    },
    update_phone:function(e) {
        this.setData({
            phone:e.detail.value,
        })
    },
    update_address:function(e) {
        this.setData({
            address:e.detail.value,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that=this;
        if(options.id){
            wx.setNavigationBarTitle({
                title: '修改地址'
             })
            that.setData({
                id:options.id
            })
            that.get_address();
        }
    },
    get_address:function() {
        var that=this;
        app.request({
            load: false,
            url: "/member/editAddress",
            data: {
                id:that.data.id,
            },
            method: 'post',
            success: function (res) {
                var region=res.data.name_path.split('-');
                that.setData({
                    name:res.data.name,
                    phone:res.data.phone,
                    code:res.data.regionId,
                    address:res.data.address,
                    region:region,
                    regions:res.data.nam_path,
                })
            }
        })
    },
    save:function(){
        var that=this;
        app.request({
            load: false,
            url: "/member/instartAddress",
            data: {
                id:that.data.id,
                name:that.data.name,
                phone:that.data.phone,
                regionId:that.data.code,
                address:that.data.address,
                name_path:that.data.regions
            },
            method: 'post',
            success: function (res) {
                if(res.code==0){
                    app.msg(res.msg);
                }else{
                    wx.navigateBack({
                        delta:-1,
                    })
                }
            }
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