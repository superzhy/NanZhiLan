// pages/order/index.js
const app = getApp()
let network = require("../../utils/network.js")
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    currentTab: 0,
    scrollLeft: 0,
    winHeight: "",
    clientHeight: '',
    orderShowed: true,
    orderList: ''
  },
  onLoad: function (options) {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight;
        //   clientWidth = res.windowWidth,
        //   rpxR = 750 / clientWidth;
        // var calc = clientHeight * rpxR - 180;
        console.log(clientHeight)
        that.setData({
          winHeight: clientHeight - 88,
          clientHeight: clientHeight
        });
      }
    });

    console.log(options.type)
    if (options.type) {
      this.setData({
        currentTab: options.type
      });
      this.checkCor();
    }

    this.getData('');
  },

  showInput: function () {
    this.setData({
      inputShowed: true,
      orderShowed: false
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      orderShowed: true
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  // 点击标题切换当前页时改变样式
  changeNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  changeTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
    console.log(e.detail.current)
    var currentTab = e.detail.current;
    switch (currentTab) {
      case 0:
        this.getData('')
        break;
      case 1:
        this.getData('P')
        break;
      case 2:
        this.getData('S')
        break;
      case 3:
        this.getData('Y')
        break;
      case 4:
        this.getData('F')
        break;
      case 5:
        this.getData('W')
        break;
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },


  //获取数据
  getData: function (order_state) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    network.POST({
      url: 'order/list',
      params: {
        user_id: app.userId,
        order_state: order_state
      },
      success: function (res) {
        wx.hideLoading()
        // var data = res.data.data;


        if (res.data.code == 200) {
          // console.log(res.data.data);
          that.setData({
            orderList: res.data.data
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

  //提醒发货
  remindShipments: function () {
    wx.showToast({
      title: '提醒发货成功',
    })
  },
  //订单详情
  showOrderDetail: function (e) {
    // console.log(e.currentTarget.id)
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: './details?id=' + id,
    })
  },

  showLogistics: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../logistics/logistics?id=' + id,
    })
  },

  //支付
  toPay: function (e) {
    var price = e.currentTarget.dataset.price
    var orderType = e.currentTarget.dataset.order_type
    console.log(price)
    console.log(orderType)
    console.log(e)
    var id = e.currentTarget.id;
    if (price == 0.00 && orderType==1002){
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
            that.setData({
              currentTab: 3
            });
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
    }else{
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
  payment:function(_data){
    var userId = app.userId
    var that = this;
    wx.requestPayment({
      'timeStamp': _data.timeStamp + '',
      'nonceStr': _data.nonce_str,
      'package': 'prepay_id=' + _data.prepay_id,
      'signType': 'MD5',
      'paySign': _data.pay_sign,
      'success': function (res) {
        // console.log(res)

        console.log('成功');
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
        that.getData('P')
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

  //删除订单
  deleteOrder:function(e){
    var id = e.currentTarget.id;
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    network.POST({
      url: 'order/delete',
      params: {
        order_id: id,
      },
      success: function (res) {
        wx.hideLoading()
        // var data = res.data.data;


        if (res.data.code == 200) {
          console.log(res.data.data);
          that.getData('')
          wx.showToast({
            title: '删除订单成功',
            duration: 2000
          })

        } else {
          console.log(res.data)
          wx.showToast({
            title: '参数错误',
            duration: 2000
          })
        }
      },
    })
  },

  //取消订单
  closeOrder: function (e) {
    var id = e.currentTarget.id;
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    network.POST({
      url: 'order/close/update',
      params: {
        order_id: id,
      },
      success: function (res) {
        wx.hideLoading()
        // var data = res.data.data;


        if (res.data.code == 200) {
          console.log(res.data.data);
          that.getData('P')
          wx.showToast({
            title: '取消订单成功',
            duration: 2000
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


  //确认收货
  confirmReceipt:function(e){
    var id = e.currentTarget.id;
    var that = this;
    network.POST({
      url: 'order/receipt/update',
      params: {
        order_id: id,
      },
      success: function (res) {
        wx.hideLoading()
        // var data = res.data.data;


        if (res.data.code == 200) {
          console.log(res.data.data);
          that.getData('F')
          wx.showToast({
            title: '确定收货成功',
            duration: 2000
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


  //去评价
  showComment:function(e){
    
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

    var pid =e.target.dataset.pid;
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
  },
  /**
     * 生命周期函数--监听页面隐藏
     */
  onHide: function () {
    console.log(222)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log(111111111111111111)

    wx.switchTab({
      url: '../my/my'
    })
  },
})