// pages/personal/data.js
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        member_data:{},
        avatar: '../../images/head.png',
        nickname:'',
        in:'',
    },
    // 切换头像
    changeAvatar: function() {
        var that = this;
        wx.chooseImage({
            count: 1, // 最多可以选择的图片张数，默认9
            sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function(res) {
                wx.uploadFile({
                    url: app.data.url + '/member/updateHeadImg', //接口
                    filePath: res.tempFilePaths[0],
                    name: 'image',
                    formData: {
                        token:wx.getStorageSync('token') ? wx.getStorageSync('token') : ""
                    },
                    success: function (res) {
                       
                        var res1=JSON.parse(res.data);
                        console.log(res1)
                        if(res1.code==1){
                            app.msg('修改头像成功');
                            var member=that.data.member_data;
                            member.m_thumb=res1.data.url
                            that.setData({
                                member_data:member
                            })  
                        }
                    },
                    fail: function (error) {
                        console.log(error);
                        app.msg('上传失败')
                    }
                })

                var avatar = res.tempFilePaths;
                that.setData({
                    avatar: avatar,
                })

            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },
    member_info:function(){
        var that = this;
        app.request({
            load: false,
            url: "/member/member",
            method: 'post',
            success: function (res) {
                console.log("用户信息", res)
                that.setData({
                    member_data:res.data,
                    nickname:res.data.m_nickname
                })
            },
        })
    },
    updatenickname:function(e){
        this.setData({
            nickname:e.detail.value
        })
    },
    updatein:function(e){
        this.setData({
            in:e.detail.value
        })
    },
    /**
     * 保存
     */
    btn:function(){
        var that = this;
        if(that.data.nickname==''){
            app.msg('请输入昵称');
            return;
        }
        app.request({
            load: true,
            url: "/member/updateNickname",
            method: 'post',
            data:{
                name:that.data.nickname,
                in:that.data.in
            },
            success: function (ress) {
                wx.hideLoading({
                    complete: (res) => {
                        app.msg(ress.msg)
                    },
                  })
            },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})