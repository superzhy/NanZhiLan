//app.js
App({
  userId:'',
  code:'',
  API_URL: 'https://fruits-api.hnjxwl.com/api/',
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that =this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res.code)
        var _code = res.code
        var that = this;
        // console.log(_code)


        wx.getUserInfo({
          success: function (res) {
            // console.log(res);
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            // console.log(iv)
            // console.log(code)
            // console.log(encryptedData)

            wx.request({
              url: that.API_URL + 'user/wx/login',
              data: {
                code: _code,
                iv:iv,
                encrypted_data: encryptedData
              },
              method: 'POST',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                // console.log(res)
                if(res.data.code==200){
                  that.userId = res.data.data.id
                }else {
                  wx.showToast({
                    title: '参数错误',
                    duration: 2000
                  })
                }
                

              },
              fail: function (res) {
                wx.showToast({
                  title: '连接服务器错误',
                  duration: 2000
                })
              }
            })
          },
          fail:function(res){
            // console.log(res);
            wx.openSetting({
              
            })
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {

        // console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId

              this.globalData.userInfo = res.userInfo

              // console.log(this.globalData);

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          // wx.authorize({
          //   scope: 'scope.record',
          //   success() {
          //     // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          //     wx.startRecord()
          //   }
          // })
        }
      }
    })





  },
  globalData: {
    userInfo: null
  },



  //窗口跳转
  redirect: function (url, param) {
    if(param){
      wx.navigateTo({
        url: '/pages/' + url + '?' + param
      })
    }else {
      wx.navigateTo({
        url: '/pages/' + url
      })
    }
  },

  showModal: function (that) {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    that.animation = animation
    animation.translateY(300).step()
    that.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }.bind(that), 200)
  },


  //多张图片上传
  uploadimg:function (data){
    var that= this,
    i=data.i ? data.i : 0,//当前上传的哪张图片
    success=data.success ? data.success : 0,//上传成功的个数
    fail=data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'imgs',//这里根据自己的实际情况改
      formData: null,//这里是上传图片时一起上传的数据
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
        console.log(resp)
        console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {   //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {//若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });
  }

})