// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:""
  },
  phoneUpdate:function(e){
    var phone = e.detail.value;
    console.log(phone);
    this.setData({
      phone: phone
    });
  },
  getRandomCode:function(){
    var phone = this.data.phone;
    var phoneReg = /^1[3|4|5|7|8]\d{9}$/;
    if(phoneReg.test(phone)){
      wx.showToast({
        title: '验证码已发送',
        icon:"none"
      });
      setTimeout(function(){
        wx.hideToast();
      },1000)
    }else{
      wx.showToast({
        title: '手机号格式错误',
        icon: "none"
      });
      setTimeout(function () {
        wx.hideToast();
      }, 1000);
    }
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