// miniprogram/pages/sellSettlement/sellSettleTable/sellSettleTable.js

const app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uesername: '',
    wuLiaoOrdershow: '',
    wuLiaoOrder: '',
    saleOrdershow:'',
    saleOrder: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let apilst = app.globalData.apilist
    let reqlist = app.globalData.reqFun
    let than = this
    reqlist.req(apilst.queryJieSuanOrderElecSaleNew,{orderId: options.oid},function(res){
       if(res.data.wuLiaoOrder){
          than.setData({
            uesername: res.data,
            wuLiaoOrdershow: true,
            wuLiaoOrder: res.data.wuLiaoOrder,
          })
       }
      if(res.data.saleOrder){
        than.setData({
          uesername: res.data,
          saleOrdershow: true,
          saleOrder: res.data.saleOrder,
        })
      }
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