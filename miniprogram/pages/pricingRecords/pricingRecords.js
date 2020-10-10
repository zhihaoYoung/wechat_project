// miniprogram/pages/pricingRecords/pricingRecords.js
var util_req = require('../../utils/request.js');
var api = require('../../utils/api.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isloading: true,
    endData:false,
    // 是否加载更多
    isload:false,
    // 数据列表
    datalist: [],
    active: 0,
    windowsheight: '',
    pageIndex: 0,
    // 标签类型
    typeInfo_:'',
    // 是否获取到了屏幕高度
    haveData: false
  },
  onChange(event) {
  },
  // 滚动加载
  lower(){
    var _this = this;
    if(_this.data.isload){
      return false
    }
    this.setData({
      isload: true
    })
    _this.data.pageIndex++
    _this.loadDate(_this.data.pageIndex, _this.data.typeInfo_)
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
    let aes = 'listdata.first[0].name'
    let firsts = 'first'
    wx.setNavigationBarTitle({
      title: '定价记录',
    }) 
    this.getDate()
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
  getDate(index_) {
    // {index:1,name:'全部',type:'ALL'},{index:2,name:'待审核',type:'SUSPENSE'},
    // {index:3,name:'未通过',type:'FAIL'},{index:4,name:'待发货',type:'UNDELIVERED'},
    // {index:5,name:'已完成',type:'DONE'},{index:6,name:'已取消',type:'CANCEL'}
    let than = this
    if(than.data.getdata){
      return false
    }
    
    let TabIndex  = index_ || 0
    let typeInfo = 'ALL'
    than.setData({
      datalist: [],
    })
    switch(TabIndex){
      case 0:
        typeInfo = 'ALL'
      break;
      case 1:
        typeInfo = 'SUSPENSE'
      break;
      case 2:
        typeInfo = 'FAIL'
      break;
      case 3:
        typeInfo = 'UNDELIVERED'
      break;
      case 4:
        typeInfo = 'DONE'
      break;
      case 5:
        typeInfo = 'CANCEL'
      break;
    }
    than.setData({
      typeInfo_: typeInfo,
      pageIndex: 0,
      getdata: true,
      endData:false
    })
    than.loadDate(this.data.pageIndex,typeInfo)
  },
  loadDate(pageIndex,typeInfo){
    let than = this
    if(than.data.endData){return false}
    let typeInfo_ = typeInfo || than.data.typeInfo
    let page_ = pageIndex || than.data.pageIndex
    util_req.getReq(api.mortgageApi,{page:page_,status:typeInfo_},function(res){
      let resArr = than.data.datalist
      if(res.content){
        let cont_length = res.content.length
        if(cont_length <= 0){
          than.setData({
            endData: true,
            getdata:false
          })
        }
        for(let i in res.content){
          resArr.push(res.content[i])
        }
        than.setData({
          datalist: resArr,
          isloading: false,
          isload: false,
          getdata: false
        })
      }
    })
  },
  // 切换标签
  tabIndex(event){
   
    this.getDate(event.detail.index)
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