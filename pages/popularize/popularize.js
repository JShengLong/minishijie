// pages/popularize/popularize.js
const util = require("../../utils/util.js");
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        code: "SHIJ12345",
        thumb:'',
        currentData: 2,
        date: '0000-00-00',
        date1: '0000-00-00',
        index: 0,
        array: ['全部','近1周', '近1个月'],
        list:[],
        page:1,
        num:0,
        num1:0,

        level:1,
    },
    changeDate(e) {
        this.setData({
            date: e.detail.value
        });
    },
    changeDate1(e) {
        this.setData({
            date1: e.detail.value
        });
    },
    // 一键复制事件
    copyBtn: function(e) {
        var that = this;
        wx.setClipboardData({
            //准备复制的数据
            data: that.data.code,
            success: function(res) {
                wx.showToast({
                    title: '复制成功',
                });
            }
        });
    },
    // tab切换
    changeTab: function(e) {
        const that = this;
        that.setData({
            currentData: e.currentTarget.dataset.current,
            page:1,
            list:[],
        })
        that.get_data();
    },
    //客户订单
    details: function(e) {
        wx.navigateTo({
            url: '../popularize/order?m_id='+e.currentTarget.dataset.id
        })
    },
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        var date1 = util.fromDate(new Date());
        if(e.detail.value==1){
            var date =util.fun_date(-7);
           
        }
        if(e.detail.value==2){
            var date =util.fun_date(-30);
        }
        if(e.detail.value==0){
            var date ='0000-00-00';
            var date1 ='0000-00-00';
        }
        this.setData({
            date:date,
            date1:date1,
            index: e.detail.value, 
        })
    },
    search:function() {
        this.setData({
            page: 1, 
            list:[],
        }) 
        this.get_data();
    },
    get_data:function() {
        var that=this;
        if(that.data.date=='0000-00-00'){
            var start_time='';
        }else{
            var start_time=that.data.date;
        }
        if(that.data.date1=='0000-00-00'){
            var end_time='';
        }else{
            var end_time=that.data.date1;
        }
        app.request({
            load: false,
            url: "/member/myRecommend",
            data:{
                start_time:start_time,
                end_time:end_time,
                page:that.data.page,
                isbuy:that.data.currentData,
                ktime:that.data.index,
            },
            method: 'post',
            success: function (res) {
                var list=that.data.list;
                list=list.concat(res.data.list);
                console.log(res)
                that.setData({
                    list:list,
                    num:res.data.recommend,
                    num1:res.data.integral_num
                })
            }
        }) 
    },
    get_data1:function() {
        var that=this;
        app.request({
            load: false,
            url: "/member/member",
            method: 'post',
            success: function (res) {
                console.log(res)
                that.setData({
                    code:res.data.m_invitation_code,
                    thumb:res.data.m_thumb,
                    level:res.data.m_level,
                })
            }
        }) 
    },

    integral:function(){
        wx.navigateTo({
          url: '../integral/integral',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.get_data()
        this.get_data1()
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
        this.setData({
            page:this.data.page+1
        })
        this.get_data();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})