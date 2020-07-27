// pages/shop/shop.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectBox: true,
        shoplist: [0, 1, 2],
        list: [0, 1, 2, 3],
        product_list: [], //商品列表
        iscarts: false, //是否隐藏空购物车
        iscart: true, //是否隐藏购物车列表
        cart_list: [], //购物车列表
        total: 0, //合计
        sel: 1, //全选的选中状态
        c_ids:[],//购物车id集合
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
    //结算
    buy: function () {
        var that=this;
        app.sigin({
            success:function(){
                if(that.data.c_ids.length==0){
                    app.msg('请选择商品');
                    return ;
                }
                wx.navigateTo({
                    url: '../order/order?c_id='+that.data.c_ids.join(',')
                })
            }
        });
        
    },
    /**
     * 获取推荐商品sku
     * @param {*} e 
     */
    shop:function(e){
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
    //跳转到详情页
    details: function (e) {
        var that = this;
        wx.navigateTo({
            url: '/pages/details/details?p_id=' + e.currentTarget.dataset.p_id,
            success: function (res) {},
            fail: function (res) {},
            complete: function (res) {},
        })
    },
    //去购物
    gohome: function () {
        wx.switchTab({
            url: '../index/index',
        })
    },
    //删除
    delete: function () {
        var that=this;
        if(that.data.c_ids.length==0){
            app.msg('请选择商品');
            return ;
        }
        wx.showModal({
            title: '温馨提示',
            content: '确认删除？',
            showCancel: true,
            success: function (res) {
                if (res.confirm) {
                    app.request({
                        load: false,
                        url: "/cart/delCart",
                        data: {
                            ids: that.data.c_ids,
                        },
                        method: 'post',
                        success: function (res) {
                            if(res.code==0){
                                app.msg(res,msg);
                            }else{
                                that.cart_data();
                            }
                        },
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
                
            },
            fail: function (res) {},
            complete: function (res) {},
        })
    },
    /**
     * 手指触摸动作开始 记录起点X坐标
     */
    touchstart: function (e) {
        //开始触摸时 重置所有删除
        this.data.cartArray.forEach(function (v, i) {
            if (v.isTouchMove) //只操作为true的
                v.isTouchMove = false;
        })
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            cartArray: this.data.cartArray
        })
    },
    /**
     * 滑动事件处理
     */
    touchmove: function (e) {
        var that = this,
            index = e.currentTarget.dataset.index, //当前索引
            startX = that.data.startX, //开始X坐标
            startY = that.data.startY, //开始Y坐标
            touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
            touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
            //获取滑动角度
            angle = that.angle({
                X: startX,
                Y: startY
            }, {
                X: touchMoveX,
                Y: touchMoveY
            });

        this.data.cartArray.forEach(function (v, i) {
            v.isTouchMove = false
            //滑动超过30度角 return
            if (Math.abs(angle) > 30) return;
            if (i == index) {
                if (touchMoveX > startX) //右滑
                    v.isTouchMove = false
                else //左滑
                    v.isTouchMove = true
            }
        })

        //更新数据
        that.setData({
            cartArray: that.data.cartArray
        })
    },
    /**
     * 计算滑动角度
     */
    angle: function (start, end) {
        var _X = end.X - start.X,
            _Y = end.Y - start.Y
        //返回角度 /Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
    /**
     * 更改选中状态
     */
    selectGood: function (e) {
        var that = this;
        var c_id = e.currentTarget.dataset.id;
        var c_issel = e.currentTarget.dataset.c_issel;
        var ins = e.currentTarget.dataset.in;
        var cart_list = that.data.cart_list;
        var total = 0;
        if (c_issel == 1) {
            cart_list[ins].c_issel = 2;
        } else {
            cart_list[ins].c_issel = 1;
        }
        var num=0;
        var c_ids=[];
        for (var i = 0; i < cart_list.length; i++) {
            if (cart_list[i].c_issel == 2) {
                total = total + (cart_list[i].c_price * cart_list[i].c_num);
                c_ids[num]=cart_list[i].c_id;
                num++;
            }
            
        }
        if(num==cart_list.length){
            var sel=2;
        }else{
            var sel=1;
        }
        console.log(c_ids)
        that.setData({
            // total: total.toFixed(2),
            cart_list: cart_list,
            sel:sel,
            c_ids:c_ids,
        })
        app.request({
            load: false,
            url: "/cart/cartSelection",
            data: {
                c_id: c_id,
                c_issel: cart_list[ins].c_issel,
            },
            method: 'post',
            success: function (res) {
                console.log("更新状态", res)
                that.cart_data();
            },
        })
    },
    /**
     * 全选
     */
    selectGoodAll: function () {
        var that = this;
        if(that.data.cart_list.length==0){
            return;
        }
        if (that.data.sel == 2) {
            var sel = 1;
        } else {
            var sel = 2;
        }
        var cart_list = that.data.cart_list;
        var total = 0;

        for (var i = 0; i < cart_list.length; i++) {
            cart_list[i].c_issel = sel;
        }
        var c_ids=[];
        if(sel==2){ 
            for (var i = 0; i < cart_list.length; i++) {
                c_ids[i]=cart_list[i].c_id;
                total = total + (cart_list[i].c_price * cart_list[i].c_num);
            }
        }
        that.setData({
            // total: total.toFixed(2),
            cart_list: cart_list,
            sel:sel,
            c_ids:c_ids,
        })
        app.request({
            load: false,
            url: "/cart/cartSelectionAll",
            data: {
                c_id:c_ids.join(','),
                sel:sel,
            },
            method: 'post',
            success: function (res) {
                console.log("更新状态", res)
                that.cart_data();
            },
        })
    },
    /**
     * 更新数量
     * @param {} e 
     */
    getCount: function (e) {
        console.log(e)
        var that = this;
        var c_id = e.currentTarget.dataset.id;
        var num = e.detail.val;
        var cart_list = that.data.cart_list;
        var total = 0;
        for (var i = 0; i < cart_list.length; i++) {
            if (cart_list[i].c_id == c_id) {
                cart_list[i].c_num = num;
                if (cart_list[i].c_issel == 2) {
                    total = total + (cart_list[i].c_price * num);
                }
            } else {
                if (cart_list[i].c_issel == 2) {
                    total = total + (cart_list[i].c_price * cart_list[i].c_num);
                }
            }
        }
        console.log('合计', total);
        that.setData({
            // total: total.toFixed(2),
            cart_list: cart_list
        })
        app.request({
            load: false,
            url: "/cart/setCartNum",
            data: {
                c_id: c_id,
                num: num,
            },
            method: 'post',
            success: function (res) {
                console.log("更新数量", res)
                if(res.code==1){
                    that.cart_data();
                }
            },
        })
    },
    /**
     * 刷新
     */
    shuaxin:function(){
        this.cart_data();
    },
    /**
     * 删除事件
     */
    del: function (e) {
       
    },
    /**
     * 推荐商品
     * @param {*} load 
     */
    product_data: function (load) {
        var that = this;
        app.request({
            load: load,
            url: "/product/recommendProduct",
            method: 'post',
            success: function (res) {
                console.log("推荐商品", res)
                that.setData({
                    product_list: res.data
                })
            },
        })
    },
    /**
     * 获取购物车列表
     * @param {*} load 
     */
    cart_data: function (load) {
        var that = this;
        app.request({
            load: load,
            url: "/cart/cartList",
            method: 'post',
            success: function (res) {
                console.log("购物车", res)
                if (res.data.list.length == 0) {
                    that.setData({
                        iscarts: false,
                        iscart: true,
                    })
                } else {
                    that.setData({
                        iscarts: true,
                        iscart: false,
                    })
                }
                
                var cart_list=res.data.list;
                var c_ids=[];
                var a=0;
                for(var i=0;i<cart_list.length;i++){
                    if(cart_list[i].c_issel==2){
                        c_ids[a]=cart_list[i].c_id;
                        a++;
                    }
                }
                that.setData({
                    cart_list: res.data.list,
                    total: res.data.tot,
                    sel:res.data.sel,
                    count:res.data.list.length,
                    c_ids:c_ids
                })
            },
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
        var that = this;
        app.sigin({
            success:function(){
                that.cart_data(false);
            }
        });
        
        that.product_data(false);
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