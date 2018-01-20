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
    editId:"",
    member_id:"",
    searchPanelShow:false,
    region: "",
    suggestions: [],
  },
  focusHandler: function () {
    this.setData({
      searchPanelShow: true
    })
  },
  initMap: function () {
    var _this = this;
    //实例化BMAP对象
    var BMap = new bmap.BMapWX({
      ak: _this.data.bak
    });
    //成功回调
    var success = function (data) {

      var originalData = data.originalData.result;
      var region = originalData.addressComponent.city;

      _this.setData({
        region: region,
      });

      _this.searchHandler();
    }

    var fail = function (data) {
      console.log(data);
    }
    BMap.regeocoding({
      fail: fail,
      success: success
    });

  },
  inputHandler: function (e) {

    var val = e.detail.value;
    if (val == "") {
      return;
    } else {
      this.searchHandler(val);
    }

  },
  searchHandler: function (query) {
    var _this = this;

    var BMap = new bmap.BMapWX({
      ak: this.data.bak
    });
    //搜索下拉
    var region = this.data.region;
    var address = this.data.address;
    if (query == null || query == "") {
      query = address;
      //updateCount = 2;
    }
    BMap.suggestion({
      //query: data.wxMarkerData[0].desc,
      query: query,
      region: region,
      city_limit: true,
      fail: function (data) {
        console.log(data);
      },
      success: function (data) {
        console.log(data);
        var setObj = {};
        setObj.suggestions = data.result;
        if (data.status == 0) {
          _this.setData(setObj);
        }

      }
    });
  },
  showSearchPanel:function(){

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
    var serverUrl = "api/small/addshippingaddress";
    var edit = this.data.edit;
    var editId = this.data.editId;
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
        member_shipping_address: address + "," + houseNo
      }
      if(edit){
        data.member_shipping_address_id = editId;
        data.member_id = this.data.member_id;
        serverUrl = "api/small/updateshippingaddress";
      }
      app.ajax({
        method:"post",
        url: serverUrl,
        data:data,
        success:function(data){
          wx.hideLoading();
          var data = data.data;
          if(data.state==1000){
            app.globalData.addressInfo = {};
            
            wx.navigateBack({
              url: '../distribution/distribution?state=1000',
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
    this.setData({
      searchPanelShow:true
    })
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
  selectHandler: function (e) {
    var name = e.currentTarget.dataset.name;

    var longitude = e.currentTarget.dataset.lng;
    var latitude = e.currentTarget.dataset.lat;

    this.setData({
      address:name,
      longitude: longitude,
      latitude: latitude,
      searchPanelShow:false
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initMap();
    var edit = false;
    if (options.edit){
      edit = JSON.parse(options.edit);
    }
    
    
    if(edit){//处于编辑状态
      var editAddress = app.globalData.editAddress;
      var editId = editAddress.member_shipping_address_id;
      var member_id = editAddress.member_id;
      var member_shipping_address = editAddress.member_shipping_address.split(",")
      this.setData({
        edit:true,
        editId: editId,
        member_id: member_id,
        address: member_shipping_address[0],
        longitude:editAddress.longitude,
        latitude: editAddress.latitude,
        username: editAddress.member_shipping_name,
        userphone: editAddress.member_shipping_phone,
        houseNo: member_shipping_address[1],
        sex: editAddress.member_shipping_sex
      });
    }else{
      
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