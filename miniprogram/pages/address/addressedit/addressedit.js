// miniprogram/pages/address/addressedit/addressedit.js
import AreaList from '../../../assets/js/area.js'
const app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否点击
    isclick: false,
    // 当前数据ID
    dataId: '',
    // 地址ID
    code: '',
    cityinit:'请选择',
    areaList: AreaList,
    checked: false,
    username:'',
    phone: '',
    addressdetails:'',
    // 判断页面是编辑还是新增
    pageType: 'add'
  },
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
  showPopup() {
    this.setData({ show: true });
  },
  confirmF(picker) {
    let initlist = picker.detail.values
    this.setData({
       show: false,
       cityinit: initlist[0].name+ ' ' + initlist[1].name + ' ' +initlist[2].name ,
       code : initlist[2].code
      });
    // this.issslect = true
    // this.cityinit = picker
  },
  onClose() {
    this.setData({ show: false });
  },
  onDescribe(e){
    let than = this
    let einfo = e.currentTarget.dataset.info
    if(einfo == 'no1'){
      than.setData({username:e.detail});
    }else if(einfo == 'no2'){
      than.setData({phone:e.detail});
    }else if(einfo == 'no3'){
      than.setData({addressdetails:e.detail});
    }
  },
  // 保存地址提交
  savepost(){

    let than = this

    let rule_ = app.globalData.rule
    if(than.data.isclick){return false}
    let apilst = app.globalData.apilist
    let reqlist = app.globalData.reqFun
    let thandata = this.data
    console.log(thandata.checked ? '1': '0')

    if(!rule_.cne.test(thandata.username)){
      wx.showToast({
        title: '联系人格式错误',
        icon: 'none',
      })
      return !1
    }
    if(!rule_.phone.test(thandata.phone)){
      wx.showToast({
        title: '联系电话格式错误',
        icon: 'none',
      })
      return !1
    }
    if(thandata.code == ''){
      wx.showToast({
        title: '地址为不能空',
        icon: 'none',
      })
      return !1
    }
    if(thandata.addressdetails == ''){
      wx.showToast({
        title: '详情地址为不能空',
        icon: 'none',
      })
      return !1
    }
    than.setData({
      isclick: true
    })
    let postdata = {
      // 详细地址
      "address": thandata.addressdetails,
      // 地区code
      "code": thandata.code ,
      //  是否默认地址
      "defAddr": thandata.checked ? '1': '0',
      // 收件人名
      "name": thandata.username,
      // 收件人手机号
      "phone": thandata.phone,
    }
    if(thandata.pageType == 'edit'){
      reqlist.putReq(apilst.edditAddress+thandata.dataId,postdata,function(res){
        wx.navigateTo({
          url: '/pages/address/addresslist',
        })
      })
    }else{
      // 新增地址
      reqlist.req(apilst.addAddress,postdata,function(res){
        if(res.address){
          wx.navigateTo({
            url: '/pages/address/addresslist',
          })
          than.setData({
            isclick: false
          })
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
          })
          than.setData({
            isclick: false
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let than = this
    // 编辑地址
    if(options.type && options.type == 'edit'){
      let info_ = options.info
      let parse_  = JSON.parse(info_)
      console.log(parse_)
      than.setData({
        dataId : parse_[0],
        pageType: 'edit',
        username: parse_[1],
        phone: parse_[2],
        cityinit: parse_[4],
        addressdetails: parse_[3],
        code: parse_[5],
        // 是否默认地址
        checked: parse_[6] == 'false' ? false : true,
      })
    }
    
    // items.id,items.name,items.phone ,items.address ,items.preAddr,items.code
    // console.log(JSON.parse(info_))
    // this.setData({
    //   areaList: arealist
    // })
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
    // wx.navigateTo({
    //   url: '/pages/address/addresslist',
    // })
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