// pages/address/address.js
var bmap = require('../../thirdjs/bmap-wx.min.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:1,//1=man,2=woman
    bak: "TxMECNEPjBxy7PUlYvn5NpZqf49vWocg",
    address:""
  },
  submitHandler:function(e){
    console.log(e);
  },
  selectAddress:function(){
    wx.navigateTo({
      url: '../map/map',
    });
  },
  selectSex:function(e){
    var clickSex = e.currentTarget.dataset.sex;
    var sex = this.data.sex;
    if(clickSex==sex){
      return;
    }else{
      this.setData({
        sex: clickSex
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var address = "";
    if(options.name!=null||options.name!=""){
      address = options.name;
    }
    this.setData({
      address: address
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