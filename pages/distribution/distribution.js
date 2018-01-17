// pages/distribution/distribution.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:"http://upload.jianshu.io/collections/images/61/0__15815600_401_00.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/64/h/64",
    foods: [],
    receipt:false,
    boxPrice:0,
    totalPrice:0
  },
  writeRemark:function(){
    wx.navigateTo({
      url: '../remark/remark',
    })
  },
  computeBoxPrice:function(){
    var boxPrice = 0;
    var totalPrice = 0;
    var foods = this.data.foods;
    for (var i = 0, il = foods.length;i<il;i++){
      var food = foods[i];
      var box_num = food.box_num;
      var box_price = food.box_price;
      var price = food.goods_price;
      var count = food.uCount;
      boxPrice += (box_num * box_price);
      totalPrice += (price * count);
    }
    this.setData({
      boxPrice: boxPrice,
      totalPrice: totalPrice + boxPrice
    });
  },
  //是否开发票处理
  receiptHandler:function(){
    var result = this.data.receipt;
    this.setData({
      receipt: !result
    })
  },
  //selectAddress
  selectAddress:function(){
    wx.navigateTo({
      url: '../selectAddress/selectAddress',
    })
  },
  submitOrder:function(){
    wx.navigateTo({
      url: '../orderDetails/orderDetails',
    })
  },
  initData:function(){
    console.log(this.data.foods);
    console.log(app.globalData.userOrder);
    this.setData({
      foods: app.globalData.userOrder
    });
    this.computeBoxPrice();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
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