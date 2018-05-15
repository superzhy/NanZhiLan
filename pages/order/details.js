// pages/order/details.js
const app = getApp()
let network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:'',
    order_id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        order_id: options.id
      })
      this.getData(options.id)
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  

  //获取数据
  getData:function(_id){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    network.POST({
      url: 'order/detail',
      params: {
        order_id:_id
      },
      success: function (res) {
        wx.hideLoading()
        // var data = res.data.data;


        if (res.data.code == 200) {
          console.log(res.data.data);
          that.setData({
            orderInfo: res.data.data
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

  //打开商品
  showGoodsDetails:function(e){
    var id = e.currentTarget.id;
    var order_type = e.currentTarget.dataset.order_type
    if(order_type==1002){
      wx.navigateTo({
        url: '../cutdown/cutdown',
      })
    }
    if(order_type==1003){
      wx.navigateTo({
        url: '../lottery_draw/lottery_draw',
      })
    }
    else {

      wx.navigateTo({
        url: '../goods/details?id=' + id,
      })
    }
  },

  //打开物流
  showLogistics: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../logistics/logistics?id=' + id,
    })
  },

  //提醒发货
  remindShipments: function () {
    wx.showToast({
      title: '提醒发货成功',
    })
  },

  //支付
  toPay: function (e) {
    var price = e.currentTarget.dataset.price
    var orderType = e.currentTarget.dataset.order_type
    console.log(price)
    console.log(orderType)
    var id = e.currentTarget.id;
    if (price == 0.00 && orderType == 1002) {
      console.log('0元')

      wx.showLoading({
        title: '加载中',
      })
      var that = this;
      network.POST({
        url: 'order/bargain/update',
        params: {
          order_id: id,
        },
        success: function (res) {
          wx.hideLoading()
          // var data = res.data.data;


          if (res.data.code == 200) {
            wx.showToast({
              title: '成功',
              duration: 2000
            })
            that.getData(that.data.order_id)
            // setTimeout(',100)
          } else {
            console.log(res)
            wx.showToast({
              title: '参数错误',
              duration: 2000
            })
          }
        },
      })
    }else {
      wx.showLoading({
        title: '加载中',
      })
      var that = this;
      network.POST({
        url: 'order/pay',
        params: {
          order_id: id,
        },
        success: function (res) {
          wx.hideLoading()
          // var data = res.data.data;


          if (res.data.code == 200) {
            console.log(res.data.data);
            that.payment(res.data.data);

          } else {
            wx.showToast({
              title: '参数错误',
              duration: 2000
            })
          }
        },
      })
    }
    

  },
  //付款
  payment: function (_data) {
    var userId = app.userId
    var that = this;
    wx.requestPayment({
      'timeStamp': _data.timeStamp + '',
      'nonceStr': _data.nonce_str,
      'package': 'prepay_id=' + _data.prepay_id,
      'signType': 'MD5',
      'paySign': _data.pay_sign,
      'success': function (res) {
        console.log('成功');
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
        that.getData(that.data.order_id)
      },
      'fail': function (res) {
        console.log(res)
        wx.showToast({
          title: '支付失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  showComment: function (e) {

    console.log(e.currentTarget.dataset)
    var price = e.currentTarget.dataset.price;
    var saleId = e.currentTarget.dataset.saleid;
    var orderId = e.currentTarget.dataset.id;
    var goodsInfo = JSON.stringify(e.currentTarget.dataset.goodsinfo);
    console.log(goodsInfo)
    wx.navigateTo({
      url: './comment?goodsInfo=' + goodsInfo + '&price=' + price + '&saleId=' + saleId + '&orderId=' + orderId,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e);

    var pid = e.target.dataset.pid;
    var spell_order_id = e.target.dataset.spell_order_id;
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    return {
      title: '拼这个商品',
      path: 'pages/goods/details?id=' + pid + '&spellOrderId=' + spell_order_id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})