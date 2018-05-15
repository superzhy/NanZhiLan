// pages/my/my.js
const app = getApp()
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "未授权",
    avatarUrl: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo.nickName)
      this.setData({
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl
      })
    }

    console.log('onLoad')
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
    console.log('onShow')    
    var that = this;
    wx.showLoading({
      title: '加载中',
    })

    network.POST({
      url: "order/count/list",
      params: {
        user_id: app.userId
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res)

        if (res.data.code == 200) {
          that.setData({
            f: res.data.data.F,
            p: res.data.data.P,
            s: res.data.data.S,
            w: res.data.data.W,
            y: res.data.data.Y,
          })
        } else {
          console.log(1111111111)
          console.log(res)
          wx.showToast({
            title: '参数错误',
          })
        }
      }
    })
  },
  update:function(){
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId

        // this.globalData.userInfo = res.userInfo

        this.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
        // console.log(this.globalData);

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  },

  //打开订单
  showOrder: function (e) {
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../order/index?type=' + type
    })
  },
  //打开设置
  openSetting: function () {
    wx.openSetting({
      success: (res) => {
        /*
         * res.authSetting = {
         *   "scope.userInfo": true,
         *   "scope.userLocation": true
         * }
         */
      }
    })
  },

  //打开地址
  showAddress: function () {
    wx.navigateTo({
      url: '../address/address?type=' + 'my',
    })
  }
})