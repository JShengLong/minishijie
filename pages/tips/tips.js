// pages/tips/tips.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    list: [],
  },
  get_list: function () {
    var that = this;
    app.request({
      load: false,
      url: "/Message/index",
      method: 'post',
      data: {
        page: this.data.page
      },
      success: function (res) {
        console.log('数据', res)
        var list = that.data.list;
        list = list.concat(res.data);
        that.setData({
          list: list,
        })
      },
    })
  },
  detail: function (e) {
    var res = e.currentTarget.dataset;
    if (res.type == 1) {
      wx.navigateTo({
        url: '/pages/myorder/details?o_id=' + res.id,
      })
    } else if (res.type == 2) {
      wx.navigateTo({
        url: '/pages/myorder/refundDetails?id=' + res.id,
      })
    }else if(res.type==3){
      wx.navigateTo({
        url: '/pages/info/info?id=' + res.id,
      })
    }else if(res.type==4){
      wx.navigateTo({
        url: '../topups/bills?id='+res.id
      })
    }
  },
  numberOfRefreshes:function(){
    app.request({
      load: false,
      url: "/member/numberOfRefreshes",
      method: 'post',
      success: function (res) {
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_list();
    this.numberOfRefreshes();
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
    this.setData({
      page: this.data.page + 1,
    })
    this.get_list();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})