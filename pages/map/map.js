// pages/map/map.js
var bmap = require('../../thirdjs/bmap-wx.min.js'); 
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    bak: "TxMECNEPjBxy7PUlYvn5NpZqf49vWocg",
    longitude:0,
    latitude:0,
    address:"",
    markers:[{
      id:1,
      latitude: "",
      longitude: "",
      iconPath: "../../images/location.png",
      width: 50,
      height: 50,
    }],
    circles:[],
    region:"",
    suggestions:[],
   
    searchPanelShow:false
  },
  selectHandler:function(e){
    var name = e.currentTarget.dataset.name;
    
    var longitude = e.currentTarget.dataset.lng;
    var latitude = e.currentTarget.dataset.lat;

    wx.navigateTo({
      url: '../address/address?name=' + name + "&longitude=" + longitude + "&latitude=" + latitude,
    })

  },
  focusHandler:function(){
    this.setData({
      searchPanelShow:true
    })
  },
  blurHandler:function(){
    this.setData({
      searchPanelShow: false
    })
  },
  inputHandler:function(e){
    
    var val = e.detail.value;
    if(val==""){
      return;
    }else{
      this.searchHandler(val);
    }

  },
  searchHandler: function (query){
    var _this = this;
   
    var BMap = new bmap.BMapWX({
      ak: this.data.bak
    });
    //搜索下拉
    var region = this.data.region;
    var address = this.data.address;
    if (query == null || query ==""){
      query=address;
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
        if (data.status==0){
          _this.setData(setObj);
        }

      }
    });  
  },
  initMap:function(){
    var _this= this;
    //实例化BMAP对象
    var BMap = new bmap.BMapWX({
      ak: _this.data.bak
    });
    //成功回调
    var success = function (data) {
      

      var originalData = data.originalData.result;
      var location = originalData.location;
      var latitude = location.lat;
      var longitude = location.lng;
      var region = originalData.addressComponent.city;
      var address = originalData.formatted_address
      var markers = [{
        id: 1,
        latitude: latitude,
        longitude: longitude,
        iconPath: "../../images/location.png",
        width: 20,
        height: 30,
      }];
      var circles = [{
        latitude: latitude,
        longitude: longitude,
        color: "#ffaf02AA",
        fillColor: "#ffaf0200",
        radius: 5,
        strokeWidth: 2
      }, {
        latitude: latitude,
        longitude: longitude,
        color: "#ffaf02AA",
        fillColor: "#ffaf0200",
        radius: 20,
        strokeWidth: 5
      }];
      _this.setData({
        latitude: latitude,
        longitude: longitude,
        markers: markers,
        circles: circles,
        region: region,
        address: address
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.initMap();
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