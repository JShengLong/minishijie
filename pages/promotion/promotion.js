// pages/search/result.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentData: 0,
        list: [0, 1, 2, 3], //列表
        product_list:[],//商品列表
        id:'',
        
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

        isFocus: true,
        tab:[
            {
                name:"综合",
                type:"desc",
                selected:true,
            },
            {
                name: "价格",
                type: "desc",
                selected: false,
            },
            {
                name: "销量",
                type: "desc",
                selected: false,
            },
        ],
    },
    // tab切换
    changeTab: function (e) {
        const that = this;
        that.setData({
            currentData: e.currentTarget.dataset.current
        })
    },
     /*
    * @Title tab切换
    */
   changeTab2:function(e){
    var that = this;
    var tab = that.data.tab;
    var index = e.currentTarget.dataset.index;

    if(tab[index].selected == true){
        if(tab[index].type == "desc"){
            tab[index].type = "asc";
        }else{
            tab[index].type = "desc";
        }
    }else{

        for(var i=0;i<tab.length;i++){
            if(i == index){
                tab[i].selected = true;
            }else{
                tab[i].selected = false;
            }
        }
    }
    that.setData({
        tab:tab,
        product_list:[],
        page:1,
    })
    that.product_detail();
    console.log(that.data.tab)

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
        wx.navigateTo({
            url: '/pages/details/details?p_id=' + e.currentTarget.dataset.value,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        if (options.id){
            that.setData({
                id: options.id
            })
        }
        that.product_detail();
        
    },
    product_detail:function(){
        var that = this;
        var selected='';
        var type='';
        for(var i=0;i<that.data.tab.length;i++){
            if(that.data.tab[i].selected==true){
                selected=that.data.tab[i].name;
            }
            if(that.data.tab[i].selected==true){
                type=that.data.tab[i].type;
            }
        }
        if(selected=='综合'){
            var sales='';
            var price='';
        }else if(selected=='价格'){
            var sales='';
            if(type=='asc'){
                var price=1;
            }else{
                var price=2;
            }
            
        }else if(selected=='销量'){
            var price='';
            if(type=='asc'){
                var sales=1;
            }else{
                var sales=2;
            }
            
        }
        app.request({
            url: "/index/promotionList",
            method: 'post',
            data: {
                id:that.data.id,
                sales:sales,
                price:price,
            },
            success: function (res) {
                that.setData({
                    product_list: res.data
                })
            }
        })
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