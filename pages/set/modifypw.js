// pages/set/modifypw.js
var interval = null //倒计时函数
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: '请选择日期',
        fun_id: 2,
        time: '获取验证码', //倒计时 
        currentTime: 60,
        phone:'',
        is_code:false,
        pwd1:'',
        pwd2:'',
        code:'',
    },
    getCode: function (options) {
        var that = this;
        app.request({
            load: false,
            url: "/login/sendSms",
            method: 'post',
            data: {
                phone: that.data.phone,
                type: 'update_paypwd'
            },
            success: function (res) {
                if (res.code == 0) {
                    app.msg(res.msg);
                } else {
                    app.msg(res.msg);
                    that.setData({
                        disabled: true,
                        is_code: true,
                    })
                    var currentTime = that.data.currentTime
                    interval = setInterval(function () {
                        currentTime--;
                        that.setData({
                            time: currentTime + '秒'
                        })
                        if (currentTime <= 0) {
                            clearInterval(interval)
                            that.setData({
                                time: '获取验证按',
                                currentTime: 60,
                                disabled: false
                            })
                        }
                    }, 1000)
                }
            },
        })
    },
    getVerificationCode() {
        this.getCode();
    },
    member_info:function(){
        var that = this;
        app.request({
            load: false,
            url: "/member/member",
            method: 'post',
            success: function (res) {
                that.setData({
                    phone:res.data.m_account
                })
            },
        })
    },
    update_code: function (e) {
        var that = this;
        that.setData({
            code: e.detail.value
        })
    },
    pwd1: function (e) {
        var that = this;
        that.setData({
            pwd1: e.detail.value
        })
    },
    pwd2: function (e) {
        var that = this;
        that.setData({
            pwd2: e.detail.value
        })
    },
    sendSms: function () {
        var that = this;
        if (that.data.is_code==false) {
            app.msg('请发送验证码');
            return;
        }
        if (that.data.code == '') {
            app.msg('请输入验证码');
            return;
        }
        if (that.data.pwd1 == '') {
            app.msg('请输入新密码');
            return;
        }
        if (that.data.pwd2 == '') {
            app.msg('请再次输入新密码');
            return;
        }

        app.request({
            load: true,
            url: "/member/dealPwd",
            method: 'post',
            data: {
                account: that.data.phone,
                code: that.data.code,
                password:that.data.pwd1,
                password1:that.data.pwd2,
                
            },
            success: function (ress) {
                if (ress.code == 0) {
                    wx.hideLoading({
                        complete: (res) => {
                            app.msg(ress.msg);
                        },
                    })
                } else {
                    wx.hideLoading({
                        complete: (res) => {
                            wx.showToast({
                                title: ress.msg,
                                success:function(){
                                    setTimeout(function(){
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    },2000)  
                                }
                              })
                        },
                    })
                }
            },
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
        this.member_info();
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