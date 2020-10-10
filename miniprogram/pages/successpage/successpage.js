// miniprogram/pages/successpage/successpage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      typefont: '',
      renzheng:false,
      sellbool: false,
      jiesuan: false,
      shangmen: false,
      toubao: false,
      zhuce: false,
      chongzhimima: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let querytype = options.type
    this.setData({typefont: querytype})
    if(querytype == 'sell'){
      this.setData({
        sellbool : true
      })
    }else if(querytype == 'jiesuan'){
      this.setData({
        jiesuan : true
      })
    }else if(querytype == 'shangmen'){
      this.setData({
        shangmen : true
      })
    }else if(querytype == 'toubao'){
      this.setData({
        toubao : true
      })
    }else if(querytype == 'zhuce'){
      this.setData({
        zhuce : true
      })
    }else if(querytype == 'chongzhimima'){
      this.setData({
        chongzhimima : true
      })
    }else if(querytype == 'renzheng'){
      this.setData({
        renzheng : true
      })
    }
  },
  // 前往登录
  gologin(){
  },
  // 查看定价记录
  pricingRecordslog(){
   wx.navigateTo({
     url: "/pages/pricingRecords/pricingRecords",
   })
  },
  // 查看保单
  myclaim() {
   wx.navigateTo({
     url: '/pages/baodan/baodan',
   })
  },
  // 查看行情
  seedata(){
   wx.switchTab({
     url: '/pages/home/home',
   })
  },
  // 填写投保信息
  claimedit() {
   wx.navigateTo({
     url: '/pages/toubao/toubao',
   })
  },
  // 上门取货
  pickUpPage(){
   wx.navigateTo({
     url: '/pages/pickUp/pickUp',
   })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideHomeButton()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton()
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
    let than = this
    let types = than.data.typefont
    if(types == 'zhuce'){
      wx.redirectTo({
        url: '/pages/successpage/successpage?type=shangmen'
      })
    }
    // than.setData({
    //   typefont:
    // })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})