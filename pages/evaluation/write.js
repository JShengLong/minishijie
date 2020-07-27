// pages/write/write.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

        flag: [0, 0, 0],
        startext: ['', '', ''],
        stardata: [1, 2, 3, 4, 5],
        imgArr: [],
        chooseViewShow: true,
        id: 818,
        details: [],
        text:[],
        p_ids:[],
        sn:[],
        sku:[],
        num:[],
        uploadimg:[],
    },

    // 五星评价事件

    changeColor: function (e) {
        var index = e.currentTarget.dataset.index;
        var cindex = e.currentTarget.dataset.cindex;
        var flag = this.data.flag;
        flag[index] = cindex;
        this.setData({
            flag: flag,
        })
        var startext=this.data.startext;

        if(cindex+1==1){
            startext[index]='非常不满意'
            this.setData({
                startext: startext,
            })
        }
        if(cindex+1==2){
            startext[index]='不满意'
            this.setData({
                startext: startext,
            })
        }
        if(cindex+1==3){
            startext[index]='一般'
            this.setData({
                startext: startext,
            })
        }
        if(cindex+1==4){
            startext[index]='满意'
            this.setData({
                startext: startext,
            })
        }
        if(cindex+1==5){
            startext[index]='非常满意'
            this.setData({
                startext: startext,
            })
        }
        console.log('1', this.data.flag);

    },
    text:function(e) {
        console.log(e);
        var index = e.currentTarget.dataset.index;
        var value = e.detail.value;
        var text=this.data.text;
        text[index]=value;
        this.setData({
            text:text,
        })
    },
    /** 选择图片 */
    chooseImage: function (e) {
        var that = this;
        var index=e.currentTarget.dataset.index;
        wx.chooseImage({
            count: 1, //最多选择4张图片
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
                        // console.log(JSON.parse(res.data).data)
                        //do something
                        var uploadimg=that.data.uploadimg;
                        var img = that.data.uploadimg[index];
                        // console.log(uploadimg,e,img);
                        img = img.concat(JSON.parse(res.data).data.url);
                        
                        uploadimg[index]=img
                       
                        that.setData({
                            uploadimg: uploadimg
                        })
                        // console.log(that.data.uploadimg);return;
                        var imgArrNow = that.data.imgArr;
                        var imgArrNow1 = that.data.imgArr[index];
                        imgArrNow1 = imgArrNow1.concat(JSON.parse(res.data).data.urls);
                        imgArrNow[index]=imgArrNow1
                        that.setData({
                            imgArr: imgArrNow
                        })
                        console.log('uploadimg',that.data.uploadimg)
                        console.log('imgArr',that.data.imgArr)
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
        var index = e.currentTarget.dataset.index;
        var uploadimg= this.data.uploadimg;
        var imgs= this.data.uploadimg[index];
        
        var imgArr = this.data.imgArr;
        var imgas= this.data.imgArr[index];
        var itemIndex = e.currentTarget.dataset.id;

        imgas.splice(itemIndex, 1);
        imgs.splice(itemIndex, 1);

        uploadimg[index]=imgs;
        imgArr[index]=imgas
        this.setData({
            imgArr: imgArr,
            uploadimg:uploadimg,
        })
        //判断是否隐藏选择图片
        this.chooseViewShow();
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
    get_data: function () {
        var that = this;
        app.request({
            load: false,
            url: "/member/orderDetails",
            data: {
                o_id: that.data.id,
            },
            method: 'post',
            success: function (res) {
                console.log(res.data.order_detail)
                if (res.code == 0) {
                    app.msg(res.msg);
                } else {
                    var star = [];
                    var startext = [];
                    var text=[];
                    var p_ids=[];
                    var sn=[];
                    var sku=[];
                    var num=[];
                    var imgs=[];
                    var img=[];
                        for (var i = 0; i < res.data.order_detail.length; i++) {
                            star[i] = 4;
                            startext[i] = '非常满意';
                            text[i]='';
                            p_ids[i]=res.data.order_detail[i].d_productId,
                            sn[i]=res.data.o_sn
                            sku[i]=res.data.order_detail[i].d_sku
                            num[i]=res.data.order_detail[i].d_num
                            imgs[i]=[];
                            img[i]=[];
                        }
                    console.log('star', star);
                    that.setData({
                        details: res.data.order_detail,
                        flag: star,
                        startext:startext,
                        text:text,
                        p_ids:p_ids,
                        sn:sn,
                        sku:sku,
                        num:num,
                        uploadimg:imgs,
                        imgArr:img,
                    })
                }
            },
        })
    },
    save:function() {
        var that = this;
        console.log('text',that.data.text)
        for(var i=0;i<that.data.text.length;i++){
            if(that.data.text[i]==''){
                app.msg('请输入评价内容');
                return;
            }
        }
        app.request({
            load: false,
            url: "/product/comment",
            data: {
                info:JSON.stringify(that.data.flag),
                p_ids:JSON.stringify(that.data.p_ids),
                text:JSON.stringify(that.data.text),
                imgs:JSON.stringify(that.data.uploadimg),
                sn:JSON.stringify(that.data.sn),
                sku:JSON.stringify(that.data.sku),
                num:JSON.stringify(that.data.num),
            },
            method: 'post',
            success: function (res) {
                console.log(res.data)
                if(res.code==0){
                    app.msh(res.msg);
                }else{
                    wx.navigateBack({
                        delta:-1,
                    })
                }
            },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.o_id) {
            this.setData({
                id: options.o_id,
            })
        }
        this.get_data();
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