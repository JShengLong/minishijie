// pages/index/index.js
//获取应用实例
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cateList: [], //首页分类
        newfoodlist: [1, 2, 3], //今日新品
        list: [1, 2, 3, 4, 5], //热卖列表
        carouselList: [], //轮播图
        promotion_list: [], //促销列表
        recommend_category: [], //专区列表
        product_list: [], //热卖列表
        count: 0,

        selectBox: true,
        product_detail: {}, //商品详情
        goods_spec: [], //规格
        ladder_data: [], //阶梯价格
        stock: 0, //库存
        sku_id: '',
        sku_price: '',
        skuid_list: [],
        sku_name: '',
        sku_names: [],
        num:1,//数量默认1

        logo:'',
    },
    //轮播图跳转
    chomeCarouselClick: function (e) {
        var item = e.currentTarget.dataset.item;
        if (item.type == 1) {
            wx.navigateTo({
                url: '/pages/search/result?category_id=' + item.itemid,
                success: function (res) {},
                fail: function (res) {},
                complete: function (res) {},
            })
        } else if (item.type == 2) {
            wx.navigateTo({
                url: '/pages/details/details?p_id=' + item.itemid,
                success: function (res) {},
                fail: function (res) {},
                complete: function (res) {},
            })
        }else if (item.type == 3) {
            wx.navigateTo({
                url: '/pages/info/info?id=' + item.itemid,
                success: function (res) {},
                fail: function (res) {},
                complete: function (res) {},
            })
        }
    },
    promotion:function(e){
        wx.navigateTo({
            url:'../promotion/promotion?id='+e.currentTarget.dataset.id
        })
    },
    //搜素
    search: function () {


        wx.navigateTo({
            url: '../search/search'
        })
    },
    //购物车
    shop: function (e) {
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
                    product_detail: res.data,
                    goods_spec: res.data.fa_item_attr_val
                });
                that.ladder(res.data);
                that.setData({
                    selectBox: false,
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
     * 设置阶梯价格
     */
    ladder: function (product_detail) {
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
                skuid_list: list,
                sku_name: sku_name.join('/') + ';',
                sku_names: sku_names,
            })
            for (var i = 0; i < product_sku.length; i++) {
                if (product_sku[i]['attr_symbol_path'] == list.join(',')) {
                    that.setData({
                        ladder_data: product_sku[i]['ladder'],
                        stock: product_sku[i]['stock'],
                        sku_id: product_sku[i]['sku_id'],
                        sku_price: product_sku[i]['price'],
                    })
                }
            }
        }
    },
    //详情
    details: function (e) {
        var that = this;
        wx.navigateTo({
            url: '/pages/details/details?p_id=' + e.currentTarget.dataset.id,
            success: function (res) {},
            fail: function (res) {},
            complete: function (res) {},
        })
    },
    //获取首页内容
    homeList: function (load) {
        var that = this;
        app.request({
            load: load,
            url: "/index/homePage",
            method: 'post',
            success: function (res) {
                console.log("首页内容", res)
                that.setData({
                    //促销列表
                    promotion_list: res.data.promotion_list,
                    //轮播图
                    carouselList: res.data.banner_list,
                    //首页分类
                    cateList: res.data.home_category,
                    //专区列表
                    recommend_category: res.data.recommend_category,
                    //商品列表
                    product_list: res.data.product_list,
                })
                wx.hideLoading();
            },
        })
    },
     //获取首页内容
     get_count: function () {
        var that = this;
        app.request({
            load: false,
            url: "/Message/countNum",
            method: 'post',
            success: function (res) {
                console.log("首页内容", res)
                if(res.code!=-1){
                    that.setData({
                        count:res.data
                    })
                }
            },
        })
    },
    /**
     * 分类跳转商品列表
     */
    cate: function (e) {
        var that = this;
        wx.navigateTo({
            url: '/pages/search/result?category_id=' + e.currentTarget.dataset.value,
            success: function (res) {},
            fail: function (res) {},
            complete: function (res) {},
        })
    },
    /**
     * 跳转消息列表
     */
    tipBtn: function () {
        wx.navigateTo({
            url: '../tips/tips',
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
        this.setData({
            selectBox:true
        })
        this.minilogo();
        this.homeList(false);
        this.get_count();
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
        this.homeList(false)
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