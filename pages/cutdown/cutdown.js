// pages/cutdown/cutdown.js
const app = getApp()
let network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
  showALL:true,
   list:"",
   myList:'',
   Tab:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    this.getMyData();
  },

  //页面加载完成
  onReady:function(){

  },

  onShow:function(){
  },
  getData:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    network.GET({
      url: 'bargain/product/list',
      params: {},
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          console.log(res)
          that.setData({
            list:res.data.data
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

  getMyData:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    network.POST({
      url: 'bargain/user/list',
      params: {
        user_id:app.userId
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          console.log(res)
          that.setData({
            myList: res.data.data
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

  nowTiem:function(){

  },

  //打开砍价详情
  showcutdownDetails:function(e){
    
    var bargain_id = e.currentTarget.dataset.bargain_id
    var userId = app.userId;
    console.log(bargain_id)
    console.log(userId)
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    network.POST({
      url: 'bargain/create',
      params: {
        user_id:app.userId,
        bargain_id: bargain_id
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          console.log(res);
          var bargain_id = res.data.data.bargain_id;
          app.redirect('cutdown/cutdown-details', 'bargain_id=' + bargain_id);
        } else {
          console.log(res.data.code)
          wx.showToast({
            title: res.data.message,
            icon: 'none',
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


  showDetails:function(e){
    var bargain_id = e.currentTarget.dataset.bargain_id
    app.redirect('cutdown/cutdown-details', 'bargain_id=' + bargain_id);
  },
  //切换
  changeTab:function(e){
    var type = e.currentTarget.dataset.type
    // console.log(type)
    if(type==1){
      this.getData();
      this.setData({
        showALL:true,
        Tab:0
      })
    }else {
      this.getMyData();
      this.setData({
        showALL:false,
        Tab: 1
      })
    }
  },


  //刷新我的
  refreshMy:function(){
    // this.getMyData();
  },
  refreshAll:function(){
    // this.getData();
  },
  onShareAppMessage: function () {
  
  }
})