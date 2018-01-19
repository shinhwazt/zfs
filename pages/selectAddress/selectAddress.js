// pages/selectAddress/selectAddress.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentAddressId:0,
    touchX:0,
    left:0,
    address:[]
  },
  editAddress:function(e){
    var id = e.currentTarget.dataset.id;
    var eq = e.currentTarget.dataset.eq;
    var address = this.data.address;

    app.globalData.editAddress = address[eq];

    wx.redirectTo({
      url: '../address/address?edit=true',
    });
  },
  addAddressItem:function(){
    wx.redirectTo({
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
    //var left = this.data.left;
    var eq = e.currentTarget.dataset.eq;
    var address = this.data.address;
    var left = address[eq].left;
   
    //this.data.touchX = pageX;
    if (disX>0){//向右侧滑动
      var left = disX - Math.abs(left);
      
      if(left>=0){
        address[eq].left = 0;
        return this.setData({
          address: address
        });
      }else{
        if(left>(-60)){
          address[eq].left = 0;
          this.setData({
            address: address
          });
        }else{
          address[eq].left = left;
          this.setData({
            address: address
          });
        }
        
      }
      
      

    }else if((-disX)>0){//向左侧滑动
      
      if (Math.abs(left) >= 116) {
        address[eq].left = -116;
        return this.setData({
          address: address
        });
      }
      left = left - Math.abs(disX);
      
      address[eq].left = left;
      this.setData({
        address: address
      });
      
    }
    this.data.touchX = currentX
  },
  deleteHandler:function(e){
    var _this = this;
    var id = e.currentTarget.dataset.id;
    var eq = e.currentTarget.dataset.eq;
    var address = this.data.address;
    app.ajax({
      method:"post",
      url:"api/small/deleteshippingaddress",
      data:{
        member_shipping_address_id:id
      },
      success:function(data){
        var data = data.data;
        if(data.state==1000){
          app.toastr("删除成功","success",1500);
          address.splice(eq,1);
          _this.setData({
            address:address
          });
        }else{
          app.toastr("操作异常，请稍后再试", "none", 1500);
        }

      }
    })

  },
  touchEndHandler:function(e){},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    app.ajax({
      method:"post",
      url:"api/small/shippingaddresslist",
      data:{
        sessionId: wx.getStorageSync("sessionId")
      },
      success:function(data){
        var data = data.data;
        if(data.state==1000){
          var address = data.data;
          for(var i=0,il=address.length;i<il;i++){
            address[i].left = 0
          }
          _this.setData({
            address: address
          });
        }

      },
      
    })
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