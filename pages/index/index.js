// pages/shop/shop.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:"http://upload.jianshu.io/collections/images/61/0__15815600_401_00.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/64/h/64",
    carUrl: "../../images/car.png",
    currentActiveIndex:0,
    totalCount:0,
    totalPrice: 0,
    currentTab:"order",
    showCarPanel:false,
    carFoods:[],
    goods:[],
    categoryGoods: [],
    categoryName:"",
    headerShow:true,
    shopAddress:"",
    shopStart:"",
    shopEnd:""
  },
  // show order
  showOrderList:function(){
    wx.navigateTo({
      url: '../orderList/orderList',
    })
  },
  clearCar:function(){
    var carFoods = this.data.carFoods;
    var goods = this.data.goods;
    for (var i = 0, il = carFoods.length;i<il;i++){
      var carFood = carFoods[i];
      var index = carFood.index;
      var pIndex = carFood.pIndex;
      goods[pIndex].goods_data[index].quantity = 0;
    }
    carFoods = [];
    this.setData({
      carFoods: carFoods,
      goods: goods,
      totalCount: 0,
      totalPrice: 0,
    });
    this.hideCarPanel();
  },
  categoryHandler:function(e){
    var currentActiveIndex = this.data.currentActiveIndex;
    var afterActiveIndex = e.currentTarget.dataset.id;
    
    if (currentActiveIndex == afterActiveIndex){
      return;
    }else{
      var goods = this.data.goods;
      var categoryGoods = goods[afterActiveIndex].goods_data;
      var categoryName = goods[afterActiveIndex].shop_goods_category_name;
      goods[currentActiveIndex].active = false;
      goods[afterActiveIndex].active = true;
      this.setData({
        goods: goods,
        currentActiveIndex: afterActiveIndex,
        categoryGoods: categoryGoods,
        categoryName: categoryName
      });

    }
  },
  //添加到购物车
  addCurrentFood:function(e){
    var index = e.currentTarget.dataset.index;
    var pIndex = e.currentTarget.dataset.p;
    var goods = this.data.goods;
    var categoryGoods = this.data.categoryGoods;
    
    var current = goods[pIndex].goods_data[index];
    var categoryGoodsItem = categoryGoods[index];

    var price = current.goods_price;
    var currentCount = current.quantity;
    current.quantity = currentCount+1;
    categoryGoodsItem.quantity = currentCount + 1;
    this.setData({
      goods: goods,
      categoryGoods: categoryGoods
    });
    this.computePrice(1, price);
  },
  //移出购物车
  cutCurrentFood: function (e) {
    var index = e.currentTarget.dataset.index;
    var pIndex = e.currentTarget.dataset.p;
    var goods = this.data.goods;
    var categoryGoods = this.data.categoryGoods;

    var current = goods[pIndex].goods_data[index];
    
    var currentCount = current.quantity;
    var price = current.goods_price;
    current.quantity = currentCount - 1;
    categoryGoods[index].quantity = currentCount - 1;
    this.setData({
      goods: goods,
      categoryGoods: categoryGoods
    });
    this.computePrice(0, price);
  },
  carFoodsFilter:function(index,pIndex){
    var carFoods = this.data.carFoods;
    for (var i = 0, il = carFoods.length; i < il; i++) {
      var carFood = carFoods[i];
      if (carFood.index == index && carFood.pIndex == pIndex) {
        return carFood
      }
    }
  },
  //在购物车中增加
  addCarFood:function(e){
    var index = e.currentTarget.dataset.index;
    var pIndex = e.currentTarget.dataset.pindex;
    var carFoods = this.data.carFoods;
    var goods = this.data.goods;
    var currentActiveIndex = this.data.currentActiveIndex;
    var currentInCar = this.carFoodsFilter(index, pIndex);
    var currentInGoods = goods[pIndex];
    var price = currentInCar.goods_price;
    var currentCount = currentInCar.quantity;
    currentInCar.quantity = currentCount + 1;
    currentInGoods.goods_data[index].quantity = currentCount + 1;
    this.setData({
      carFoods: carFoods,
      goods: goods,
      categoryGoods: goods[currentActiveIndex].goods_data
      
    });
    this.computePrice(1, price);

  },
  //在购物车中删除
  cutCarFood:function(e){
    var index = e.currentTarget.dataset.index;
    var pIndex = e.currentTarget.dataset.pindex;
    var eq = e.currentTarget.dataset.eq;
    var carFoods = this.data.carFoods;
    var goods = this.data.goods;
    var currentActiveIndex = this.data.currentActiveIndex;
    var currentInCar = this.carFoodsFilter(index, pIndex);
    var currentInGoods = goods[pIndex];
    var currentCount = currentInCar.quantity;
    var price = currentInCar.goods_price;
    currentInCar.quantity = currentCount - 1;
    currentInGoods.goods_data[index].quantity = currentCount - 1;
    if (currentInCar.quantity===0){
      //从数组中删除元素
      
      carFoods.splice(eq,1);
    }
    if (carFoods.length==0){
      this.hideCarPanel();
    }
    this.setData({
      carFoods: carFoods,
      goods: goods,
      categoryGoods: goods[currentActiveIndex].goods_data
    });
    this.computePrice(0, price);
  },
  //计算购物车商品数量金额
  computePrice:function(behavior,price){
    var currentCount = this.data.totalCount;
    var currentPrice = this.data.totalPrice;
    if (behavior===1){//添加到购物车
      currentCount++;
      currentPrice = currentPrice + price;
      this.setData({
        totalCount: currentCount,
        totalPrice: currentPrice
      });
    }else{
      currentCount--;
      currentPrice = currentPrice - price;
      this.setData({
        totalCount: currentCount,
        totalPrice: currentPrice
      });
    }
  },
  //car factory; 生成购物车数据
  carFactory:function(){
    var goods = this.data.goods;
    var carFoods = [];
    for (var i = 0, il = goods.length; i < il; i++) {
      var foods = goods[i].goods_data;
      for (var j = 0, jl = foods.length; j < jl; j++) {
        var food = foods[j];
        if (food.quantity > 0) {
          carFoods.push(food);
        }
      }
    }
    this.setData({
      carFoods: carFoods
    });
  },
  //show car panel
  showCarPanel:function(){
    var result = this.data.showCarPanel?false:true;
    var totalCount = this.data.totalCount;
    
    if(totalCount===0){
     return console.log("购物车空空如也");
    }else{
      this.carFactory();
    }
    
    this.setData({
      showCarPanel: result
    });
  },
  //购物车为空隐藏购物车
  hideCarPanel:function(){
    this.setData({
      showCarPanel:false
    })
  },
  //提交数据到下一步
  nextHandler:function(){
    
    var count = this.data.totalCount;
    if (count==0){
      wx.showToast({
        title:"购物车为空",
        duration: 2000
      })
    }else{
      this.carFactory();
      var orderFoods = this.data.carFoods;
      var totoalCount = this.data.totalCount;
      var totalPrice = this.data.totalPrice;
      app.globalData.totoalCount = totoalCount;
      app.globalData.totalPrice = totalPrice;
      app.globalData.userOrder = orderFoods;

      wx.navigateTo({
        url: '../distribution/distribution',
      });
    }
    
  },
  //tab toggle
  toggleTab:function(e){
    var currentTab = this.data.currentTab;
    var clickTab = e.currentTarget.dataset.tab;
    var order = "order";
    var show = "show";
    if(currentTab==clickTab){
      return;
    }else{
      //显示列表
      this.setData({
        currentTab: clickTab,
      });
    }
  },
  initData:function(){
    var _this = this;
    wx.showLoading({
      title: '数据加载中',
    });
    app.ajax({
      url: "api/small/getoneshop",
      method: "post",
      data: {
        app_id_view: app.globalData.app_id_view
      },
      success: function (data) {
        var data = data.data;
        if(data.state==1000){
          var goods = data.data.list_gooods;
          var model_shop = data.data.model_shop
          
          app.globalData.shopInfo = model_shop;
          
          var shopAddress = model_shop.shop_address;
          var shopStart = model_shop.shipping_start;
          var shopEnd = model_shop.shipping_end;
          var shop_fee = model_shop.shop_fee;
          var shop_id = model_shop.shop_id;
          app.globalData.shop_fee = shop_fee;
          app.globalData.shop_id = shop_id;
          //console.log(goods);
          //goods handler
          _this.dataFactory(goods);
          _this.setData({
            goods: goods,
            shopAddress: shopAddress,
            shopStart: shopStart,
            shopEnd: shopEnd
          });
          wx.hideLoading()
        }else{
          wx.showModal({
            title: '网络异常',
            content: '是否重新加载',
            success:function(){
              _this.initData();
            }
          });
        }
      }
    });
  },
  //数据加工 分类add active ,foods add quantity & pIndex
  dataFactory:function(goods){
    for(var i=0,il=goods.length;i<il;i++){
      var good = goods[i];
      var foods = good.goods_data;
      if(i==0){
        good.active = true;
      }else{
        good.active = false;
      }
      for(var j=0,jl=foods.length;j<jl;j++){
        var food = foods[j];
        food.quantity = 0;
        food.pIndex = i;
        food.index = j;
      }
    }
    var categoryName = goods[0].shop_goods_category_name;
    var categoryGoods = goods[0].goods_data;
    this.setData({
      categoryName: categoryName,
      categoryGoods: categoryGoods
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    wx.navigateTo({
      url: '../map/map',
    });*/
    
    var _this = this;
    app.checkSession(_this.initData);
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