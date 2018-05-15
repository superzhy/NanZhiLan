// pages/goods_details/goods_details.js
const app = getApp()
let network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    loadMore: true,
    page: 1,
    lastPage: '',
    commentType: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.systemInfo = wx.getSystemInfoSync()
    this.setData({
      windowHeight: this.systemInfo.windowHeight,
      goodsId: options.id
    })
    this.init(options.id);  //初始化数据
    this.getComment(options.id);
    this.getCommentWord(options.id);
    console.log(options);
  },


  init: function (_id) {
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

          that.goodsInfo = data;
          that.list = data.list;
          that.spellList = data.spell_list;

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
  getCommentWord: function (_id) {
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
  getComment: function (_id) {
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
            comment: res.data.data,
            lastPage: res.data.pagination.last_page,
            commentType: '',
            page:1
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

  //预览图片
  previewImage: function (e) {
    var pictures = e.currentTarget.dataset.pictures
    var index = e.currentTarget.dataset.index
    console.log(index)
    wx.previewImage({
      //当前显示下表
      current: pictures[index],
      //数据源
      urls: pictures
    })
  },


  //获取分类评论
  classifyComment: function (e) {
    var pid = this.data.goodsId;
    var id = e.currentTarget.dataset.id
    console.log(id)

    var that = this;
    wx.showLoading({
      title: '加载中',
    })

    network.POST({
      url: 'comment/list',
      params: {
        pid: pid,
        condition: id
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        var data = res.data.data;
        if (res.data.code == 200) {
          that.setData({
            comment: res.data.data,
            lastPage: res.data.pagination.last_page,
            commentType: id,
            page: 1
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


  //底部加载更多
  loadMore: function () {
    // console.log(111)
    var pid = this.data.goodsId;
    var page = this.data.page + 1;
    var lastPage = this.data.lastPage;
    var commentType = this.data.commentType;
    console.log(page)
    console.log(lastPage)

    if (page <= lastPage) {
      this.setData({
        page: page,
        loadMore: true
      })
        var that = this;
        wx.showLoading({
          title: '加载中',
        })

        network.POST({
          url: 'comment/list',
          params: {
            page: page,
            pid: pid,
            condition: commentType
          },
          success: function (res) {
            wx.hideLoading();
            console.log(res)
            var data = res.data.data;
            if (res.data.code == 200) {
              var comment = that.data.comment;

              for (var i = 0; i < res.data.data.length; i++) {
                comment.push(res.data.data[i]);
              };
              console.log(comment)
              that.setData({
                comment: comment
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
      // setTimeout(() => {
      
      // }, 5000)
      

    } 
    else {
      this.setData({
        loadMore: false,
      })
    }
    
    
    // this.setData({
    //   loadMore:true
    // })


  },


  //显示model
  showModal: function (e) {
    var type = e.currentTarget.dataset.type;
    //设置orderType
    if (type == 'alone') {
      this.setData({
        orderType: 1000
      })
    } else if (type == 'group') {

      console.log(111111111111111)
      this.setData({
        orderType: 1001
      })
    }




    var goodsList = type == 'alone' ? this.goodsInfo.list : this.goodsInfo.spell_list;
    console.log(type)
    console.log(this.goodsInfo.spell_list)
    console.log(goodsList);
    var specList, goodsImg, sPrice;
    if (goodsList.length > 0) {
      // console.log('11111111')
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
      maxNum: '',
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
      path: 'pages/goods/details?id=' + this.data.goodsId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})