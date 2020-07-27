// pages/details/details.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        p_id: 38,
        currentData: 0,
        imgUrls: [
            // '../../images/deta07.png',
            // '../../images/deta07.png',
            // '../../images/deta07.png'
        ], //banner
        product_detail: {},
        list: [0, 1, 2, 3], //列表
        selectBox: true, //加入购物车
        parameter: true, //产品参数
        shareImg: true, //分享
        shareBoxBtn: true, //分享
        goods_spec: [], //规格
        textStates: ["active", ""],
        ladder_data: [],//阶梯价格数组
        skuid_list: [],//规格组合id数组
        stock:0,//库存
        sku_name:'',//sku组合名称
        sku_names:[],//sku名称组合数组
        num:1,//数量默认1
        sku_id:'',//规格id
        tuijian_list:[],//为您推荐
        c_img:'../../images/icon25.png',
        sku_price:0,
        iStart:true,

        selectBox1: true,
        product_detail1: {}, //商品详情
        goods_spec1: [], //规格
        ladder_data1: [], //阶梯价格
        stock1:0, //库存
        sku_id1: '',
        sku_price1:0,
        skuid_list1: [],
        sku_name1: '',
        sku_names1: [],
        num1:1,//数量默认1

        enable_progress_gesture:false,
        show_mute_btn:true,
        show_play_btn:true,
        muted:true,
        enable_play_gesture:true,
        img_code:'',

    },
    bindchange:function(e){
        if(e.detail.current!=0){
            wx.createVideoContext('myVideo').pause()
        }
    },
    //收藏
    collect: function () {
        var that = this;
        app.sigin({
            success:function(){
                if(that.data.iStart==false){
                    that.setData({
                        c_img:'../../images/icon25.png',
                    })
                }else{
                    that.setData({
                        c_img:'../../images/icon250.png',
                    })
                }
                that.setData({
                    iStart: !that.data.iStart
                });
                app.request({
                    load:false,
                    url: "/product/collection",
                    data: {
                        p_id: that.data.p_id
                    },
                    method: 'post',
                    success: function(res) {
                        
                    }
                })
            }
        }) 
    },

    // 选择规格
    changeTab: function(e) {
        const that = this;
        console.log(e.currentTarget.dataset.current)
        that.setData({
            currentData: e.currentTarget.dataset.current
        })
    },
    //加入购物车
    shop: function(e) {
        var that = this;
        app.request({
            load: false,
            url: "/index/productSku",
            data: {
                p_id: e.currentTarget.dataset.p_id
            },
            method: 'post',
            success: function (res) {
                console.log("商品详情s", res)
                that.setData({
                    product_detail1: res.data,
                    goods_spec1: res.data.fa_item_attr_val
                });
                that.ladder1(res.data);
                that.setData({
                    selectBox1: false,
                })
            }
        })
    },

    /**
     * 设置阶梯价格
     */
    ladder1: function (product_detail) {
        var that = this;
        //商品sku
        var product_sku = product_detail.sku_data;
        if (product_detail.fa_item_attr_val.length > 0) {
            var list = [];
            var sku_name = [];
            for (var i = 0; i < product_detail.fa_item_attr_val.length; i++) {
                list[i] = product_detail.fa_item_attr_val[i][0]['symbol'];
                sku_name[i] = product_detail.fa_item_attr_val[i][0]['attr_value'];
            }
            var sku_names = sku_name;
            that.setData({
                skuid_list1: list,
                sku_name1: sku_name.join('/') + ';',
                sku_names1: sku_names,
            })
            for (var i = 0; i < product_sku.length; i++) {
                if (product_sku[i]['attr_symbol_path'] == list.join(',')) {
                    that.setData({
                        ladder_data1: product_sku[i]['ladder'],
                        stock1: product_sku[i]['stock'],
                        sku_id1: product_sku[i]['sku_id'],
                        sku_price1: product_sku[i]['price'],
                    })
                }
            }
        }
    },
    //详情
    details: function(e) {
        var that = this;
        wx.navigateTo({
            url: '/pages/details/details?p_id=' + e.currentTarget.dataset.p_id,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },
    //加入购物车
    addshop: function() {
        this.setData({
            selectBox: false
        })
    },
    //立即购买
    buy: function() {
        wx.navigateTo({
            url: '../order/order',
        })
    },
    //参数
    parameter: function() {
        this.setData({
            parameter: false
        })
    },
    close2: function() {
        this.setData({
            parameter: true
        })
    },
    //分享
    share: function() {
        this.setData({
            shareBoxBtn: false
        })
    },
    wechatBtn: function() {
        var that = this;
        app.request({
            load:false,
            url: "/product/getUnlimited",
            data: {
                id: that.data.p_id
            },
            method: 'post',
            success: function(res) {
               that.setData({
                img_code:res.data,
                shareImg: false,
                shareBoxBtn:true
               })
            }
        })



        // this.setData({
        //     shareImg: false
        // })
    },
    //去购物车
    goshop: function () {
        wx.switchTab({
            url: '../shopping/shopping'
        })
    },
    closebox: function() {
        this.setData({
            shareImg: true,
            shareBoxBtn: true
        })
    },
    saveimg:function(){
        var that=this;
        wx.downloadFile({
            url: that.data.img_code,　　　　　　　//需要下载的图片url
            success: function (res) {
                　　　　　　　　　　　　//成功后的回调函数
              wx.saveImageToPhotosAlbum({　　　　　　　　　//保存到本地
                filePath: res.tempFilePath,
                success(res) {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                  })
                },
                fail: function (err) {
                  if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                    wx.openSetting({
                      success(settingdata) {
                        console.log(settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                        } else {
                          console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                        }
                      }
                    })
                  }
                }
              })
            }
          });
    },
    close: function(e) { // 隐藏商品弹框
        console.log(22)
        if (e.target.dataset.target == 'self')
            this.setData({
                shareImg: true,
                shareBoxBtn: true
            })
    },
    close1: function(e) { // 隐藏商品弹框
        console.log(e)
        if (e.currentTarget.dataset.target == 'self')
            this.setData({
                shareImg: true,
                shareBoxBtn: true
            })
    },
    updateCount(e){ // 更新count
        count = e.detail.val
        this.setData({
          num: count
        })
      },
    /**
     * 商品详情接口
     */
    productDetail: function() {
        var that = this;
        app.request({
            load:false,
            url: "/product/productDetail",
            data: {
                p_id: that.data.p_id
            },
            method: 'post',
            success: function(res) {
                console.log("商品详情s", res)
                if(res.data.is_collection==2){
                    that.setData({
                        c_img:'../../images/icon250.png',
                        iStart:true,
                    })
                }
                that.setData({
                    imgUrls: res.data.p_imgs,
                    product_detail: res.data,
                    goods_spec: res.data.fa_item_attr_val
                });
                WxParse.wxParse('article', 'html',  res.data.p_html, that,0);
                that.ladder(res.data);
            }
        })
    },
    /**
     * 为您推荐
     */
    tuijian:function(){
        var that = this;
        app.request({
            load:false,
            url: "/product/recommendProduct",
            method: 'post',
            success: function(res) {
                console.log("为您推荐", res)
                that.setData({
                    tuijian_list:res.data
                })
            }
        })
    },
    /**
     * 设置阶梯价格
     */
    ladder: function(product_detail) {
        var that = this;
        //商品sku
        var product_sku = product_detail.sku_data;
        if (product_detail.fa_item_attr_val.length > 0) {
            var list = [];
            var sku_name=[];
            for (var i = 0; i < product_detail.fa_item_attr_val.length; i++) {
                list[i]  = product_detail.fa_item_attr_val[i][0]['symbol'];
                sku_name[i] = product_detail.fa_item_attr_val[i][0]['attr_value'];
            }
            var sku_names=sku_name;
            that.setData({
                skuid_list: list,
                sku_name:sku_name.join('/')+';',
                sku_names:sku_names,
            })
            for (var i = 0; i < product_sku.length; i++) {
                if (product_sku[i]['attr_symbol_path'] == list.join(',')) {
                    that.setData({
                        ladder_data: product_sku[i]['ladder'],
                        stock: product_sku[i]['stock'],
                        sku_id:product_sku[i]['sku_id'],
                        sku_price:product_sku[i]['price'],
                    })
                }
            }
        }
    },
    selectGuige(e) {
        let that = this;
        var fuindex = e.currentTarget.dataset.fuindex;
        // 获取第二个循环的index
        // chindex = e.currentTarget.dataset.chindex;
        // 获取当前点击的id
        var item_name=e.currentTarget.dataset.item;
        var selectId = e.currentTarget.dataset.id;
        var list = [];
        var sku_names=[];
        for (var i = 0; i < that.data.skuid_list.length; i++) {
            if (i == fuindex) {
                list[i] = selectId;
                sku_names[i]=item_name;
            } else {
                list[i] = that.data.skuid_list[i];
                sku_names[i]=that.data.sku_names[i];
            }
        }
        that.setData({
            skuid_list: list,
            sku_names:sku_names,
            sku_name:sku_names.join('/')+';',
        })
        var items = that.data.skuid_list.join(',');

        for (var i = 0; i < that.data.product_detail.sku_data.length; i++) {

            if (that.data.product_detail.sku_data[i]['attr_symbol_path'] == items) {

                that.setData({
                    ladder_data: that.data.product_detail.sku_data[i]['ladder'],
                    stock: that.data.product_detail.sku_data[i]['stock'],
                    sku_id: that.data.product_detail.sku_data[i]['sku_id'],
                    sku_price: that.data.product_detail.sku_data[i]['price'],
                })
            }
        }
        var fa_item_attr_val = that.data.goods_spec;


        for (var j = 0; j < fa_item_attr_val[fuindex].length; j++) {

            if (fa_item_attr_val[fuindex][j]['symbol'] == selectId) {

                fa_item_attr_val[fuindex][j]['is_click'] = 0;
            } else {
                fa_item_attr_val[fuindex][j]['is_click'] = 1;
            }
        }
        that.setData({
            goods_spec: fa_item_attr_val
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        if(options.p_id){
            that.setData({
                p_id: options.p_id
            })
        }
        this.productDetail();
        this.tuijian();
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
        this,setData({
            shareBoxBtn:true,
            shareImg: true
        })
    }
})