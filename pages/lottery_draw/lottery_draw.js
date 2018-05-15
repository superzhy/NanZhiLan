// pages/lottery_draw/lottery_draw.js
const app = getApp()
let network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    List:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  //初始化数据
  getData:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    network.GET({
      url: 'activity/product/list',
      params: {},
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            List: res.data.data
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

  //打开详情
  openDetails:function(e){
    var activity_id = e.currentTarget.dataset.activity_id
    app.redirect('lottery_draw/details', 'activity_id=' + activity_id);
  }
})