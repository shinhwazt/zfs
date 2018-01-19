// pages/address/address.js
var bmap = require('../../thirdjs/bmap-wx.min.js');  
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:1,//1=man,2=woman
    bak: "TxMECNEPjBxy7PUlYvn5NpZqf49vWocg",
    address:"",
    longitude:"",
    latitude: "",
    username:"",
    userphone:"",
    houseNo:"",
    edit:false,
    editId:""
  },
  nameUpdate:function(e){
    var username = e.detail.value;
    this.setData({
      username: username
    });
  },
  phoneUpdate:function(e){
    var userphone = e.detail.value;
    this.setData({
      userphone: userphone
    });
  },
  houseNoUpdate:function(e){
    var houseNo = e.detail.value;
    this.setData({
      houseNo: houseNo
    });
  },
  submitHandler:function(e){
   
    var values = e.detail.value;
    console.log(values);
    var houseNo = values.houseNo;
    var username = values.username;
    var userphone = values.userphone;
    var address = this.data.address;
    var sex = this.data.sex;
    var longitude = this.data.longitude;
    var latitude = this.data.latitude;

    var check = this.validateHandler(username, userphone, address, houseNo);
    if (check){
      wx.showLoading({
        title: '地址保存中',
      });
      var data = {
        sessionId: wx.getStorageSync("sessionId"),
        member_shipping_name: username,
        member_shipping_sex: sex,
        member_shipping_phone: userphone,
        longitude: longitude,
        latitude:latitude,
        member_shipping_address: address + "-" + houseNo
      }
      app.ajax({
        method:"post",
        url:"api/small/addshippingaddress",
        data:data,
        success:function(data){
          wx.hideLoading();
          var data = data.data;
          if(data.state==1000){
            app.globalData.addressInfo = {};
            wx.redirectTo({
              url: '../selectAddress/selectAddress?random='+new Date().getTime(),
            });
          }else{
            app.toastr("保存失败，请重试","none",1500);
          }

        },
        fail:function(){
          wx.hideLoading();
          app.toastr("网络异常，请重试", "none", 1500)
        }
      })
    }
  },
  validateHandler:function(name,phone,address,houseNo){
    var result = true;
    var phoneReg = /^1[3|4|5|7|8]\d{9}$/;
    if(name==""){
      app.toastr("请填写您的姓名","none",1500);
      return false;
    }
    if (!phoneReg.test(phone)) {
      app.toastr("请填写正确的手机号", "none", 1500);
      return false;
    }
    if (address == "") {
      app.toastr("请填写您的地址", "none", 1500);
      return false;
    }
    if (houseNo == "") {
      app.toastr("请填写您的门牌号", "none", 1500);
      return false;
    }
    return result;
  },
  selectAddress:function(){
    var username = this.data.username;
    var userphone = this.data.userphone;
    var houseNo = this.data.houseNo;
    var sex = this.data.sex;
    var data = {
      username: username,
      userphone: userphone,
      houseNo: houseNo,
      sex: sex
    }
    app.globalData.addressInfo = data;
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
    var edit = options.edit;
    if(edit){//处于编辑状态
      var editAddress = app.globalData.editAddress;
      var editId = editAddress.member_shipping_address_id;
      this.setData({
        edit:true,
        editId: editId,
        address: editAddress.member_shipping_address,
        longitude:editAddress.longitude,
        latitude: editAddress.latitude,
        username: editAddress.member_shipping_name,
        userphone: editAddress.member_shipping_phone,
        houseNo: editAddress.member_shipping_address,
        sex: editAddress.member_shipping_sex
      });
    }else{
      var address = "";
      var longitude = "";
      var latitude = "";
      if (options.name != null || options.name != "") {
        address = options.name;
        longitude = options.longitude;
        latitude = options.latitude;
      }
      var addressInfo = app.globalData.addressInfo
      this.setData({
        address: address,
        longitude: longitude,
        latitude: latitude,
        username: addressInfo.username,
        userphone: addressInfo.userphone,
        houseNo: addressInfo.houseNo,
        sex: addressInfo.sex
      });
    }

    
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