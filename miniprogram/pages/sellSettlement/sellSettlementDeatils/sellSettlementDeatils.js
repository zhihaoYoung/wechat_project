// miniprogram/pages/sellSettlement/sellSettlementDeatils/sellSettlementDeatils.js
var util_req = require('../../../utils/request.js');
var api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderidNumber: '',
    confirmbox: false,
    show: false,
    moneybox: '',
    datalist:[],
    bankuser:''
  },
  // 确认无误*弹窗
  postData(){
    this.setData({
      confirmbox: true
    });
  },
  dianzidanju(event){
    let event_ = event.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/sellSettlement/sellSettleTable/sellSettleTable?oid='+event_.oid
    })
  },
  // 再来一单
  addorder(){
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  // 取消弹窗
  canclebox() {
    this.setData({
      show: false,
      confirmbox: false
    });
  },
  // 确认无误-提交数据
  submitdata(){
    util_req.req(api.sureJieSuanOrder,{orderId:this.data.orderidNumber},function(res){
      wx.navigateTo({
        url: '/pages/sellSettlement/sellSettlement',
      })
    })
  },
  // 再来一单
  addover(){
    wx.navigateTo({
      url: '/pages/pricing/pricing',
    })
  },
  // 对订单有疑问
  questionbox(){
    console.log("show-page")
    this.setData({
      show: true
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let than = this
    let options_ = {
      orderType: options.paystatus,
      orderId: options.orderid
    }
    util_req.req(api.queryJieSuanOrderDetail,options_,function(res){
      let moneybox = String(res.data.moneyTotal)
      let replaceval = moneybox.replace('+', ' ')
      than.setData({
        orderidNumber: options.orderid,
        datalist: res.data,
        moneybox: replaceval,
        payType: options.paystatus
      })
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let than = this
    util_req.getReq(api.banklist,{},function(res){
      than.setData({
        bankuser:  res[0].bankCard.prettyBankNumber
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