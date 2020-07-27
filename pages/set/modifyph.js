// pages/set/modifyph.js
var interval = null //倒计时函数
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        date: '请选择日期',
        fun_id: 2,
        time: '获取验证码', //倒计时 
        currentTime: 60,
        is_code: false,
        code:''
    },
    getCode: function (options) {
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
                type: 'update_phone'
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
    sendSms: function () {
        var that = this;
        if (that.data.phone == '') {
            app.msg('请输入手机号');
            return;
        }
        if (that.data.is_code==false) {
            app.msg('请发送验证码');
            return;
        }
        if (that.data.code == '') {
            app.msg('请输入验证码');
            return;
        }
        app.request({
            load: true,
            url: "/member/updatePhone",
            method: 'post',
            data: {
                phone: that.data.phone,
                code: that.data.code,
                type: 'mini',
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
                            wx.navigateBack({
                                delta: 1
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