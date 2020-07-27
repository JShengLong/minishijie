// pages/topups/topups.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgArr: [],
        chooseViewShow: true,
        detail: {},
        uploadimg:[],
        showPayPwdInput: false, //是否展示密码输入层
        payFocus: true, //文本框焦点
        payment_password:'',
    },
    /** 选择图片 */
    chooseImage: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                console.log(res.tempFilePaths);
                if (res.tempFilePaths.count == 0) {
                    return;
                }
                wx.uploadFile({
                    url: app.data.url + '/index/uploadImage', //接口
                    filePath: res.tempFilePaths[0],
                    name: 'image',
                    formData: {
                        token:wx.getStorageSync('token') ? wx.getStorageSync('token') : ""
                    },
                    success: function (res) {
                        //do something
                        var img = that.data.uploadimg;
                        img = img.concat(JSON.parse(res.data).data.url);

                        that.setData({
                            uploadimg: img
                        })
                        var imgArrNow = that.data.imgArr;
                        imgArrNow = imgArrNow.concat(JSON.parse(res.data).data.urls);
                        that.setData({
                            imgArr: imgArrNow
                        })
                        console.log(that.data.uploadimg)
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
    deleteImv: function (e) {
        var imgArr = this.data.imgArr;
        var uploadimg = this.data.uploadimg;
        var itemIndex = e.currentTarget.dataset.id;
        imgArr.splice(itemIndex, 1);
        uploadimg.splice(itemIndex, 1);
        this.setData({
            imgArr: imgArr,
            uploadimg:uploadimg
        })
        console.log(this.data.uploadimg)
        console.log(this.data.imgArr)
        //判断是否隐藏选择图片
        this.chooseViewShow();
    },

    save:function(){
        var that=this;
        if(that.data.uploadimg.length==0){
            app.msg('请上传转账截图');
            return;
        }
        wx.showModal({
            title: '提示',
            content: '确认提交？',
            showCancel: true,
            cancelText: '取消',
            success: function (res) {
                if (res.confirm) {
                    app.request({
                        load: true,
                        url: "/member/recharge",
                        method: 'post',
                        data:{
                            code:that.data.uploadimg.join(','),
                        },
                        success: function (res) {
                            if(res.code==0){
                                wx.hideLoading({
                                  complete: (re) => {
                                      app.msg(res.msg)
                                  },
                                })
                                app.msg(res.msg);
                            }else{
                                wx.hideLoading({
                                  complete: (re) => {
                                    wx.showToast({
                                        title: res.msg,
                                        icon:"none",
                                        success:function(){
                                            setTimeout(function(){
                                                wx.navigateBack({
                                                    delta:-1
                                                })  
                                            },2000)
                                        }
                                      })
                                  },
                                })
                            }
                        },
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
     //预览图片，放大预览
     preview() {
        var that=this;
        var imgs=[that.data.detail.shoukuancode];
        let currentUrl = that.data.detail.shoukuancode
        wx.previewImage({
            current: currentUrl, // 当前显示图片的http链接
            urls:imgs // 需要预览的图片http链接列表
        })
    },
    saves:function(val){
        var that = this;
        app.request({
            load: true,
            url: "/member/recharge",
            method: 'post',
            data:{
                code:that.data.uploadimg.join(','),
                payment_password:val,
            },
            success: function (res) {
                if(res.code==0){
                    wx.hideLoading({
                      complete: (re) => {
                          app.msg(res.msg)
                      },
                    })
                    app.msg(res.msg);
                }else{
                    wx.hideLoading({
                      complete: (re) => {
                        wx.showToast({
                            title: res.msg,
                            icon:"none",
                            success:function(){
                                setTimeout(function(){
                                    wx.navigateBack({
                                        delta:-1
                                    })  
                                },2000)
                            }
                          })
                      },
                    })
                }
            },
        })
    },
    /** 是否隐藏图片选择 */
    chooseViewShow: function () {
        if (this.data.imgArr.length >= 1) {
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
    showImage: function (e) {
        var imgArr = this.data.imgArr;
        var itemIndex = e.currentTarget.dataset.id;

        wx.previewImage({
            current: imgArr[itemIndex], // 当前显示图片的http链接
            urls: imgArr // 需要预览的图片http链接列表
        })
    },
    get_data: function () {
        var that = this;
        app.request({
            load: false,
            url: "/member/rechargeInfo",
            method: 'post',
            success: function (res) {
                that.setData({
                    detail:res.data
                })
            },
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
            this.saves(val);
        }
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