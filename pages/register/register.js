// pages/register/register.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    btnText:"获取验证码",
    code:true,
    codeText:""
  },
  codeUpdate: function (e) {
    var codeText = e.detail.value;
    this.setData({
      codeText: codeText
    });
  },
  codeValidate:function(){
    var text = this.data.codeText;
    var length = 6;
    var result = true;
    if(text==""){
      app.toast("请输入验证码","none",1500);
      result = false;
    } else if (text.length != length){
      app.toast("请正确输入验证码", "none", 1500);
      result = false;
    }
    return result;
  },
  phoneUpdate:function(e){
    var phone = e.detail.value;
    this.setData({
      phone: phone
    });
  },
  phoneValidate: function () {
    var phone = this.data.phone;
    var result = true;
    var phoneReg = /^1[3|4|5|7|8]\d{9}$/;
    if(!phoneReg.test(phone)){
      result = false;
    }
    return result;
  },
  countDownHandler:function(){
    var _this = this;
    var sec = 60
    this.setData({
      code:false,
      btnText:"60S"
    });
    var timer = setInterval(function(){
      sec--;
      if(sec<0){
        _this.setData({
          code: true,
          btnText: "获取验证码"
        });
        clearInterval(timer);
      }else{
        _this.setData({
          code: false,
          btnText: sec + "S"
        });
      }
      
    },1000);
  },
  registerHandler:function(){
    var _this = this;
    if (_this.phoneValidate() && _this.codeValidate()){
      app.ajax({
        url:"api/small/addmember",
        method:"post",
        data:{
          mobile:_this.data.phone,
          smscode:_this.data.codeText,
          sessionId: wx.getStorageSync("sessionId")
        },
        success:function(data){
          var data = data.data;
          if(data.state==1000){
            wx.setStorageSync('is_register', true);
            wx.navigateTo({
              url: '../index/index',
            });
          }
        }
      });
    }
  },
  getRandomCode:function(){
    var _this = this;
    var phone = this.data.phone;
    
    if (_this.phoneValidate()){
      var flag = this.data.code
      if (flag){
        wx.showLoading({
          title: '验证码发送中',
        });
        app.ajax({
          url: "api/small/getsmscode",
          method: "post",
          data: {
            mobile: phone
          },
          success: function (data) {
            wx.hideLoading();
            var data = data.data;
            if(data.state==1000){
              _this.countDownHandler();
            }else{
              app.toastr(data.data,"none",1500);
            }
            
          }
        });
      }




      
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