// miniprogram/pages/toBeDelivered/toBeDelivered.js
const app = getApp()
var apilst = app.globalData.apilist
var reqlist = app.globalData.reqFun

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodata: false,
    isloading: true,
    getdata: true,
    pageIndex: 0,
    datalist : [] ,
    windowsheight: 0,
    haveData: false,
    // 是否在滚动中
    isload: false,
    // 是否没数据了
    endData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let than = this
    wx.getSystemInfo({
      success: (res) => {
        than.setData({
          windowsheight: res.windowHeight,
          haveData: true
        })
      }
    })
    this.loadDate(this.data.pageIndex)
  },

  lower(){
    var _this = this;
    if(_this.data.isload){
      return false
    }
    this.setData({
      isload: true
    })
    _this.data.pageIndex++
    _this.loadDate(_this.data.pageIndex)
  },
  // 跳转
  hrefDetails(event){
    let than = this
    let event_ = event.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pricingDetails/pricingDetails?status='+event_.status+'&oid='+event_.oid+'&time='+event_.time
    })
    wx.setStorageSync('product', event_.goods)
  },
  loadDate(indexPage){
    let than = this
    if(than.data.endData){return false}
    let postData = {
      page:indexPage,
      status:'UNDELIVERED'
    }
    reqlist.getReq(apilst.mortgageApi,postData,function(res){
      let resArr = than.data.datalist
      if(res.content){
        let cont_length = res.content.length
        if(cont_length <= 0){
          than.setData({
            endData: true,
            getdata:false,
            nodata: true
          })
        }
        for(let i in res.content){
          resArr.push(res.content[i])
        }
        than.setData({
          datalist: resArr,
          isload: false,
          getdata: false,
          isloading:false
        })
      }

      // than.setData({
      //   datalist:res.content,
      //   isload: false
      // })
      
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