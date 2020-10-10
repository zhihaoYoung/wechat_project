// miniprogram/pages/sellSettlement/sellSettlement.js
var util_req = require('../../utils/request.js');
var api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 卖料结算是否没数据
    nodata:false,
    // 是否空数据（待发货数据）
    emptydata:true,
    datalist: [],
    newproductlist: [],
    query_type: false
  },
  // queryJieSuanOrderList
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let than = this
    util_req.req(api.queryJieSuanOrderList,{orderType:0},function(res){
      if(res.code != 0){
        wx.showToast({
          title: '网络繁忙,请稍后再试',
          icon :'none'
        })
      }else{
        if(res.data.length <= 0){
          than.setData({
            nodata:true
          })
        }
        than.setData({
          query_type: options.type,
          datalist: res.data
        },()=>{
          than.showyear()
        })
      }
    })
  },
  // 待确认金额
  showyear(){
    let than = this
    let newarr = []
    let selllist_ = than.data.datalist
    for(let i in selllist_){
      newarr.push({year:selllist_[i].date,ishavadata:false})
      for(let b in selllist_[i].orderList){
       if(selllist_[i].orderList[b].payStatus == 2){
         let getyear = selllist_[i].orderList[b].date.split(' ')[0]
         let yearmonth  = getyear.split('-')[0] +'-'+ getyear.split('-')[1]
         for(let item in newarr){
           if(newarr[item].year == yearmonth){
             newarr[item].ishavadata = true
           }
         }
       }
      }
    }
    than.setData({
      newproductlist: newarr
    },()=>{
      for(let b in this.data.newproductlist){
        if(this.data.newproductlist[b]['ishavadata']){
          than.setData({
            emptydata : false
          })
        }
      }
    })
    
  },
  hrefDetails(event){
    let event_ = event.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/sellSettlement/sellSettlementDeatils/sellSettlementDeatils?orderid='+event_.orderid+'&paystatus='+event_.paystatus
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