//index.js
//获取应用实例
const app = getApp()
let network = require("../../utils/network.js")
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    goodsList: []
  },
  onLoad: function () {
    console.log('onLoad')
    this.getGoodsList();
  },
  onShow:function(){
    console.log('show')

    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res.code)
        var _code = res.code
        var that = this;
        console.log(_code)


        wx.getUserInfo({
          success: function (res) {
            console.log(res);
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            // console.log(iv)
            // console.log(code)
            // console.log(encryptedData)

            wx.request({
              url: app.API_URL + 'user/wx/login',
              data: {
                code: _code,
                iv: iv,
                encrypted_data: encryptedData
              },
              method: 'POST',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res)
                if (res.data.code == 200) {
                  app.userId = res.data.data.id
                } else {
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
          fail: function (res) {
            // console.log(res);
            wx.openSetting({

            })
          }
        })
      }
    })
  },

  //获取商品列表
  getGoodsList: function () {
    var that =this;
    wx.showLoading({
      title: '加载中',
    })
    network.GET({
      url: 'product/list',
      params: {},
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            goodsList: res.data.data
          })
        } else {
          wx.showToast({
            title: '获取信息失败',
            icon: 'success',
            duration: 2000
          })
        }

      },
      fail: function () {
        wx.showToast({
          title: '连接服务器错误',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  
  //打开商品详情
  openDeails: function (e) {
    let gid = e.currentTarget.dataset.id;
    app.redirect('goods/details','id='+gid);
  },

  openTest:function(){
    app.redirect('test/test');
  },

  openCutdown:function(){
    app.redirect('cutdown/cutdown');
  },
  openLotteryDraw:function(){
    app.redirect('lottery_draw/lottery_draw');
  }


})
