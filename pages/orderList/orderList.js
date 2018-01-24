// pages/order/order.js
var app = getApp();
Page({

  /**
   * 组件的初始数据
   */
  data: {
    orders: [],
    currentPage: 1,
    
  },
  showOrderDetails:function(e){
    var id = e.currentTarget.dataset.id
    console.log(id);
    wx.navigateTo({
      url: '../orderDetails/orderDetails?id='+id,
    })

  },
  getOrder: function () {
    var _this = this;
    app.ajax({
      url: "api/small/getorderlist",
      method: "post",
      data: {
        sessionId: wx.getStorageSync("sessionId")
      },
      success: function (data) {
        var data = data.data;
        
        if (data.state == 1000) {
          var data = data.data;
          for (var i = 0, il = data.length; i < il; i++) {
            var current = data[i];
            var time = current.create_time;
            var showTime = time.split(".")[0].replace("T", " ");
            current.showTime = showTime;
          }
          _this.setData({
            orders: data
          });
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrder();
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
