// pages/pay/pay.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        payment_password: '',
        order_data: {},
        pay_type: 'mini',
        showPayPwdInput: false, //是否展示密码输入层
        payFocus: true, //文本框焦点
    },
    get_data: function () {
        var that = this;
        app.request({
            load: false,
            url: "/order/corder",
            data: {
                id: that.data.id,
            },
            method: 'post',
            success: function (res) {
                console.log("数据", res)
                if (res.code == 0) {
                    app.msg(res.msg);
                } else {
                    that.setData({
                        order_data: res.data,
                    })
                    if(res.data.o_status==2||res.data.o_status==3){
                        wx.navigateBack({
                          complete: (res) => {},
                        })
                    }
                }
            }
        })
    },
    radio: function (e) {
        console.log(e);
        this.setData({
            pay_type: e.currentTarget.dataset.item
        })
    },
    payOrder:function() {
        var that=this;
        console.log(that.data.pay_type)
        if(that.data.pay_type=='money'){
            app.request({
                load: false,
                url: "/member/member",
                method: 'post',
                success:function(res){
                    if(res.data.m_payment_password==''){
                        wx.showToast({
                          title: '请设置支付密码',
                          icon:'none',
                          success:function(){
                              setTimeout(function(){
                                  wx.navigateTo({
                                    url: '../set/modifypw',
                                  })
                              },2000)
                          }
                        })
                    }else{
                        that.setData({ 
                            showPayPwdInput: true,
                            payFocus: true 
                        });
                    }
                }
            
            })
             
        }else{
            that.pay();
        }

    },
    pay:function(val ='') {
        var that=this;
        app.request({
            load: false,
            url: "/member/payOrder",
            data: {
                id: that.data.id,
                payment_password:val,
                pay_type:that.data.pay_type,
            },
            method: 'post',
            success: function (res) {
                console.log("数据", res);
                if(res.code==0){
                    app.msg(res.msg);
                }else{
                    var pay_data=res.data.payData;
                    if(that.data.pay_type=="mini"&&pay_data!=""){
                        wx.requestPayment({
                            timeStamp : pay_data.timeStamp, // 时间戳，必填（后台传回）
                            nonceStr :  pay_data.nonceStr , // 随机字符串，必填（后台传回）
                            package :  pay_data.package, // 统一下单接口返回的 prepay_id 参数值，必填（后台传回）
                            signType :  pay_data.signType, // 签名算法，非必填，（预先约定或者后台传回）
                            paySign  :  pay_data.paySign, // 签名 ，必填 （后台传回）
                            success:function(ress){ // 成功后的回调函数
                                // do something
                                console.log(ress);
                                wx.navigateTo({
                                  url: '/pages/success/success?id='+that.data.id,
                                })
                            },
                            fail:function(rese){
                                console.log('支付失败',rese);
                                if(rese.errMsg=="requestPayment:fail cancel"){
                                    app.msg('取消支付');
                                }else{
                                    app.msg('支付失败');
                                }
                            },
                        })
                    }else{
                        wx.navigateTo({
                            url: '/pages/success/success?id='+that.data.id,
                          }) 
                    }
                }
            }
        })
    },
    /**
     * 隐藏支付密码输入层
     */
    hidePayLayer: function () {
        /**获取输入的密码**/
        var val = this.data.payment_password;
        /**在这调用支付接口**/
        this.setData({
            showPayPwdInput: false,
            payFocus: false,
            payment_password: ''
        });
        return val;

    },
    /**
     * 获取焦点
     */
    getFocus: function () {
        this.setData({
            payFocus: true
        });
    },
    /**
     * 输入密码监听
     */
    inputPwd: function (e) {
        this.setData({
            payment_password: e.detail.value
        });

        if (e.detail.value.length >= 6) {
            var val=this.hidePayLayer();
            this.pay(val);
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id,
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
        // app.sigin();
        this.get_data();
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