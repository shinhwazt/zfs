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
    
    showCarPanel:false,
    carFoods:[],
    goods:[],
    toView:"category0"
  },
  categoryHandler:function(e){
    var currentActiveIndex = this.data.currentActiveIndex;
    var afterActiveIndex = e.currentTarget.dataset.id;
    console.log(afterActiveIndex);
    if (currentActiveIndex == afterActiveIndex){
      return;
    }else{
      var goods = this.data.goods;
      goods[currentActiveIndex].active = false;
      goods[afterActiveIndex].active = true;
      this.setData({
        goods: goods,
        currentActiveIndex: afterActiveIndex,
        toView: "category" + afterActiveIndex
      });

    }
  },
  //添加到购物车
  addCurrentFood:function(e){
    var index = e.currentTarget.dataset.index;
    var pIndex = e.currentTarget.dataset.p;
    var goods = this.data.goods;
    var current = goods[pIndex].goods_data[index];
    var price = current.goods_price;
    var currentCount = current.uCount;
    current.uCount = currentCount+1;
    this.setData({
      goods: goods
    });
    this.computePrice(1, price);
  },
  //移出购物车
  cutCurrentFood: function (e) {
    var index = e.currentTarget.dataset.index;
    var pIndex = e.currentTarget.dataset.p;
    var goods = this.data.goods;
    var current = goods[pIndex].goods_data[index];
    var currentCount = current.uCount;
    var price = current.goods_price;
    current.uCount = currentCount - 1;
    this.setData({
      goods: goods
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

    var currentInCar = this.carFoodsFilter(index, pIndex);
    var currentInGoods = goods[pIndex];
    var price = currentInCar.goods_price;
    var currentCount = currentInCar.uCount;
    currentInCar.uCount = currentCount + 1;
    currentInGoods.goods_data[index].uCount = currentCount + 1;
    this.setData({
      carFoods: carFoods,
      goods: goods
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
    var currentInCar = this.carFoodsFilter(index, pIndex);
    var currentInGoods = goods[pIndex];
    var currentCount = currentInCar.uCount;
    var price = currentInCar.goods_price;
    currentInCar.uCount = currentCount - 1;
    currentInGoods.goods_data[index].uCount = currentCount - 1;
    if (currentInCar.uCount===0){
      //从数组中删除元素
      
      carFoods.splice(eq,1);
    }
    if (carFoods.length==0){
      this.hideCarPanel();
    }
    this.setData({
      carFoods: carFoods,
      goods: goods
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
        if (food.uCount > 0) {
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
  initData:function(){
    var _this = this;
    app.ajax({
      url: "api/small/getoneshop",
      method: "post",
      data: {
        smallviewid: "d00c46fdb9bd41048cb4c9848dfb1050"
      },
      success: function (data) {
        var data = data.data;
        if(data.state==1000){
          var goods = data.data.list_gooods;
          console.log(goods);
          //goods handler
          _this.dataFactory(goods);
          _this.setData({
            goods: goods
          })
        }
      }
    });
  },
  //数据加工 分类add active ,foods add uCount & pIndex
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
        food.uCount = 0;
        food.pIndex = i;
        food.index = j;
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.navigateTo({
      url: '../address/address',
    });
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