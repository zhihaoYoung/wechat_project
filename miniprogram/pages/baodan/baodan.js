// miniprogram/pages/baodan/baodan.js
// 
const app = getApp() 
let apilst = app.globalData.apilist
let reqlist = app.globalData.reqFun
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否有数据
    haveData:'',
    // 数据
    datalist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let than = this
    reqlist.getReq(apilst.queryInsuranceList,{},function(res){
      than.setData({
        datalist: res.data
      })
    })
  },
  detailsbox(event){
    let event_ = event.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/baodan/baodanxiangqing/baodanxiangqing?id='+event_.id,
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