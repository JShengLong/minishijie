// pages/personal/personal.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        code: "SHIJ12345",
        member_info:"",
        logo:""
    },
    // 一键复制事件
    copyBtn: function (e) {
        var that = this;
        wx.setClipboardData({
            //准备复制的数据
            data: that.data.code,
            success: function (res) {
                wx.showToast({
                    title: '复制成功',
                });
            }
        });
    },
    memberInfo:function(){
        var that = this;
        app.request({
            url: "/member/member",
            method: 'post',
            success: function (res) {
                console.log("用户信息", res)
                that.setData({
                    member_info:res.data,
                    code: res.data.m_invitation_code
                })
            }
        })
    },
    minilogo: function (e) {
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
     * 我的订单
     * @param {*} e 
     */
    myorder:function(e){
        console.log(e);
        app.sigin({
            success:function(){
                wx.navigateTo({
                  url: '../myorder/myorder?status='+ e.currentTarget.dataset.status+'&currentData='+ e.currentTarget.dataset.currentdata,
                  complete: (res) => {},
              
                  fail: (res) => {},
                  success: (result) => {},
                })
            }
        })
    },
    /**
     * 我的钱包
     * @param {*} e 
     */
    wallet:function(e){
        app.sigin({
            success:function(){
                wx.navigateTo({
                  url: '../wallet/wallet',
                  complete: (res) => {},
               
                  fail: (res) => {},
                  success: (result) => {},
                })
            }
        })
    },
    /**
     * 我的积分
     * @param {*} e 
     */
    integral:function(e){
        app.sigin({
            success:function(){
                wx.navigateTo({
                  url: '../integral/integral',
                  complete: (res) => {},
                  
                  fail: (res) => {},
                  success: (result) => {},
                })
            }
        })
    },
    /**
     * 我的推广
     * @param {*} e 
     */
    popularize:function(e){
        app.sigin({
            success:function(){
                wx.navigateTo({
                  url: '../popularize/popularize',
                  complete: (res) => {},
                 
                  fail: (res) => {},
                  success: (result) => {},
                })
            }
        })
    },
    /**
     * 常用清单
     * @param {*} e 
     */
    collect:function(e){
        app.sigin({
            success:function(){
                wx.navigateTo({
                  url: '../collect/collect',
                  complete: (res) => {},
            
                  fail: (res) => {},
                  success: (result) => {},
                })
            }
        })
    },
    /**
     * 我的地址
     * @param {*} e 
     */
    address:function(e){
        app.sigin({
            success:function(){
                wx.navigateTo({
                  url: '../address/address',
                  complete: (res) => {},
                  fail: (res) => {},
                  success: (result) => {},
                })
            }
        })
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.minilogo();
        
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
        var that=this;
        // that.setData({
        //     member_info:''
        // })
        app.sigin({
            success:function(){
                that.memberInfo()
            }
        });
        
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