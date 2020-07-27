// pages/order/order.js
const util = require("../../utils/util.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [0, 1], //列表
        time: '12:01',
        time1: '12:01',
        logistics: false,
        orderDate: true,
        p_id: '',
        num: '',
        sku_id: '',
        address: {},
        peisong_type: [],
        product: [],
        ischeck: ['', 'checked'],
        peisong_id: 0,
        s_integral: 0,
        q_total: 0,
        p_total: 0,
        total: 0,
        h_total: 0,
        s_total: 0,
        chec: "",
        check:"1",//默认不使用积分
        is_beijing: 1,
        freight: true, //是否显示运费
        freight_info: true, //是否显示运费说明
        qiwang_time: true, //是否显示期望时间
        freight1:true,
        freight_total:0,
        totals:0,
        freight_ex:0,
        datas:{},
        c_id:"",//购物车id
        remark:'',//备注
        qiwangtime:'',//期望送达时间

        now_time:'',
        now_time1:'',

    },
    //选择时间
    bindTimeChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            time: e.detail.value,
            now_time1:e.detail.value,
            time1:e.detail.value
        })
    },
    bindTimeChange1: function (e) {
        this.setData({
            time1: e.detail.value
        })
    },
    //去凑单
    gohome: function () {
        wx.switchTab({
            url: '../index/index',
        })
    },
    /**
     * 选择取货方式
     * @param {*} e 
     */
    select1: function (e) {
        var itemid = e.currentTarget.dataset.itemid
        var peisong_type = this.data.peisong_type;
        for (var i = 0; i < peisong_type.length; i++) {
            if (peisong_type[i].id == itemid) {
                peisong_type[i].is_check = 1;
            } else {
                peisong_type[i].is_check = 0;
            }
        }
        switch(itemid){
            case 1:{
                if(this.data.check==1){
                    var s_total=this.data.totals;
                }else{
                    var s_total=this.data.datas.totals-this.data.datas.q_total;
                }
                this.setData({
                    freight: false, //平台配送显示运费
                    freight_info: false, //平台配送显示期望时间
                    qiwang_time: false, //站点自提不显示期望时间
                    freight1:true,
                    s_total:s_total,
                }) 
                break;
            }
            case 2:{
                if(this.data.check==1){
                    var s_total=this.data.p_total;
                }else{
                    var s_total=this.data.datas.price-this.data.datas.q_total;
                }
                this.setData({
                    freight: true, //站点自提不显示运费
                    freight_info: true, //站点自提不显示运费说明
                    qiwang_time: true, //站点自提不显示期望时间
                    freight1:true,
                    s_total:s_total
                })
                break;
            }
            case 3:{
                if(this.data.is_beijing==1){
                    var freight_info=true;
                }else{
                    var freight_info=false;
                }
                if(this.data.check==1){
                    var s_total=this.data.totals;
                }else{
                    var s_total=this.data.datas.totals-this.data.datas.q_total;
                }
                this.setData({
                    freight: false, //站点自提不显示运费
                    freight_info: freight_info, //站点自提不显示运费说明
                    qiwang_time: true, //站点自提不显示期望时间
                    freight1:true,
                    s_total:s_total,
                })
                break;
            }  
            case 4:{
                if(this.data.check==1){
                    var s_total=this.data.p_total;
                }else{
                    var s_total=this.data.datas.price-this.data.datas.q_total;
                }
                this.setData({
                    freight: true, 
                    freight_info: true,
                    freight1:false,
                    qiwang_time: true, 
                    s_total:s_total
                })
                break;
            }
        }
        this.setData({
            peisong_id: itemid,
            peisong_type: peisong_type,
        })
    },
    /**
     * 是否使用积分
     * @param {} e 
     */
    swith: function (e) {
        console.log(e.detail.value,e)
        var that = this;
        if(e.currentTarget.dataset.check=='1'){
            that.setData({
                check:"2",
            })
        }else{
            that.setData({
                check:"1",
            })
        }
        if (e.detail.value) {
            that.setData({
                h_total: (parseFloat(that.data.h_total) - parseFloat(that.data.q_total)).toFixed(2),
                s_total: (parseFloat(that.data.s_total) - parseFloat(that.data.q_total)).toFixed(2),

            })

        } else {
            that.setData({
                h_total: parseFloat(that.data.h_total) + parseFloat(that.data.q_total),
                s_total: parseFloat(that.data.s_total) + parseFloat(that.data.q_total),
            })

        }
        console.log(that.data.h_total)
    },
    /**
     * 获取数据
     */
    get_data: function () {
        var that = this;
        app.request({
            load: true,
            url: "/order/orderDetail",
            data: {
                p_id: that.data.p_id,
                sku_id: that.data.sku_id,
                num: that.data.num,
            },
            method: 'post',
            success: function (res) {
                console.log("数据", res)
                if (res.code == 0) {
                    app.msg(res.msg);
                } else {
                    if (res.data.peisong_type.length == 0) {
                        var peisong_id = 0;
                    } else {
                        var peisong_id = res.data.peisong_type[0].id;
                    }
                    if (peisong_id == 1) {
                        var freight=false;
                        var freight_info=false;
                        var qiwang_time=false;
                        var s_total=res.data.totals
                    }else{
                        var freight=true;
                        var freight_info=true;
                        var qiwang_time=true;
                        var s_total=res.data.price
                    }
                
                    that.setData({
                        datas:res.data,
                        address: res.data.address,
                        peisong_type:res.data.peisong_type,
                        product: res.data.product,
                        peisong_id: peisong_id,
                        s_integral: res.data.s_integral,
                        q_total: res.data.q_total,
                        p_total: res.data.price,
                        total: res.data.total,
                        h_total: res.data.price,
                        s_total: s_total,
                        chec: "",
                        is_beijing: res.data.is_beijing,
                        freight_total: res.data.freight,
                        totals:res.data.totals,
                        freight_ex:res.data.freight_ex,
                        freight: freight, //平台配送显示运费
                        freight_info: freight_info, //平台配送显示期望时间
                        qiwang_time: qiwang_time, //站点自提不显示期望时间
                    })
                }
            }
        })
    },
     /**
     * 获取数据
     */
    get_datas: function () {
        var that = this;
        app.request({
            load: true,
            url: "/order/cartDetail",
            data: {
                c_id: that.data.c_id,
            },
            method: 'post',
            success: function (res) {
                console.log("数据", res)
                if (res.code == 0) {
                    app.msg(res.msg);
                } else {
                    if (res.data.peisong_type.length == 0) {
                        var peisong_id = 0;
                    } else {
                        var peisong_id = res.data.peisong_type[0].id;
                    }
                    if (peisong_id == 1) {
                        var freight=false;
                        var freight_info=false;
                        var qiwang_time=false;
                        var s_total=res.data.totals
                    }else{
                        var freight=true;
                        var freight_info=true;
                        var qiwang_time=true;
                        var s_total=res.data.price
                    }
                
                    that.setData({
                        datas:res.data,
                        address: res.data.address,
                        peisong_type:res.data.peisong_type,
                        product: res.data.product,
                        peisong_id: peisong_id,
                        s_integral: res.data.s_integral,
                        q_total: res.data.q_total,
                        p_total: res.data.price,
                        total: res.data.total,
                        h_total: res.data.price.toFixed(2),
                        s_total: parseFloat(s_total).toFixed(2),
                        chec: "",
                        is_beijing: res.data.is_beijing,
                        freight_total: res.data.freight,
                        totals:res.data.totals,
                        freight_ex:res.data.freight_ex,
                        freight: freight, //平台配送显示运费
                        freight_info: freight_info, //平台配送显示期望时间
                        qiwang_time: qiwang_time, //站点自提不显示期望时间
                    })
                }
            }
        })
    },
    btn:function(){
        var that=this;
        var date = util.fromDate(new Date());
        if(Date.parse(date+' '+that.data.time)>=Date.parse(date+' '+that.data.time1)&&that.data.peisong_id==1){
            app.msg('期望收货时间不能一样')
            return;
        }
        var qiwangtime=that.data.time+'-'+that.data.time1;
        app.request({
            load: true,
            url: "/order/submitOrder",
            data: {
                type:that.data.datas.type,
                c_id:that.data.c_id,
                p_id: that.data.p_id,
                sku_id: that.data.sku_id,
                num: that.data.num,
                peisong_type:that.data.peisong_id,
                isbj:that.data.is_beijing,
                isdikou:that.data.check,
                remark:that.data.remark,
                qiwangtime:qiwangtime,
            },
            method: 'post',
            success: function (res) {
                console.log("数据", res)
                if(res.code==0){
                    wx.hideLoading({
                      complete: (ress) => {
                          app.msg(res.msg);
                      },
                    })
                }else{
                   wx.hideLoading({
                      complete: (ress) => {
                        wx.navigateTo({
                            url: '/pages/pay/pay?id='+res.data,
                          })
                      },
                    }) 
                }
                
            }
        })
        
    },
     /**
     * 获取当前日期时间
     */
    getNowDateTime: function () {
        var time = util.fromTime(new Date());
        this.setData({ 
            time:time,
            time1:time,
            now_time:time,
            now_time1:time
        })
    },
    remark:function(e){
        this.setData({
            remark:e.detail.value,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        var that = this;
        that.setData({
            p_id: options.p_id,
            num: options.num,
            sku_id: options.sku_id,
            c_id:options.c_id,
        })
        this.getNowDateTime();
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
        if(this.data.c_id.length>0){
            this.get_datas();
        }else{
            this.get_data();
        }
       
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