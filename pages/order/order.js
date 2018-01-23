// pages/order/order.js
var app = getApp();
Page({
  
  /**
   * 组件的初始数据
   */
  data: {
    orders:[],
    currentPage:1,
  },
  getOrder:function(){
    app.ajax({
      url:"api/small/getorderlist",
      method:"post",
      data:{
        sessionId: wx.getStorageSync("sessionId")
      },
      success:function(data){
        var data = data.data;
        if(data.state==1000){
          this.setData({
            orders: orders
          })
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
