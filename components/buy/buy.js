// components/buy/buy.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        selectBox: {
            type: 'Boolean',
            value: true
        },
        product_detail: Object,
        sku_data: Array,
        goods_spec: Array,
        skuid_list: Array,
        ladder_data: Array,
        stock: Number,
        sku_name: String,
        sku_names: Array,
        num: Number,
        sku_id: Number,
        price: Number,
        price1: Number,
        count:{
            type:Number,
            value:1
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        currentData: 0,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 选择规格
        changeTab: function (e) {
            const that = this;
            that.setData({
                currentData: e.currentTarget.dataset.current
            })
            
        },
        //关闭选择规格弹窗
        close: function (e) { // 隐藏商品弹框
            if (e.target.dataset.target == 'self'){
                this.setData({
                    selectBox: true,
                    num:1
                })
                // console.log(this.selectComponent("#amount"))
                this.selectComponent("#amount").setData({
                    count:1
                });
            }   
        },
        getCount: function (e) {
            this.setData({
                num: e.detail.val,
            })
            var a = 0;
            for (var i = this.data.ladder_data.length - 1; i >= 0; i--) {
                if (e.detail.val >= this.data.ladder_data[i].num) {
                    this.setData({
                        price: (parseFloat(this.data.ladder_data[i].price)*e.detail.val).toFixed(2)
                    })
                    a = 1;
                    break;
                }
            }
            if (a == 0) {
                this.setData({
                    price: (parseFloat(this.data.price1)*e.detail.val).toFixed(2)
                })
            }
            // console.log(this.data.ladder_data)

        },
        //加入购物车
        shop: function () {

            var that = this;
            if(that.data.stock<=that.data.num){
                app.msg('库存不足');
                return;
            }
            app.sigin({
                success: function () {
                    app.request({
                        load: true,
                        url: "/cart/addCart",
                        data: {
                            product_id: that.data.product_detail.id,
                            sku_id: that.data.sku_id,
                            num: that.data.num,
                        },
                        method: 'post',
                        success: function (res) {
                            if (res.code == 0) {
                                app.msg(res.msg);
                            } else {
                                wx.showToast({
                                    icon: 'success',
                                    title: '已加入购物车'
                                })
                                that.setData({
                                    selectBox: true
                                })
                                that.triggerEvent('myevent', 1);
                            }
                        }
                    })
                }
            })
        },
        //立即购买
        buy: function () {
            var that = this;
            console.log(that.data);
            if(that.data.stock<that.data.num){
                app.msg('库存不足');
                return;
            }
            app.sigin({
                success: function () {
                    wx.navigateTo({
                        url: '../order/order?p_id=' + that.data.product_detail.id + '&num=' + that.data.num + '&sku_id=' + that.data.sku_id + '&c_id=',
                        success: function (res) { },
                        fail: function (res) { },
                        complete: function (res) { }
                    })
                }
            })

        },
        selectGuige(e) {

            // console.log(this.data.sku_names);
            let that = this;
            var fuindex = e.currentTarget.dataset.fuindex;
            // 获取第二个循环的index
            // chindex = e.currentTarget.dataset.chindex;
            // 获取当前点击的id
            var selectId = e.currentTarget.dataset.id;
            var item_name = e.currentTarget.dataset.item;

            // console.log(fuindex, selectId);
            var list = [];
            var sku_names = [];
            for (var i = 0; i < that.data.skuid_list.length; i++) {
                if (i == fuindex) {
                    list[i] = selectId;
                    sku_names[i] = item_name;
                } else {
                    list[i] = that.data.skuid_list[i];
                    sku_names[i] = that.data.sku_names[i];
                }
            }

            that.setData({
                skuid_list: list,
                sku_names: sku_names,
                sku_name: sku_names.join('/') + ';',
            })
            // console.log(list);
            var items = that.data.skuid_list.join(',');

            for (var i = 0; i < that.data.sku_data.length; i++) {

                if (that.data.sku_data[i]['attr_symbol_path'] == items) {

                    that.setData({
                        stock: that.data.sku_data[i]['stock'],
                        ladder_data: that.data.sku_data[i]['ladder'],
                        sku_id: that.data.sku_data[i]['sku_id'],
                        // price: that.data.sku_data[i]['price'],
                        price1: that.data.sku_data[i]['price'],
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
            var a = 0;
            for (var i = this.data.ladder_data.length - 1; i >= 0; i--) {
                if (this.data.num >= this.data.ladder_data[i].num) {
                    this.setData({
                        price: (parseFloat(this.data.ladder_data[i].price)*this.data.num).toFixed(2)
                        // price: this.data.ladder_data[i].price
                    })
                    a = 1;
                    break;
                }
            }
            if (a == 0) {
                this.setData({
                    price: (parseFloat(this.data.price1)*this.data.num).toFixed(2)
                })
            }
        },
    }
})