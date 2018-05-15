// pages/cutdown/cutdown-details.js
const app =getApp();
let network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:''
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      bargain_id: options.bargain_id
    })
    //执行方法
    this.helpcutdown(options.bargain_id)
    // this.init(options.bargain_id)  //初始化数据
    
  },
  init: function (bargain_id){
    wx.showLoading({
      title: '正在加载',
    })
    var that = this;
    network.POST({
      url: 'bargain/detail',
      params: {
        bargain_id: bargain_id,
        user_id:app.userId
      },
      success:function(res){
        wx.hideLoading()
        console.log(res)
        if(res.data.code==200){
          that.setData({
            data:res.data.data
          })
        }else {
          wx.showToast({
            title: '参数错误',
            icon:'none'
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '连接服务器错误',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },


  helpcutdown: function (bargain_id){
    console.log(app.userId)
    var that = this;
    network.POST({
      url: 'bargain/user/create',
      params: {
        bargain_id: bargain_id,
        user_id: app.userId
      },
      success: function (res) {
        wx.hideLoading()
        console.log(11111)
        console.log(res)
        that.init(bargain_id)
        if (res.data.code == 200) {
          // that.setData({
          //   data: res.data.data
          // })

        } else {
          
          // wx.showToast({
          //   title: '参数错误',
          //   icon: 'none'
          // })
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
  //分享
  onShareAppMessage: function (e) {
    console.log(e)
    var bargain_id = this.data.bargain_id
    return {
      title: '自定义转发标题',
      path: 'pages/cutdown/cutdown-details?bargain_id=' + bargain_id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  pay:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var bargain_id = that.data.bargain_id
    network.POST({
      url:'bargain/buy/create',
      params: {
        bargain_id: bargain_id,
        user_id: app.userId
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.code == 200) {
          // that.setData({
          //   data: res.data.data
          // })
          if(res.data.data.state==0){
            that.toPay()
          }else {
            wx.navigateTo({
              url: '../order/index?type=' + 1
            })
          }
          
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
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

  //去购买
  toPay:function(){
    var goodsName = this.data.data.product_info.main_title;
    var sPrice = this.data.data.initiator_info.pay_price;
    var bargain_id = this.data.bargain_id
    var goodsImg = this.data.data.product_info.img_src
    console.log(goodsName);
    var data={
      goodsName: goodsName,
      sPrice: sPrice,
      orderType:1002,
      bargain_id: bargain_id,
      goodsImg: goodsImg
    }
    data = JSON.stringify(data);
    app.redirect('pay/pay','data='+data);
  }
})