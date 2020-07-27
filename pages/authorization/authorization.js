const app=getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
  
    var that = this;
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
        this.btn(e);
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  btn:function(e) {
    var that = this;
        wx.login({
            success: function (res) {
                console.log("token", res);
                app.request({
                    url: '/login/wxMiniLogin',
                    method: 'post',
                    data: {
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
                            wx.showToast({
                                title: data.msg,
                                icon: 'none',
                                success: function () {
                                    // setTimeout(function () {
                                    //     wx.hideLoading()
                                    // }, 2000)
                                    wx.navigateTo({
                                      url: '/pages/bind/bind?nickname='+data.data.nickname+'&openid='+data.data.openid+'&thumb='+data.data.thumb+'&unionid='+data.data.unionid,
                                    })
                                }
                            })
                        } else if (data.code == 1) {
                            console.log('用户信息', data)
                            wx.setStorageSync('token', data.data.token)
                            wx.showToast({
                                title: data.msg,
                                success: function () {
                                  setTimeout(function(){
                                    wx.navigateBack({
                                      complete: (res) => {},
                                    })
                                  },2000)
                                    // wx.switchTab({
                                    //     url: '/pages/index/index',
                                    // })
                                }
                            })
                        }else if(data.code==0){
                          app.msg(data.msg+'，请再次点击');
                        }

                    }
                })
            }
        })
  },
})