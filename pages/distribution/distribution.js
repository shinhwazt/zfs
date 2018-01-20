// pages/distribution/distribution.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:"http://upload.jianshu.io/collections/images/61/0__15815600_401_00.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/64/h/64",
    foods: [],
    receipt:false,
    boxPrice:0,
    totalPrice:0,
    address:"",
    username:"",
    userphone:"",
    time:"立即送出",
    addAddressShow:true,
    addressList:[],
    addressPanelShow:false,
    update:true,
    behaviorText:"删除"
  },
  writeRemark:function(){
    wx.navigateTo({
      url: '../remark/remark',
    })
  },
  computeBoxPrice:function(){
    var boxPrice = 0;
    var totalPrice = 0;
    var foods = this.data.foods;
    for (var i = 0, il = foods.length;i<il;i++){
      var food = foods[i];
      var box_num = food.box_num;
      var box_price = food.box_price;
      var price = food.goods_price;
      var count = food.uCount;
      boxPrice += (box_num * box_price * count);
      totalPrice += (price * count);
    }
    this.setData({
      boxPrice: boxPrice,
      totalPrice: totalPrice + boxPrice
    });
  },
  //是否开发票处理
  receiptHandler:function(){
    var result = this.data.receipt;
    this.setData({
      receipt: !result
    })
  },
  //selectAddress  显示地址panel
  selectAddress:function(){
    this.setData({
      addressPanelShow:true
    });
  },
  //关闭地址panel
  cancelAddressPanel:function(){
    this.setData({
      addressPanelShow:false
    })
  },
  //去编辑
  editAddress: function (e) {
    var id = e.currentTarget.dataset.id;
    var eq = e.currentTarget.dataset.eq;
    var addressList = this.data.addressList;

    app.globalData.editAddress = addressList[eq];

    wx.navigateTo({
      url: '../address/address?edit=true',
    });
  },
  addAddressItem: function () {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  submitOrder:function(){


    wx.navigateTo({
      url: '../orderDetails/orderDetails',
    })
  },
  initData:function(){
    console.log(this.data.foods);
    console.log(app.globalData.userOrder);
    this.setData({
      foods: app.globalData.userOrder
    });
    this.computeBoxPrice();
  },
  //吊起删除
  callDelete:function(){
    var update = this.data.update;
    var behaviorText = this.data.behaviorText;
    if(update){
      update = false;
      behaviorText = "修改"
    }else{
      update = true;
      behaviorText = "删除"
    }
    this.setData({
      update: update,
      behaviorText: behaviorText
    });
  },
  //删除
  deleteAddress:function(e){
    

    var _this = this;
    var id = e.currentTarget.dataset.id;
    var eq = e.currentTarget.dataset.eq;
    var addressList = this.data.addressList;
    app.ajax({
      method: "post",
      url: "api/small/deleteshippingaddress",
      data: {
        member_shipping_address_id: id
      },
      success: function (data) {
        var data = data.data;
        if (data.state == 1000) {
          app.toastr("删除成功", "success", 1500);
          addressList.splice(eq, 1);
          _this.setData({
            addressList: addressList
          });
        } else {
          app.toastr("操作异常，请稍后再试", "none", 1500);
        }

      }
    });

    
  },
  //确认当前地址
  selectCurrent:function(e){
    var eq = e.currentTarget.dataset.eq;
    var addressList = this.data.addressList;




    var selectedAddress = addressList[eq];
    
    this.setData({
      addAddressShow: false,
      addressPanelShow:false,
      address: selectedAddress.member_shipping_address_show,
      username: selectedAddress.member_shipping_name,
      userphone: selectedAddress.member_shipping_phone
    });
    
  },
  //添加
  addAddressItem: function () {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  //获取地址列表
  getAddressList:function(){
    var _this = this;
    app.ajax({
      method: "post",
      url: "api/small/shippingaddresslist",
      data: {
        sessionId: wx.getStorageSync("sessionId")
      },
      success: function (data) {
        var data = data.data;
        if (data.state == 1000) {
          var addressList = data.data;
          for (var i = 0, il = addressList.length; i < il; i++) {
            var address = addressList[i];
            var member_shipping_address = address.member_shipping_address;
            address.member_shipping_address_show = member_shipping_address.replace(",", "-");
          }
          _this.setData({
            addressList: addressList
          });
        }

      },

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddressList();
    this.initData();
    
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
    var addressPanelShow = this.data.addressPanelShow;
    if (addressPanelShow){
      this.getAddressList();
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