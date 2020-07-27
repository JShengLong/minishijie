// pages/category/category.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentData: 0,
        cateindex:'a',
        categorylist: [0, 1, 2, 3, 4],
        categorylist1: [0, 1],
        category: [],
        category_data:[],//分类列表
        current: ['focus',''],
        category1:'',
        category2:'',
        product_list:[],
        count:0,

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

    },
    //tab切换
    changeTab: function(e) {
        const that = this
        that.setData({
            cateindex:'a',
            category1: e.currentTarget.dataset.id,
            category2:'',
            currentData: e.currentTarget.dataset.current,
            category:that.data.category_data[e.currentTarget.dataset.current].category_list2
        })
        that.product_data(false)
        console.log( e.currentTarget)
    },
    /**
     * 分类2选中
     * @param {*} e 
     */
    cate: function (e) {
        const that = this
        console.log(e.currentTarget)
        that.setData({
            category2: e.currentTarget.dataset.id?e.currentTarget.dataset.id:'',
            cateindex: e.currentTarget.dataset.current,
        })
        that.product_data(false)
    },
    /**
     * 跳转商品详情
     * @param {*} e 
     */
    godetails: function(e) {
        var that = this;
        wx.navigateTo({
            url: '/pages/details/details?p_id=' + e.currentTarget.dataset.p_id,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },
    //搜素
    search: function () {
        wx.navigateTo({
            url: '../search/search'
        })
    },
    /**
     * 添加购物车
     */
    addcart: function(e) {
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
    /**
     * 获取数据
     */
    category_list: function (load){
        var that = this;
        app.request({
            url: "/Category/index",
            method: 'post',
            success: function (res) {
                console.log("分类", res.data.category_list)
                var cate1=res.data.category_list[0].category_list2;
             
                // for(var i=0;i<cate1.length;i++){
                //     cate2[i+1]=cate1[i];
                // }
            
                console.log("分类2",cate1)
                that.setData({
                    category1:res.data.category_list[0].id,
                    category:cate1,
                    category_data: res.data.category_list,
                    product_list:res.data.product_list,
                    currentData:0,
                })
                
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
     * 获取商品数据
     */
    product_data:function(load){
        var that = this;
        app.request({
            load: load,
            url: "/Category/categoryProduct",
            
            data:{category1:that.data.category1,category2:that.data.category2},
            method: 'post',
            success: function (res) {
                console.log("商品列表", res.data)
                that.setData({
                    product_list:res.data
                })
                
            },
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
    onLoad: function(options) {
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.setData({
            selectBox:true
        })
        var that=this;
        that.category_list(false);
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        that.get_count();
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