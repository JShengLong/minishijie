// pages/myorder/writelogistics.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        detail: {},
        sn: '',
        name: '',
        phone: '',
        array: ['顺丰快递', '圆通快递'],
        index: 0,
        express: [0],

        express_sn: [],
    },
    /**
     * 添加列
     */
    add: function () {
        var that = this;
        var express = that.data.express;
        express = express.concat([0]);
        that.setData({
            express: express
        });
        var express_sn1 = [{}];
        var e={
            id:that.data.array[0].id,
            code:that.data.array[0].code,
            name:that.data.array[0].name,
            sn:''
        };
        express_sn1[0]=e;

        var express_sn=that.data.express_sn;
        express_sn=express_sn.concat(express_sn1);
        that.setData({
            express_sn: express_sn
        });
    },
    /**
     * 删除列
     * @param {*} e 
     */
    delete: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        if (that.data.express.length == 1) {
            return;
        }
        console.log(e);
        var express = that.data.express;
        express.splice(index, 1);
        that.setData({
            express: express
        })
        var express_sn=that.data.express_sn;
        express_sn.splice(index, 1);;
        that.setData({
            express_sn: express_sn
        });

    },
    /**
     *输入订单号 
     * @param {*} e 
     */
    sn:function(e){
        var that = this;
        var index = e.currentTarget.dataset.index;
        var express_sn=that.data.express_sn;
        express_sn[index].sn=e.detail.value;
        that.setData({
            express_sn: express_sn
        });
    },
    /**
     * 切换物流公司
     */
    bindPickerChange: function (e) {
        var that = this;
        console.log(e);
        var index = e.currentTarget.dataset.index;
        var express = that.data.express;
        express[index] = e.detail.value;
        that.setData({
            express: express
        });
        var express_sn=that.data.express_sn;
        var e={
            id:that.data.array[e.detail.value].id,
            code:that.data.array[e.detail.value].code,
            name:that.data.array[e.detail.value].name,
            sn:that.data.express_sn[index].sn
        };
        express_sn[index]=e;
        that.setData({
            express_sn: express_sn
        })
    },
    /**
     * 获取物流公司
     */
    expressCode: function () {
        var that = this;
        app.request({
            load: false,
            url: "/member/expressCode",
            method: 'post',
            success: function (res) {
                that.setData({
                    array: res.data,
                })
                var express_sn = [{}];
                var e={
                    id:that.data.array[0].id,
                    code:that.data.array[0].code,
                    name:that.data.array[0].name,
                    sn:''
                };
                express_sn[0]=e;
                that.setData({
                    express_sn: express_sn
                })
            },
        })
    },
    get_data: function () {
        var that = this;
        app.request({
            load: false,
            url: "/member/refundDetail",
            data: {
                id: that.data.id
            },
            method: 'post',
            success: function (res) {
                that.setData({
                    detail: res.data,
                })

            },
        })
    },
    update_sn: function (e) {
        this.setData({
            sn: e.detail.value
        })
    },
    update_name: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    update_phone: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },
    btn: function () {
        var that = this;

        var express_sn=that.data.express_sn;

        for(var i=0;i<express_sn.length;i++){
            if(express_sn[i].sn==''){
                app.msg('请输入物流单号');
                return;
            }
        }
        if(that.data.phone==''){
            app.msg('请输入联系方式');
                return;
        }
        app.request({
            load: false,
            url: "/member/refundSn",
            data: {
                id: that.data.id,
                // sn: that.data.sn,
                // name: that.data.name,
                // phone: that.data.phone
                param:JSON.stringify(express_sn)
            },
            method: 'post',
            success: function (res) {
                if (res.code == 0) {
                    app.msg(res.msg);
                } else if(res.code == 1) {
                    wx.navigateBack({
                        delta: -1
                    })
                }

            },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id
        })
        

        this.expressCode();

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