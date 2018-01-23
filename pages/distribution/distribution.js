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
    behaviorText:"删除",
    times:[],
    sendTime:"",
    sendTimeForServer:0,
    selectTimePanelShow:false,
    week: ["周日","周一", "周二", "周三", "周四", "周五", "周六"],
    dateIndex:0,
    remarkText:"口味、偏好等要求",
    shop_fee:0,
    distribute:true,
    shopInfo:{}

    
  },
  distributeTypeHandler:function(){
    if (this.data.distribute){
      return;
    }
    this.setData({
      distribute:true
    });
  },
  inviteTypeHandler:function(){
    if (!this.data.distribute) {
      return;
    }
    this.setData({
      distribute: false
    });
  },
  clickTimeHandler:function(e){
    var eq = e.currentTarget.dataset.eq;
    var time = e.currentTarget.dataset.time;
    var value = e.currentTarget.dataset.value;
    if(eq!=0){
      this.setData({
        time:"送达时间",
        sendTime:time,
        sendTimeForServer: value,
        selectTimePanelShow: false,
      })
    }else{
      var date = new Date();
      var dateIndex = date.getDay();
      var sendData = new Date(date.getTime() + 30 * 60 * 1000);//30分钟
      var hour = sendData.getHours();
      var min = sendData.getMinutes();
      if (min == 0) {
        min = "00";
      }
      this.setData({
        sendTime: "(大约" + hour + ":" + min + "分)",
        time: "立即送出",
        sendTime: "(大约" + hour + ":" + min + "分)",
        selectTimePanelShow: false,
      })
    }
  },
  initTimes:function(){
    var times = [{ time: "立即送出",value:0}];
    var dis = 30*60*1000;
    var date = new Date();

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    //立即送出的具体时间
    var date = new Date(date.getTime()+dis)
    var hour = date.getHours();
    var min = date.getMinutes();

    var thanMin = Math.ceil((min/10))*10;


    while(true){
      var millisecond = new Date(year, month, day, hour, thanMin).getTime()+dis;
      var date = new Date(millisecond);
      hour = date.getHours();
      thanMin = date.getMinutes(); 
      if (thanMin==0){
        thanMin = "00";
      }
      if(hour>=23){
        break;
      }
      var json = {
        time: hour + ":" + thanMin,
        value: millisecond
      }
      times.push(json);
    }

    this.setData({
      times:times
    })


  },
  //选择时间
  selectTime: function () {
    this.initTimes();
    var selectTimePanelShow = this.data.selectTimePanelShow;
    this.initTimes();
    this.setData({
      selectTimePanelShow: !selectTimePanelShow
    });
  },
  //cancel select time
  cancelSelectTime:function(){
    this.setData({
      selectTimePanelShow: false
    });
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
    var shop_fee = this.data.shop_fee;
    for (var i = 0, il = foods.length;i<il;i++){
      var food = foods[i];
      var box_num = food.box_num;
      var box_price = food.box_price;
      var price = food.goods_price;
      var count = food.quantity;
      boxPrice += (box_num * box_price * count);
      totalPrice += (price * count);
    }
    this.setData({
      boxPrice: boxPrice,
      totalPrice: totalPrice + boxPrice + shop_fee
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
  //提交订单
  submitOrder:function(){
    var sessionId = wx.getStorageSync("sessionId");
    var totalPrice = this.data.totalPrice;
    var selectedAddress = app.globalData.selectedAddress;
    var remark = this.data.remarkText;
    var receipt = this.data.receipt;//是否开发票
    var delivery_time = this.data.sendTimeForServer;
    var shop_fee = this.data.shop_fee;
    var goods_data = app.globalData.userOrder;
    var shop_id = app.globalData.shop_id;

    var data = {
      shop_id: shop_id,
      sessionId: sessionId,//sessionId
      recipient_name: selectedAddress.member_shipping_name,//接收人姓名
      recipient_phone: selectedAddress.member_shipping_phone,//接收人电话
      recipient_address: selectedAddress.member_shipping_address_show,//接收人地址
      recipient_sex: selectedAddress.member_shipping_sex,//接收人性别
      shipping_fee: shop_fee,//配送费
      total: totalPrice,//总价
      original_price: totalPrice,//原价
      caution: remark,//忌口或备注
      has_invoiced: receipt?1:0,//是否开发票（0-不开，1-开）
      invoice_title: "",//发票抬头
      taxpayer_id: "",//纳税人识别号
      delivery_time: delivery_time,//用户预计送达时间 “立即送达”时为0 其余时间为时间戳格式
      pay_type: 2,//支付类型（1：货到付款；2：在线支付）
      pick_type: "",//取餐类型（0：外卖配送；1：到店自取）
      pickup_time: "",//自取时间
      pickup_mobile: "",//自取电话
      latitude: selectedAddress.latitude,//实际送餐地址纬度
      longitude: selectedAddress.longitude,//实际送餐地址经度
      goods_data: goods_data,//购物车商品
    }
    app.ajax({
      method:"post",
      url:"api/small/addorder",
      data:data,
      success:function(data){
        //支付功能
      }
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
    app.globalData.selectedAddress = selectedAddress;
    var date = new Date();
    var dateIndex = date.getDay();
    var sendData = new Date(date.getTime()+30*60*1000);//30分钟
    var hour = sendData.getHours();
    var min = sendData.getMinutes();
    if(min==0){
      min="00";
    }
    this.setData({
      dateIndex: dateIndex,
      sendTime:"(大约"+hour+":"+min+"分)",
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

    var shop_fee = app.globalData.shop_fee;
    var shopInfo = app.globalData.shopInfo;
    this.setData({
      shop_fee: shop_fee,
      shopInfo: shopInfo
    });

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

    //show remark
    var remark = app.globalData.remark;
    if(remark&&remark!=""){
      this.setData({
        remarkText: remark
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