// miniprogram/pages/address/addresslist.js
const app = getApp() 
let apilst = app.globalData.apilist
let reqlist = app.globalData.reqFun
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startloading: false,
    than_index:'-',
    // 是否从上门取货的那里跳转的
    pickupshow:false,
    toubao:false,
    // 对应的ID
    targetId: '',
    colorfont:'#ff8080',
    show: false,
    checked: true,
    addresslist: []
  },
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
  backpickup(event){
    let than = this
    // options_type
    try {
      let pickShowBoolean  = wx.getStorageSync('options_type')
      let uesrinfo = event.currentTarget.dataset.ueserinfo
      wx.setStorageSync('addressSelect', uesrinfo)
      if(pickShowBoolean && pickShowBoolean =='toubao'){
        wx.redirectTo({
          url: '/pages/toubao/toubao',
        })
        
      }else if(pickShowBoolean && pickShowBoolean =='pickup'){
        wx.redirectTo({
          url: '/pages/pickUp/pickUp',
        })
      }
    } catch (error) {
      
    }
    // if(this.data.pickupshow ){
    //   let uesrinfo = event.currentTarget.dataset.ueserinfo
    //   wx.setStorageSync('addressSelect', uesrinfo)
    //   if(this.data.toubao){
    //     wx.redirectTo({
    //       url: '/pages/toubao/toubao',
    //     })
    //   }else{
    //     wx.redirectTo({
    //       url: '/pages/pickUp/pickUp',
    //     })
    //   }
     
    // }
  },
  // 设置为默认地址
  initdata(event){
    let than = this
    let event_ = event.currentTarget.dataset
    let string_arr = JSON.stringify(event_.info.split(','))
    let event_arr = JSON.parse(string_arr)
    // let info = event_.info
    // {'id':{{items.id}},'code':{{items.code}},'phone':{{items.phone}},'preAddr':{{items.preAddr}},'address':{{items.address}}}
    let postData = {
      // 详细地址
      "address": event_arr[4],
      // 地区code
      "code": event_arr[1],
      //  是否默认地址
      "defAddr": 1,
      // 地址ID
      // "id": 0,
      // 收件人名
      "name": event_arr[5],
      // 收件人手机号
      "phone": event_arr[2],
    }
    let id = event_arr[0]
    reqlist.putReq(apilst.edditAddress+id,postData,function(res){
      reqlist.getReq(apilst.getAddress,{},function(res){
        than.setData({
          addresslist: res
        })
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let than = this
    if(options.type){
      wx.setStorageSync('options_type', options.type)
      // 从上门取货跳转过来的
      if(options.type == 'pickup' ){
        than.setData({
          pickupshow: true
        })
      }
      // 从投保页面进来
      if(options.type == 'toubao'){
        than.setData({
          toubao: true,
          pickupshow: true
        })
      }
    }
    reqlist.getReq(apilst.getAddress,{},function(res){
        than.setData({
          addresslist: res,
          startloading: true
        })
    })
    
  },
  // 删除弹窗确认
  side(e){
    let than = this
    let reqlist = app.globalData.reqFun
    let apilst = app.globalData.apilist
    console.log(this.data.targetId)
    reqlist.deleteReq(apilst.deleteAddress+this.data.targetId,{},function(res){
        let afterarr = than.data.addresslist
        afterarr.splice(than.data.than_index,1)
        than.setData({
          addresslist: afterarr
        })
    })
  },
  // 删除按钮
  deleteMsg(e) {
    let targetId = e.currentTarget.dataset.id
    let than_index = e.currentTarget.dataset.than_index
    this.setData({
      show: true,
      targetId: targetId,
      than_index: than_index
    });
  },
  // 编辑按钮
  edituser(event){
    let event_ = event.currentTarget.dataset
    let info = event_.info
    // let de = '"'+info+'"'
    // let ccc = JSON.stringify(info)
    // console.log(ccc)

    // let bb = JSON.parse(ccc)
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url:"/pages/address/addressedit/addressedit?type=edit&info="+JSON.stringify(info.split(','))
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