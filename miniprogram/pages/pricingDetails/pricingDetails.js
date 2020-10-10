// miniprogram/pages/pricingDetails/pricingDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oidNumber:'',
    detailcenter:'',
    time:'',
    statusbox: '',
    productType: '',
    productPrice: '',
    productWeight: '',
    productTotal: '',
    ishowBtn_SUSPENSE: false,
    ishowBtn_FAIL: false,
    ishowBtn_UNDELIVERED: false,
    ishowBtn_CANCEL: false,
    ishowBtn_DONE: false,
  },
  // 去发货
  gosend(){
    wx.navigateTo({
      url: '/pages/pickUp/pickUp',
    })
  },
  // 再下一单
  addorder(){
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  // 重新下单
  resorder(){
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let infodetail = ''
    let detailsmsg = ''
    let than = this
    wx.getStorage({
      key: 'product',
      success:function(res){
        than.setData({
          productType:res.data.name,
          productPrice:res.data.price,
          productWeight:res.data.weight,
          productTotal:res.data.total,
        })
      }
    })
    if(options){
      if(options.status == 'SUSPENSE'){
        infodetail = '待审核'
        detailsmsg = '您的定价正在审核中，请耐心等待！'
        this.setData({
          ishowBtn_SUSPENSE : true
        })
        
      }else if(options.status == 'FAIL'){
        infodetail = '未通过'
        detailsmsg = '您的价格有误。'
        this.setData({
          ishowBtn_FAIL : true
        })
        
      }else if(options.status == 'UNDELIVERED'){
        infodetail = '待送达'
        detailsmsg = '您的定价已审核通过，请在48小时内发货！'
        this.setData({
          ishowBtn_UNDELIVERED : true
        })
        
      }else if(options.status == 'CANCEL'){
        infodetail = '已取消'
        detailsmsg = '您的订单已取消'
        this.setData({
          ishowBtn_CANCEL : true
        })
        
      }else if(options.status == 'DONE'){
        infodetail = '已完成'
        detailsmsg = '您的订单已完成'
        this.setData({
          ishowBtn_DONE : true
        })
        
      } 
    }
    this.setData({
      oidNumber: options.oid,
      timebox: options.time,
      statusbox: infodetail,
      detailcenter: detailsmsg
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