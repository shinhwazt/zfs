// pages/shop/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:"http://upload.jianshu.io/collections/images/61/0__15815600_401_00.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/64/h/64",
    categroys: [{ text: "官方推荐", active: true }, { text: "热销饮品", active: false }, { text: "商务套餐", active: false }, { text: "盖饭", active: false }],
    foods: [
      { pic: "https://img.meituan.net/100.100.90/xianfu/50d2dc6eb64ff2469e0950f1b252d8fc197410.jpg", title: "w沙律虾多士", description:"做一只有内涵的虾，虾生无憾。",price:10},
      { pic: "https://img.meituan.net/100.100.90/xianfu/d2f21aefcc4f23e124f12a715f2ffcd0203961.jpg", title: "w腊味菜粒炒饭", description: "简简单单吃一份好吃的炒饭。", price: 20},
      { pic: "https://img.meituan.net/100.100.90/xianfu/7265e55a212d6bdc8c4782e2974e1bd577436.jpg", title: "w招牌三杯鸡煲", description: "每块鸡肉都干香入味，光闻到味道就忍不住流口水。", price: 30},
      { pic: "https://img.meituan.net/100.100.90/xianfu/419d54e797bd1a1294837603e7ced58359484.jpg", title: "干炒牛河配冻柠檬茶", description: "干炒牛河配冻柠檬茶干炒牛河配冻柠檬茶干炒牛河配冻柠檬茶", price: 50},
      { pic: "https://img.meituan.net/100.100.90/xianfu/7a32c0925104ce2f927d79763724da5258040.jpg", title: "w冰火菠萝油", description: "麦兜咀爱！黄油嵌入热腾腾的菠萝包，滋滋滋...", price: 66},
      { pic: "https://img.meituan.net/100.100.90/xianfu/15f3b15e148df6151c310ae20c56f7db193149.jpg", title: "w街头咖喱鱼蛋", description: "萝卜清爽，鱼蛋Q弹，咖喱味和海鲜味的合二为一。", price: 88 },
      ],
    currentActiveIndex:0,
    totalCount:0,
    totalPrice: 0,
    carUrl:"../../images/car.png",
    showCarPanel:false,
    carFoods:[]
  },
  testHandler:function(e){
    var currentActiveIndex = this.data.currentActiveIndex;
    var afterActiveIndex = e.currentTarget.dataset.id;
    console.log(afterActiveIndex);
    if (currentActiveIndex == afterActiveIndex){
      return;
    }else{
      var categroy = this.data.categroys;
      categroy[currentActiveIndex].active = false;
      categroy[afterActiveIndex].active = true;
      this.setData({
        categroys: categroy,
        currentActiveIndex: afterActiveIndex
      });

    }
  },
  //添加到购物车
  addCurrentFood:function(e){
    var index = e.currentTarget.dataset.index;
    var foods = this.data.foods;
    var current = foods[index];
    var price = current.price;
    var currentCount = current.uCount;
    current.uCount = currentCount+1;
    this.setData({
      foods: foods
    });
    this.computePrice(1, price);
  },
  //移出购物车
  cutCurrentFood: function (e) {
    var index = e.currentTarget.dataset.index;
    var foods = this.data.foods;
    var current = foods[index];
    var currentCount = current.uCount;
    var price = current.price;
    current.uCount = currentCount - 1;
    this.setData({
      foods: foods
    });
    this.computePrice(0, price);
  },
  //在购物车中增加
  addCarFood:function(e){
    var index = e.currentTarget.dataset.index;
    var pIndex = e.currentTarget.dataset.pIndex;
    var carFoods = this.data.carFoods;
    var foods = this.data.foods;
    var current = carFoods[index];
    var pCurrent = foods[pIndex];
    var price = current.price;
    var currentCount = current.uCount;
    current.uCount = currentCount + 1;
    pCurrent.uCount = currentCount + 1;
    this.setData({
      carFoods: carFoods,
      foods: foods
    });
    this.computePrice(1, price);

  },
  //在购物车中删除
  cutCarFood:function(e){
    var index = e.currentTarget.dataset.index;
    var pIndex = e.currentTarget.dataset.pIndex;
    var carFoods = this.data.carFoods;
    var foods = this.data.foods;
    var current = carFoods[index];
    var pCurrent = foods[pIndex];
    var currentCount = current.uCount;
    var price = current.price;
    current.uCount = currentCount - 1;
    pCurrent.uCount = currentCount - 1;
    if (current.uCount===0){
      carFoods.splice(index,1);
    }
    if (carFoods.length==0){
      this.hideCarPanel();
    }
    this.setData({
      carFoods: carFoods,
      foods: foods
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
  //show car panel
  showCarPanel:function(){
    var result = this.data.showCarPanel?false:true;
    var totalCount = this.data.totalCount;
    var foods = this.data.foods;
    var carFoods = [];
    if(totalCount===0){
     return console.log("购物车空空如也");
    }else{
      for (var i = 0,il = foods.length;i<il;i++){
        var food = foods[i];
        if(food.uCount!=0){
          carFoods.push(food);
        }
      }
      this.setData({
        carFoods: carFoods
      })
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
    var foods = this.data.foods;
    var carFoods = [];
    for (var i = 0, il = foods.length; i < il; i++) {
      var food = foods[i];
      if (food.uCount != 0) {
        carFoods.push(food);
      }
    }
    this.setData({
      carFoods: carFoods
    });
    var count = this.data.totalCount;
    if (count==0){
      wx.showToast({
        title:"购物车为空",
        duration: 2000
      })
    }else{
      var app = getApp();
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var foods = this.data.foods;
    
    for (var i = 0, il = foods.length;i<il;i++){
      foods[i].uCount = 0;
      foods[i].pIndex = i;
    }
    this.setData({
      foods: foods
    });

    wx.navigateTo({
      url: '../map/map',
    });
    
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