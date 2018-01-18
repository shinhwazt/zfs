//app.js
App({
  //检查用户登录状态
  checkSession: function (handler) {
    var _this = this;
    wx.checkSession({
      success:function(){
        var sessionId = wx.getStorageSync("sessionId");

        var is_register = wx.getStorageSync('is_register');
        if (is_register == false) {
          wx.navigateTo({
            url: '../register/register',
          });
          return;
        }

        if (sessionId){
          wx.getUserInfo({
            success: function (res) {
              _this.globalData.userInfo = res.userInfo;
            }
          });
          handler();
        }else{
          _this.userLogin(handler); //重新登录
        }
        
        
      },
      fail: function () {
        //登录态过期
        console.log("shibai")
        _this.userLogin(handler); //重新登录
      }
    });
  },
  
  //用户登录
  userLogin: function (handler) {
    var _this = this;
    wx.showLoading({
      title: '用户登录中',
      mask: true
    });
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
                wx.hideLoading();
                var is_register = data.data.is_register;
                wx.setStorageSync('sessionId', data.data.sessionId);
                
                wx.setStorageSync('is_register', is_register);
                if (!is_register){
                  wx.navigateTo({
                    url: '../register/register',
                  });
                }else{
                  
                  wx.getUserInfo({
                    success: function (res) {
                      console.log(res)
                      _this.globalData.userInfo = res.userInfo;
                    }
                  });
                  handler();

                }

                
              }else{
                wx.hideLoading();
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
    var _this = this;
    var sessionId = wx.getStorageSync("sessionId");
    var _default = {
      method:"get",
      success:function(){},
      fail:function(){},
      complete: function () { },
    }
    
    Object.assign(_default,obj);
    var ajaxObj = {
      url: _this.globalData.serverUrl + obj.url,
      method: _default.method,
      header: {
        'sessionId': sessionId // 默认值
      },
    }
    _default.data ? ajaxObj.data = _default.data:"";
    _default.success ? ajaxObj.success = _default.success : "";
    _default.fail ? ajaxObj.fail = _default.fail : "";
    _default.complete ? ajaxObj.complete = _default.complete : "";
    


    wx.request(ajaxObj);
  },
  onLaunch: function () {
    //this.checkSession();
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
    //serverUrl: "https://erpapi.zaofanshi.com/",
    openid:"",
    small_view_id:"d00c46fdb9bd41048cb4c9848dfb1050",
    
  }
})