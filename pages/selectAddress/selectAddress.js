// pages/selectAddress/selectAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentAddressId:0,
    touchX:0,
    left:0
  },
  addAddressItem:function(){
    wx.navigateTo({
      url: '../address/address',
    })
  },
  touchStartHandler:function(e){
    console.log(e);
    this.data.touchX = e.touches[0].pageX;
  },
  touchMoveHandler:function(e){
    var currentX = e.touches[0].pageX;
    var lastX = this.data.touchX;
    var disX = currentX - lastX;
    var left = this.data.left;
    //this.data.touchX = pageX;
    if (disX>0){//向右侧滑动
      var left = disX - Math.abs(left);
      
      if(left>=0){
        return this.setData({
          left: 0
        });
      }else{
        if(left>(-60)){
          this.setData({
            left: 0
          });
        }else{
          this.setData({
            left: left
          });
        }
        
      }
      
      

    }else if((-disX)>0){//向左侧滑动
      
      if (Math.abs(left) >= 116) {
        return this.setData({
          left: -116
        });
      }
      left = left - Math.abs(disX);
      
      
      this.setData({
        left: left
      });
      
    }
    this.data.touchX = currentX
  },
  touchEndHandler:function(e){},

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