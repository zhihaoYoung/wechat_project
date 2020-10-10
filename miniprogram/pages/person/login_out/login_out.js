// miniprogram/pages/person/login_out/login_out.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_moible: '',
    user_auth: '-'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let auth = wx.getStorageSync('auth')
    let moible = wx.getStorageSync('moible')
    this.setData({
      user_moible: moible,
      user_auth : auth
    })
  },
  // 认证中 或者未认证函数
  gocer(){
    wx.navigateTo({
      url: '/pages/certification/userEdit/userEdit',
    })
  },
  loginoutbtn(){
    wx.removeStorageSync('userToken')
        wx.removeStorageSync('moible')
        wx.removeStorageSync('userRefresh_Token')
        wx.removeStorageSync('addressSelect')
        wx.removeStorageSync('auth')
        wx.switchTab({
          url: '/pages/person/person',
        })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})