// pages/address/address.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    list: "",
    sId:'',
    addressType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.addressId)
    this.systemInfo = wx.getSystemInfoSync()
    this.setData({
      windowHeight: this.systemInfo.windowHeight,
    })
    if (options.type){
      this.setData({
        addressType: options.type
      })
    }
    if (options.addressId){
      this.setData({
        sId: options.addressId,
      })
    }
    this.getData();
    
  },
  //获取信息
  getData: function () {
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
        if (res.data.code == 200) {
          var data = res.data.data;

          data.map(item =>{
              console.log(item)
              if(that.data.sId){
                if (item.id == that.data.sId) {
                  item.isChecked = true
                } else {
                  item.isChecked = false
                }
              }else{
                if (item.is_default == 1) {
                  item.isChecked = true
                } else {
                  item.isChecked = false
                }
              }
              
          })


          that.setData({
            list: res.data.data
          })
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
  },


  //设置默认值
  setDefault: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.API_URL + 'address/update',
      data: {
        user_id: app.userId,
        address_id: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: '设置成功',
            icon: 'none',
            duration: 2000
          })

          that.getData();
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

  },

  //删除
  deleteAddress: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.API_URL + 'address/delete',
      data: {
        id: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 2000
          })

          that.getData();
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
  },

  //添加地址
  addAddress: function () {
    let that =this;
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

              that.getData();
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


  /**
   * 选中
   */
  checked:function(e){
    console.log(this.data.sId)
    if (this.data.addressType){
      
    }else {
      let index = e.currentTarget.dataset.index;
      var currentItem = e.currentTarget.dataset;
      console.log(currentItem.id)
      let list = this.data.list;

      console.log(list);
      let data = list.map(item => {
        if (item.id == currentItem.id) {
          item.isChecked = true
        } else {
          item.isChecked = false
        }
        return item
      })

      this.setData({
        list: data
      })

      let sAddress = list[index]

      console.log(sAddress);


      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      console.log(prevPage)
      prevPage.setData({
        sAddress: sAddress
      })

      wx.navigateBack();
    }
    
  },
})