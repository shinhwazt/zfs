// pages/address/address.js
var bmap = require('../../thirdjs/bmap-wx.min.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:1,//1=man,0=woman
    bak: "TxMECNEPjBxy7PUlYvn5NpZqf49vWocg"
  },
  selectSex:function(){
    var sex = this.data.sex;
    sex==1?sex=0:sex=1;
    this.setData({
      sex: sex
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var BMap = new bmap.BMapWX({
      ak: _this.data.bak
    });
    var success = function (data) {
      console.log(data.wxMarkerData[0].desc);
      
    }
    var fail = function (data) {
      console.log(data);
    }
    BMap.regeocoding({
      fail: fail,
      success: success
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