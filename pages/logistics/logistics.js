const app = getApp()
let network = require("../../utils/network.js")
Page({
  data: {
    logisticsInfo:"",
    trackListH:"100px",
    showOption:true
  },

  //页面加载  
  onLoad: function (options) {
    var id = options.id;
    console.log(id)
    this.getData(id)
  },
  getData:function(_id){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    network.POST({
      url: 'express/detail',
      params: {
        order_id: _id
      },
      success: function (res) {
        wx.hideLoading()
        // var data = res.data.data;


        if (res.data.code == 200) {
          console.log(res.data.data);
          that.setData({
            logisticsInfo: res.data.data
          })

        } else {
          wx.showToast({
            title: '参数错误',
            duration: 2000
          })
        }
      },
    })
  },
  showTrack:function(){
    this.setData({
      trackListH:'auto',
      showOption:false
    })
  }
})