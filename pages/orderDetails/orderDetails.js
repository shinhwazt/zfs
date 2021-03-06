// pages/orderDetails/orderDetails.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "http://upload.jianshu.io/collections/images/61/0__15815600_401_00.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/64/h/64",
    details: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.setData({
      foods: app.globalData.userOrder
    })
    var id = options.id;
    app.ajax({
      method:"post",
      url:"api/small/getorderdetail",
      data:{
        shop_order_id_view:id
      },
      success:function(data){
        var data = data.data;
        if(data.state==1000){
          var data = data.data
          var time = data.create_time;
          var showTime = time.split(".")[0].replace("T", " ");
          data.showTime = showTime;
          _this.setData({
            details: data
          });
        }else{
          console.log("error")
        }
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