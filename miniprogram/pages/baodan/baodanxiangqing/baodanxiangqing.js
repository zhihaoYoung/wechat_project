// miniprogram/pages/baodan/baodanxiangqing/baodanxiangqing.js
// 
const app = getApp() 
let apilst = app.globalData.apilist
let reqlist = app.globalData.reqFun
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listdata:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id_ = options.id
    let than = this
    let databox = { orderNo:options.id}
    reqlist.getReq(apilst.queryInsuranceDetail,databox,function(res){
      than.setData({
        listdata: res.data
      })
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