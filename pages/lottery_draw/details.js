// pages/lottery_draw/details.js

const app = getApp()
let network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    //设置数据
    this.systemInfo = wx.getSystemInfoSync()
    this.setData({
      windowHeight: this.systemInfo.windowHeight,
    })

    //执行方法
    this.getData(options.activity_id)
  },


  getData: function (activity_id){
    var that =this;

    wx.showLoading({
      title: '加载中',
    })

    network.POST({
      url: 'activity/product/detail',
      params: {
        activity_id: activity_id
      },
      success: function (res) {
        wx.hideLoading();
        var data = res.data.data;
        console.log(data)
        if (res.data.code == 200) {
          that.setData({
            goods: res.data.data,
            imglist:res.data.data.img_src
          })
        } else {
          wx.showToast({
            title: '获取信息失败',
            icon: 'success',
            duration: 2000
          })
        }
      },
    })
  },

  //去购买
  toPay: function () {
    var goodsName = this.data.goods.main_title;
    var sPrice = this.data.goods.activity_price;
    var activity_id = this.data.goods.activity_id
    var goodsImg = this.data.imglist[0]
    var data = {
      goodsName: goodsName,
      sPrice: sPrice,
      orderType: 1003,
      activity_id: activity_id,
      goodsImg: goodsImg
    }
    data = JSON.stringify(data);
    app.redirect('pay/pay', 'data=' + data);
  }
})