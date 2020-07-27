// pages/set/set.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgArr: [],
        imgs:[],
        chooseViewShow: true,
        index:0,
        array: ['不想要了', '发错颜色了'],
        o_id:'',
        d_id:'',
        details:{},
        channe:['','微信','支付宝','钱包'],
        refund_type:'仅退款',
        phone:'',
        info:'',
    },
    //选择原因
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
    /** 选择图片 */
    chooseImage: function() {
        var that = this;
        wx.chooseImage({
            count: 1, //最多选择4张图片
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                console.log(res.tempFilePaths);
                if (res.tempFilePaths.count == 0) {
                    return;
                }
                //上传图片

                wx.uploadFile({
                    url: app.data.url + '/index/uploadImage', //接口
                    filePath: res.tempFilePaths[0],
                    name: 'image',
                    formData: {
                        token:wx.getStorageSync('token') ? wx.getStorageSync('token') : ""
                    },
                    success: function (res) {
                        //do something
                        var img = that.data.imgs;
                        img = img.concat(JSON.parse(res.data).data.url);

                        that.setData({
                            imgs: img
                        })
                        var imgArrNow = that.data.imgArr;
                        imgArrNow = imgArrNow.concat(JSON.parse(res.data).data.urls);
                        that.setData({
                            imgArr: imgArrNow
                        })
                        console.log(that.data.imgs)
                        console.log(that.data.imgArr)
                    },
                    fail: function (error) {
                        console.log(error);
                        app.msg('上传失败')
                    }
                })
                that.chooseViewShow();
            }
        })
    },

    /** 删除图片 */
    deleteImv: function(e) {
        var imgArr = this.data.imgArr;
        var imgs = this.data.imgs;
        var itemIndex = e.currentTarget.dataset.id;
        imgArr.splice(itemIndex, 1);
        imgs.splice(itemIndex, 1);
        this.setData({
            imgArr: imgArr,
            imgs:imgs
        })
        console.log(this.data.imgs)
        console.log(this.data.imgArr)
        //判断是否隐藏选择图片
        this.chooseViewShow();
    },


    /** 是否隐藏图片选择 */
    chooseViewShow: function() {
        if (this.data.imgArr.length >= 9) {
            this.setData({
                chooseViewShow: false
            })
        } else {
            this.setData({
                chooseViewShow: true
            })
        }
    },

    /** 显示图片 */
    showImage: function(e) {
        var imgArr = this.data.imgArr;
        var itemIndex = e.currentTarget.dataset.id;

        wx.previewImage({
            current: imgArr[itemIndex], // 当前显示图片的http链接
            urls: imgArr // 需要预览的图片http链接列表
        })
    },
    update_phone:function(e) {
        this.setData({
            phone:e.detail.value
        })
    },
    update_info:function(e) {
        this.setData({
            info:e.detail.value
        })
    },
    get_data:function() {
        var that = this;
        app.request({
            load: false,
            url: "/member/refundProduct",
            data: {
                o_id: that.data.o_id,
                d_id:that.data.d_id
            },
            method: 'post',
            success: function (res) {
                console.log("详情", res)
                that.setData({
                    details: res.data,
                })
            },
        })
    },
    get_data1:function() {
        var that = this;
        app.request({
            load: false,
            url: "/order/corder",
            data: {
                id: that.data.o_id,
            },
            method: 'post',
            success: function (res) {
                console.log("详情", res)
                if(res.data.o_status==4){
                    that.setData({
                        refund_type: '退货退款',
                    }) 
                }
               
            },
        })
    },
    save:function() {
        var that = this;
        app.request({
            load: false,
            url: "/member/refund",
            data: {
                o_id: that.data.o_id,
                d_id: that.data.d_id,
                info: that.data.info,
                img: that.data.imgs.join(','),
                phone: that.data.phone,
                status: that.data.refund_type=="仅退款"?1:2,
            },
            method: 'post',
            success: function (res) {
                console.log("详情", res)
                if(res.code==0){
                    app.msg(res.msg);
                }else{
                    wx.navigateBack({
                        delta:-1
                    })
                }
               
            },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            o_id:options.o_id,
            d_id:options.d_id,
        })
        this.get_data();
        this.get_data1();
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