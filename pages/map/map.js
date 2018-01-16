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
    circles:[]
  },
  searchHandler:function(){
    //搜索下拉
    BMap.suggestion({
      //query: data.wxMarkerData[0].desc,
      query:"",
      region: '北京',
      city_limit: true,
      fail: function (data) {
        console.log(data);

      },
      success: function (data) {
        console.log(data);

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
      console.log(data);
      console.log(data.wxMarkerData[0]);
      var latitude = data.wxMarkerData[0].latitude;
      var longitude = data.wxMarkerData[0].longitude;
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
        address: JSON.stringify(data)
      })

    }

    var fail = function (data) {
      console.log(data);
    }
   
    BMap.regeocoding({
      fail: fail,
      success: success
    });
     /*
    wx.getLocation({
      type: 'gcj02',
      altitude:true,
      success:function(data){
        console.log(data);
        var latitude = data.latitude;
        var longitude = data.longitude;
        var markers = [{
          id: 1,
          latitude: latitude,
          longitude: longitude,
          iconPath: "../../images/location.png",
          width: 20,
          height: 30,
        }];
        _this.setData({
          latitude: latitude,
          longitude: longitude,
          markers: markers
        })

      }
    })*/
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