// pages/login/login.js
const  app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    //微信授权登陆
    btn: function (e) {
        var that = this;
        wx.login({
            success: function (res) {
                console.log("token", res);
                app.request({
                    url: '/login/ThirdPartyLanding',
                    method: 'post',
                    data: {
                        type: 1,
                        wx_type: 'mini',
                        code: res.code,
                        encryptedData: e.detail.encryptedData,
                        signature: e.detail.signature,
                        rawData: e.detail.rawData,
                        iv: e.detail.iv,
                    },
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success: function (data) {
                        if (data.code == -2) {
                            wx.showLoading({
                                title: '请稍后',
                                success: function () {
                                    setTimeout(function () {
                                        wx.hideLoading()
                                    }, 2000)
                                }
                            })
                        } else if (data.code == 1) {
                            console.log('用户信息', data)
                            wx.setStorageSync('token', data.data.token)
                            wx.showToast({
                                title: data.msg,
                                icon: 'none',
                                success: function () {
                                    wx.switchTab({
                                        url: '/pages/index/index',
                                    })
                                }
                            })
                        }

                    }
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