// pages/bind/bind.js
var interval = null //倒计时函数
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: '请选择日期',
        fun_id: 2,
        time: '获取验证码', //倒计时 
        currentTime: 60,
        disabled:false,
        is_code: false,
        nickname:'',
        openid:'',
        thumb:'',
        unionid:'',
        phone:'',
        code:'',
        invitation:'',
        logo:''
    },
    getCode: function(options) {
        var that = this;
        if (that.data.phone == '') {
            app.msg('请输入手机号');
            return;
        }
        app.request({
            load: false,
            url: "/login/sendSms",
            method: 'post',
            data: {
                phone: that.data.phone,
                type: 'bind_phone'
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
                                time: '获取',
                                currentTime: 60,
                                disabled: false
                            })
                        }
                    }, 1000)
                }
            },
        })

    
        // var that = this;
        // var currentTime = that.data.currentTime
        // interval = setInterval(function() {
        //     currentTime--;
        //     that.setData({
        //         time: currentTime + '秒'
        //     })
        //     if (currentTime <= 0) {
        //         clearInterval(interval)
        //         that.setData({
        //             time: '获取',
        //             currentTime: 60,
        //             disabled: false
        //         })
        //     }
        // }, 1000)
    },
    getVerificationCode() {
        this.getCode();
    },
    update_ph: function (e) {
        var that = this;
        that.setData({
            phone: e.detail.value
        })
    },
    update_code: function (e) {
        var that = this;
        that.setData({
            code: e.detail.value
        })
    },
    update_inter: function (e) {
        var that = this;
        that.setData({
            invitation: e.detail.value
        })
    },
    bind: function() {
        var that = this;
        if (that.data.phone == '') {
            app.msg('请输入手机号');
            return;
        }
        if(that.data.is_code==false){
            app.msg('请发送验证码');
            return;
        }
        if (that.data.code == '') {
            app.msg('请输入验证码');
            return;
        }
        app.request({
            load: false,
            url: "/login/wxMiniRegister",
            method: 'post',
            data: {
                account: that.data.phone,
                code: that.data.code,
                openid:that.data.openid,
                thumb:that.data.thumb,
                nickname:that.data.nickname,
                unionid:that.data.unionid,
                invitation:that.data.invitation,
            },
            success: function (res) {
                if (res.code == 0) {
                    app.msg(res.msg);
                } else {
                    app.msg(res.msg);
                    wx.setStorageSync('token', res.data.token)
                    wx.switchTab({
                        url: '../index/index'
                    })
                }
            },
        })
        
    },
    /**
     * logo
     * @param {*} e 
     */
    minilogo: function () {
        var that = this;
        app.request({
            load: false,
            url: "/login/userAgreement",
            data: {
                code:'minilogo'
            },
            method: 'post',
            success: function (res) {
                that.setData({
                    logo: res.data,
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            nickname:options.nickname,
            openid:options.openid,
            thumb:options.thumb,
            unionid:options.unionid,
        })
        this.minilogo();
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