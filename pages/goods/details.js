// pages/goods_details/goods_details.js
const app = getApp()
let network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    showModalStatus: false,
    windowHeight: '',
    goodsId: '',
    goods: '',
    goodsImg: '',
    classify1: [],
    classify2: [],
    sClassify1: "",
    sClassify2: "",
    sClassify2ID: "",
    sClassifyNum: 1,
    maxNum: '',
    sPrice: '',
    orderType: '',

    comment: '',
    commentWord: '',
    showGroup:false,
    spellOrderId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.systemInfo = wx.getSystemInfoSync()
    this.setData({
      windowHeight: this.systemInfo.windowHeight,
      goodsId: options.id
    })
    this.init(options.id);  //初始化数据
    this.getComment(options.id);
    this.getCommentWord(options.id);
    this.getGroup(options.id);
    console.log(options);

    console.log(options)
    if (options.spellOrderId) {
      this.setData({
        spellOrderId: options.spellOrderId
      })
    }
  },


  init(_id) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })

    network.POST({
      url: 'product/detail',
      params: {
        id: _id
      },
      success: function (res) {
        wx.hideLoading();
        var data = res.data.data;
        if (res.data.code == 200) {
          that.setData({
            goods: res.data.data,
            imgUrls: res.data.data.product.img_src,
          })


          // if (data.spell_list){
          //   console.log(1)
          // }else

          // console.log(that);
          // that.goods = data;
          // console.log(this.goods);
          that.goodsInfo = data;
          that.list = data.list;
          that.spellList = data.spell_list;

          // console.log(that)
          // console.log(that.list);
          // console.log(that.spellList);
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
  //获取评论关键字
  getCommentWord(_id) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })

    network.POST({
      url: 'comment/word/list',
      params: {
        pid: _id
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        var data = res.data.data;
        if (res.data.code == 200) {
          that.setData({
            commentWord: res.data.data
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
  //获取评论
  getComment(_id) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })

    network.POST({
      url: 'comment/list',
      params: {
        pid: _id
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        var data = res.data.data;
        if (res.data.code == 200) {
          that.setData({
            comment: res.data.data
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
  // getData: function (_id, _url) {
  //   // console.log(_id)
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   var that = this;
  //   wx.request({
  //     url: app.API_URL + _url,
  //     data: {
  //       id: _id
  //     },
  //     method: 'POST',
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success: function (res) {
  //       wx.hideLoading();
  //       console.log(res.data)
  //       if (res.data.code == 200) {
  //         // console.log()
  //         that.setData({
  //           goods: res.data.data,
  //           imgUrls: res.data.data.product.img_src,
  //           list: res.data.data.list,
  //           classify2: res.data.data.list[0].spec,
  //           goodsImg: res.data.data.list[0].img_src,
  //           sPrice: res.data.data.product.discount_price
  //         })
  //         // console.log(res.data)
  //       } else {
  //         wx.showToast({
  //           title: res.data.message,
  //           icon: 'none',
  //           duration: 2000
  //         })
  //       }
  //     },
  //     fail: function (res) {
  //       wx.showToast({
  //         title: '连接服务器错误',
  //         duration: 2000
  //       })
  //     }
  //   })
  // },






  //打开评论页
  showComment:function(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: './goods_comment?id=' + id
    })
  },
  time:function(){
    return 1
  },

  //获取拼团信息
  getGroup:function(_id){
    console.log(_id);
    var that = this;
    network.POST({
      url: 'order/spell/list',
      params: {
        pid: _id
      },
      success: function (res) {
        // console.log(res)
        var data = res.data.data;
        console.log(data)
        if (res.data.code == 200) {
          that.setData({
            groupList: res.data.data.list
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


  showGroup:function(){
    var groupList = this.data.groupList;
    if (groupList.length=2) {
      this.setData({
        showGroup: true,
      })
    }
    
  },

  hiddenGroup:function(){
    this.setData({
      showGroup: false,
    })
  },









//打开model
  showModal: function (e) {
    console.log(e)
    var type = e.currentTarget.dataset.type;
    var spell_order_id = e.currentTarget.dataset.spell_order_id
    console.log(spell_order_id)
    if(spell_order_id){
      this.setData({
        spellOrderId:spell_order_id
      })
    }
    //设置orderType
    if(type=='alone'){
      this.setData({
        orderType:1000
      })
    } else if (type == 'group') {
      this.setData({
        orderType: 1001
      })
    }




    var goodsList = type == 'alone' ? this.goodsInfo.list : this.goodsInfo.spell_list;
    console.log(type)
    console.log(this.goodsInfo.spell_list)
    console.log(goodsList);
    var specList, goodsImg, sPrice;
    if (goodsList.length>0) {
        specList = goodsList[0].spec;
        goodsImg = goodsList[0].img_src;
        sPrice = this.goodsInfo.product.discount_price
        app.showModal(this);
    } else {
      specList = [];
      goodsImg = '';
      sPrice = '';
    }
    this.setData({
      goodsList: goodsList,
      specList: specList,
      goodsImg: goodsImg,
      sPrice: sPrice
    })
    console.log(app)
    
  },


  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },


  //类别1
  classifyOne: function (e) {
    var index = e.currentTarget.dataset.index
    var goodsList = this.data.goodsList;
    this.setData({
      specList: goodsList[index].spec,
      goodsImg: goodsList[index].img_src,
      sClassify1: goodsList[index].name,
      sClassify2: '',
      maxNum:'',
      specListId: "",
      sClassifyNum: 1,
    })

    //设置按钮选中
    var currentItem = e.currentTarget.dataset;
    var data = goodsList.map(function (item) {
      if (item.id != currentItem.id) {
        item.isChecked = false
      } else {
        item.isChecked = true
      }
      return item
    })
    this.setData({
      goodsList: data
    });


  },

  //类别2
  classifyTwo: function (e) {
    var index = e.currentTarget.dataset.index
    console.log(index);
    
    

    //设置按钮选中
    var currentItem = e.currentTarget.dataset;
    var specList = this.data.specList;
    var data = specList.map(function (item) {
      if (item.id != currentItem.id) {
        item.isChecked = false
      } else {
        item.isChecked = true
      }
      return item
    })
    this.setData({
      specList: data,
      specListId: specList[index].sid,
      sClassify2: specList[index].name,
      maxNum: specList[index].sale_stock,
      sPrice: specList[index].discount_price
    });
  },

  //数量增加
  numAdd: function () {
    var maxNum = this.data.maxNum;
    var num = this.data.sClassifyNum;
    console.log(maxNum);

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
      this.setData({
        sClassifyNum: num
      })
    }

  },
  numReduce: function () {
    var maxNum = this.data.maxNum;
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
        this.setData({
          sClassifyNum: num
        })
      }

    }

  },
  //提交订单
  submit: function () {
    var sClassify1 = this.data.sClassify1;
    var sid = this.data.specListId;
    var num = this.data.sClassifyNum;
    var spellOrderId = this.data.spellOrderId;
    console.log(num)
    console.log(sid)
    console.log(sClassify1)
    console.log(this.data.spellOrderId)
    if (!sClassify1) {
      wx.showToast({
        title: '请选择商品',
        icon: "none",
        duration: 1000
      })
    } else if (!sid) {
      wx.showToast({
        title: '请选择商品',
        icon: "none",
        duration: 1000
      })
    } else if (num == 0) {
      wx.showToast({
        title: '请选择数量',
        icon: "none",
        duration: 1000
      })
    }
    else {
      wx.showToast({
        title: 'ok',
        icon: "none",
        duration: 1000
      })
      var data = {
        goods: this.data.goods,
        goodsImg: this.data.goodsImg,
        goodsName: this.data.goods.product.main_title,
        sClassify1: this.data.sClassify1,
        sClassify2: this.data.sClassify2,
        sClassifyNum: this.data.sClassifyNum,
        sid: this.data.specListId,
        maxNum: this.data.maxNum,
        sPrice: this.data.sPrice,
        orderType: this.data.orderType,
        spellOrderId: spellOrderId
      }

      console.log(data)
      data = JSON.stringify(data);
      wx.navigateTo({
        url: '../pay/pay?data=' + data
      })
    }

  },

  
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.goods.main_title,
      path: 'pages/goods/details?id='+this.data.goodsId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})