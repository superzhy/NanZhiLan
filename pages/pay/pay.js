// pages/pay/pay.js
const app = getApp()
let network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: '',
    goodsId: '',
    data: '',
    sClassifyNum: 1,
    totalPrice: '',
    address: '',
    sAddress: '',
    btnLoading: false,
    btnDisabled: false,
    groupTip: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.data) {
      var data = JSON.parse(options.data);
      this.setData({
        data: data,

        totalPrice: data.sPrice,
      })
      if (data.goods) {
        this.setData({
          goods: data.goods,
          goodsId: data.goods.product.id,
          sClassifyNum: data.sClassifyNum,

        })
      }
      if (data.spellOrderId) {
        this.setData({
          spellOrderId: data.spellOrderId
        })
      } else {
        this.setData({
          spellOrderId: ''
        })
      }
      console.log(this.data.goodsId)
    }






    //获取地址
    this.getAddress();
  },

  //数量增加
  numAdd: function () {
    var maxNum = this.data.data.maxNum;
    // console.log(maxNum)
    var num = this.data.sClassifyNum;
    // console.log(num);

    if (!maxNum) {
      wx.showToast({
        title: '请选择产品',
        icon: "none",
        duration: 1000
      })
    } else if (num >= maxNum) {
      wx.showToast({
        title: '最多购买' + maxNum + '个',
        icon: "none",
        duration: 1000
      })
    } else {

      num++;
      // var totalPrice = num * this.data.data.sPrice
      var totalPrice = this.accMul(num, this.data.data.sPrice)
      // console.log(totalPrice);
      this.setData({
        sClassifyNum: num,
        totalPrice: totalPrice
      })
    }

  },
  numReduce: function () {
    var maxNum = this.data.data.maxNum;
    if (!maxNum) {
      wx.showToast({
        title: '请选择产品',
        icon: "none",
        duration: 1000
      })
    } else {
      var num = this.data.sClassifyNum;
      if (num <= 1) {
        wx.showToast({
          title: '数量不能为0',
          icon: "none",
          duration: 1000
        })
      } else {
        num--;
        var totalPrice = this.accMul(num, this.data.data.sPrice)
        this.setData({
          sClassifyNum: num,
          totalPrice: totalPrice
        })
      }
    }

  },

  //浮点相乘
  accMul: function (arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  },


  //获取用户地址
  getAddress: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.API_URL + 'address/list',
      data: {
        user_id: app.userId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        if (res.data.code == 200) {
          var sAddress;
          if (res.data.data.length > 0) {
            for (var i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].is_default == 1) {
                sAddress = res.data.data[i]
              }
            }
          }
          if (sAddress) {
            that.setData({
              address: res.data.data,
              sAddress: sAddress
            })
          }

          // console.log(sAddress)
        } else {
          wx.showToast({
            title: '参数错误',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '连接服务器错误',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  //获取微信收货地址
  getWechatAddress: function () {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        // console.log(res.userName)
        // console.log(res.postalCode)
        // console.log(res.provinceName)
        // console.log(res.cityName)
        // console.log(res.countyName)
        // console.log(res.detailInfo)
        // console.log(res.nationalCode)
        // console.log(res.telNumber)

        let name = res.userName;
        let phone = res.telNumber
        let address = res.provinceName + res.cityName + res.countyName + res.detailInfo;
        // console.log(address);

        wx.showLoading({
          title: '加载中',
        })

        wx.request({
          url: app.API_URL + 'address/create',
          data: {
            user_id: app.userId,
            receiving_name: name,
            receiving_phone: phone,
            receiving_address: address
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            wx.hideLoading();
            if (res.data.code == 200) {
              wx.showToast({
                title: '添加成功',
                icon: 'none',
                duration: 2000
              })

              that.getAddress();
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '连接服务器错误',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },

  //打开地址列表
  openAddressList: function (e) {
    let id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '../address/address?addressId=' + id
    })
  },

  //提交订单
  submit: function () {


    let sid = this.data.data.sid;
    let num = this.data.sClassifyNum
    let addressId = this.data.sAddress.id;
    let orderType = this.data.data.orderType;
    let bargain_id = this.data.data.bargain_id;
    let activity_id = this.data.data.activity_id;
    // console.log(sid);
    // console.log(num);
    console.log(addressId);
    console.log(orderType);

    if (addressId && orderType == 1002) {
      this.cutdownPay(bargain_id, addressId)
      // if (orderType == 1002) {
      //   this.cutdownPay(bargain_id, addressId)
      // }
      // if (orderType == 1003) {
      //   this.activityPay(activity_id, addressId)
      // }
    } else if (addressId && orderType == 1003) {
      this.activityPay(activity_id, addressId)
    } else if (sid && num && addressId && orderType) {
      this.setData({
        btnLoading: true,
      })
      if (orderType == 1000) {
        this.alonePay(sid, num, addressId, orderType)
      } else if (orderType == 1001) {
        // console.log(this.data.spellOrderId)
        var spellOrderId = this.data.spellOrderId;
        this.groupPay(sid, num, addressId, orderType, spellOrderId)
      }

    } else {
      wx.showToast({
        title: '信息不完整',
        icon: 'success',
        duration: 2000
      })
    }



  },
  alonePay: function (sid, num, addressId, orderType) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    // console.log(app.userId)
    var userId = app.userId
    wx.request({
      url: app.API_URL + 'order/create',
      data: {
        user_id: userId,
        sale_id: sid,
        buy_num: num,
        address_id: addressId,
        // order_type: orderType
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        that.setData({
          btnLoading: false,
        })
        // console.log(res.data)
        if (res.data.code == 200) {
          wx.showToast({
            title: '成功',
            icon: 'none',
            duration: 2000
          })

          that.payment(res.data.data);
        } else {
          wx.showToast({
            title: '参数错误',
            icon: 'none',
            duration: 2000
          })
        }
        // console.log(res.data)
      },
      fail: function (res) {
        wx.showToast({
          title: '连接服务器错误',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  groupPay: function (sid, num, addressId, orderType, spellOrderId) {
    // if (!spellOrderId)
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    // console.log(app.userId)
    var userId = app.userId
    wx.request({
      url: app.API_URL + 'order/spell/create',
      data: {
        user_id: userId,
        sale_id: sid,
        buy_num: num,
        address_id: addressId,
        spell_order_id: spellOrderId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        that.setData({
          btnLoading: false,
        })
        console.log(res.data)
        if (res.data.code == 200) {
          wx.showToast({
            title: '成功',
            icon: 'none',
            duration: 2000
          })

          that.payment(res.data.data);
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
        // console.log(res.data)
      },
      fail: function (res) {
        wx.showToast({
          title: '连接服务器错误',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  cutdownPay: function (bargain_id, addressId) {
    console.log(bargain_id)

    var that = this;
    wx.showLoading({
      title: '加载中',
    })

    network.POST({
      url: 'order/bargain/create',
      params: {
        bargain_id: bargain_id,
        user_id: app.userId,
        address_id: addressId
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          console.log(res)

          var price = that.data.data.sPrice;
          console.log(price)
          var order_id;
          order_id = res.data.data.order_id ? res.data.data.order_id : '';
          console.log(order_id)
          if (price == 0.00 || price == 0) {
            console.log('0元')

            that.setOrderStatus(order_id)
          } else {
            that.payment(res.data.data);
          }
        } else {
          console.log(res);
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




  setOrderStatus: function (order_id) {
    console.log(order_id)

    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    network.POST({
      url: 'order/bargain/update',
      params: {
        order_id: order_id,
      },
      success: function (res) {
        wx.hideLoading()
        // var data = res.data.data;


        if (res.data.code == 200) {
          wx.showToast({
            title: '成功',
            duration: 2000
          })

          function redirect() {
            wx.navigateTo({
              url: '../order/index?type=' + 3
            })
          }
          setTimeout(redirect, 1500)
        } else {
          console.log(res)
          wx.showToast({
            title: '参数错误',
            duration: 2000
          })
        }
      },
    })
  },


  activityPay: function (activity_id, addressId) {
    console.log(activity_id, addressId)

    var that = this;
    wx.showLoading({
      title: '加载中',
    })

    network.POST({
      url: 'order/activity/create',
      params: {
        activity_id: activity_id,
        user_id: app.userId,
        address_id: addressId
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          // console.log(res)
          that.payment(res.data.data)
        } else {
          console.log(res);
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

  payment: function (_data) {
    // console.log(_data)
    var spellOrderId = this.data.spellOrderId;
    console.log(spellOrderId)
    var userId = app.userId
    var that = this;
    wx.requestPayment({
      'timeStamp': _data.timeStamp + '',
      'nonceStr': _data.nonce_str,
      'package': 'prepay_id=' + _data.prepay_id,
      'signType': 'MD5',
      'paySign': _data.pay_sign,
      'success': function (res) {
        // console.log('成功');
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })

        //拼单支付完成跳转分享
        if (that.data.data.orderType == 1001) {
          if (spellOrderId) {
            network.POST({
              url: 'spell/state/detail',
              params: {
                spell_order_id: spellOrderId
              },
              success: function (res) {
                var data = res.data.data;
                console.log(data)
                if (res.data.code == 200) {
                  if (res.data.data.order_state == "S") {
                    wx.navigateTo({
                      url: '../order/index?type=' + 2
                    })
                  } else {
                    wx.navigateTo({
                      url: '../order/index?type=' + 3
                    })
                  }
                } else {
                  wx.showToast({
                    title: '获取信息失败',
                    icon: 'success',
                    duration: 2000
                  })
                }
              },
            })
          } else {
            wx.navigateTo({
              url: '../order/index?type=' + 2
            })
          }

        } else if (that.data.data.orderType == 1002) {
          wx.navigateTo({
            url: '../order/index?type=' + 3
          })
        }
        else if (that.data.data.orderType == 1003) {
          wx.navigateTo({
            url: '../order/index?type=' + ''
          })
        }
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
  }
})