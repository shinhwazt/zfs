//app.js
App({
  //检查用户登录状态
  checkSession: function () {
    var _this = this;
    wx.checkSession({
      success:function(){
        console.log("chengong");
        wx.getUserInfo({
          success: function (res) {
            console.log(res);
            _this.globalData.userInfo = res.userInfo;
          }
        });
      },
      fail: function () {
        //登录态过期
        console.log("shibai")
        _this.userLogin(); //重新登录
      }
    });
  },
  //用户登录
  userLogin: function () {
    var _this = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            method: "post",
            url: _this.globalData.serverUrl + "api/small/onlogin",
            data: {
              code: res.code
            },
            success:function(data){
              var data = data.data;
              if(data.state==1000){
                wx.setStorageSync('userSession', data.sessionId);
                wx.getUserInfo({
                  success: function (res) {
                    console.log(res)
                    _this.globalData.userInfo = res.userInfo;
                  }
                });
              }else{
                //shibai
                wx.showToast({
                  title: '登录异常',
                  icon: 'success',
                  duration: 2000
                })
              }
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  //封装ajax
  /**
   * obj.method  请求方式
   * obj.url 请求地址
   * obj.data  请求方式
   * obj.header 请求地址
   * obj.dataType 请求成功回调函数
   * obj.responseType  请求方式
   * 
   * obj.fail 请求地址
   * obj.complete 请求成功回调函数
   * obj.success 请求成功回调函数
   
   */
  ajax:function(obj){
    
  },
  onLaunch: function () {
    this.checkSession();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    
  },
  globalData: {
    userInfo: null,
    userOrder:[],
    totoalCount:0,
    totalPrice:"",
    serverUrl:"http://localhost:30664/",
    openid:"",
    small_view_id:"d00c46fdb9bd41048cb4c9848dfb1050",
    
  }
})