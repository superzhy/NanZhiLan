// pages/order/comment.js
const app = getApp()
let network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upImg: [],
    commentCont: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var goodsInfo = JSON.parse(options.goodsInfo);
    // console.log(goodsInfo)
    console.log(options.orderId);
    this.setData({
      goodsInfo: goodsInfo,
      price: options.price,
      sid: options.saleId,
      orderId: options.orderId
    })
  },
  //上传图片
  upImg: function () {
    console.log("上传图片")
    var that = this;
    wx.chooseImage({
      count: 6,
      sizeType: [],
      sourceType: [],
      success: function (res) {
        // console.log(res)
        var tempFilePaths = res.tempFilePaths;
        var imgArr = that.data.upImg;
        console.log(tempFilePaths)
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          imgArr.push(res.tempFilePaths[i])
        }
        console.log(imgArr)
        that.setData({
          upImg: imgArr
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },


  //获取输入内容
  commentCont: function (e) {
    this.setData({
      commentCont: e.detail.value
    })
  },
  sumbit: function () {
    // console.log(this.data.upImg)

    // var pics = this.data.upImg;
    // app.uploadimg({
    //   url: 'https://fruits-api.hnjxwl.com/api/comment/img/create/23',//这里是你图片上传的接口
    //   path: pics//这里是选取的图片的地址数组
    // });

    console.log(this.data.commentCont)
    var commentCont = this.data.commentCont;
    var orderId = this.data.orderId;
    if (!commentCont) {
      wx.showToast({
        title: '请填写评论内容',
        icon: 'none'
      })
    } else {
      var that = this;
      wx.showLoading({
        title: '加载中',
      })
      network.POST({
        url: 'comment/create',
        params: {
          order_id: orderId,
          value: commentCont,

        },
        success: function (res) {
          wx.hideLoading()
          // var data = res.data.data;
          console.log(res.data.data);

          if (res.data.code == 200) {
            console.log(res.data.data);
            var comment_id = res.data.data.comment_id;
            if (that.data.upImg.length>0) {
              // console.log(111)
              var pics = that.data.upImg;
              app.uploadimg({
                url: app.API_URL+'comment/img/create/'+comment_id,//这里是你图片上传的接口
                path: pics//这里是选取的图片的地址数组
              });

              var pages = getCurrentPages();
              var currPage = pages[pages.length - 1];   //当前页面
              var prevPage = pages[pages.length - 2];  //上一个页面
              console.log(prevPage)
              prevPage.setData({
                currentTab: 0
              })
              prevPage.checkCor();
              wx.navigateBack();
            }else {
              console.log('没有上传图片')
              var pages = getCurrentPages();
              var currPage = pages[pages.length - 1];   //当前页面
              var prevPage = pages[pages.length - 2];  //上一个页面
              console.log(prevPage)
              prevPage.setData({
                currentTab: 0
              })
              prevPage.checkCor();
              wx.navigateBack();
            }
          } else {
            wx.showToast({
              title: '参数错误',
              duration: 2000,
              icon: 'none'
            })
          }
        },
      })
    }
  }
})