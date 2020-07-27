// pages/set/feedback.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgArr: [],
        chooseViewShow: true,
        text: '',
        uploadimg: [],
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
    ins: function (e) {
        this.setData({
            text: e.detail.value
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

    feedback:function(){
        var that = this;
        if(that.data.text==''){
            app.msg('请输入反馈内容');
            return;
        }
        wx.showLoading({
            title: "保存中...",
            mask: true,
        })
        app.request({
            load: false,
            url: "/member/feedback",
            method: 'post',
            data:{
                info:that.data.text,
                img:that.data.uploadimg.join(',')
            },
            success: function (ress) {
                console.log("反馈信息", ress)
                if(ress.code==0){
                    wx.hideLoading({
                      complete: (res) => {
                          app.msg(ress.msg)
                      },
                    })
                }else{
                    wx.hideLoading({
                        
                        complete: (res) => {
                            wx.showToast({
                                title:ress.msg ,
                                success:function(){
                                    setTimeout(function(){
                                        wx.navigateBack({
                                            delta: 1
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
    showImage: function (e) {
        var imgArr = this.data.imgArr;
        var itemIndex = e.currentTarget.dataset.id;

        wx.previewImage({
            current: imgArr[itemIndex], // 当前显示图片的http链接
            urls: imgArr // 需要预览的图片http链接列表
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