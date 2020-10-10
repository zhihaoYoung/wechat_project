// miniprogram/pages/kefu/kefu.js
const app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peoplelist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  phonecall(event){
    let event_ = event.currentTarget.dataset
    wx.makePhoneCall({
      phoneNumber: event_.phone //仅为示例，并非真实的电话号码
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let than = this
    let apilst = app.globalData.apilist
    let reqlist = app.globalData.reqFun
    reqlist.getReq(apilst.queryContactInfo,{},function(res){
      than.setData({
        peoplelist: res.data
      })
    })
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