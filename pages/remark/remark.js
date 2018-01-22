// pages/remark/remark.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remark: ["不吃辣", "不吃辣", "不吃辣", "不吃辣", "不吃辣", "不吃辣", "不吃辣", "不吃辣", "不吃辣", "不吃辣", "不吃辣", "不吃辣", "不吃辣", "不吃辣",],
    remarkContent:""
  },

  tapTextHandler:function(e){
    var text = e.currentTarget.dataset.text;
    var remarkContent = this.data.remarkContent;
    remarkContent +=" "+text;
    this.setData({
      remarkContent: remarkContent
    })
  },

  textareaChange:function(e){
    var value = e.detail.value;
    this.setData({
      remarkContent:value
    })

  },

  finishHandler:function(){
    app.globalData.remark = this.data.remarkContent;
    wx.navigateBack()
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
    //show remark
    var remark = app.globalData.remark;
    if (remark && remark != "") {
      this.setData({
        remarkContent: remark
      })
    }
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