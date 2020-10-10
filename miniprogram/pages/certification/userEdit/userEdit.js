// miniprogram/pages/certification/userEdit/userEdit.js
const app = getApp() 
let apilst = app.globalData.apilist
let reqlist = app.globalData.reqFun
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    successpage:false,
    form:{
      idCardBack: wx.getStorageSync('positive') || '',//身份证背面图片上传阿里云后的key
      idCardFace: wx.getStorageSync('back') || '',//身份证正面图片上传阿里云后的key
      //真实姓名
      name:'',
      //身份证号码
      idNum:'',
      bankNo:'',
      bankName:'',
      bankAddress:'',
      //身份证过期时间
      idExpire: wx.getStorageSync('idcradtime')
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let name = wx.getStorageSync('id_card_userName')
    let idcrad = wx.getStorageSync('idcrad')
    let than_data = this.data.form
    than_data['name']  = name
    than_data['idNum']  = idcrad
    this.setData({
      form:than_data
    })
  },
  // 提交数据
  postData(){
    // console.log(this.data.form)
    reqlist.req(apilst.authUser,{},function(res){
      if(res.code != 0){
        console.log("123")
          Toast.fail(res.msg || '网络错误，请稍后再试')
      }else{
        wx.redirectTo({
          url: '/pages/successpage/successpage?type=renzheng',
        })
        // this.successpage = true
      }
    })
  },

  changeInput(e){
    let changed = this.data.form;
    let prop = e.currentTarget.dataset.prop
    changed[prop] = e.detail.value;
    this.setData(changed)
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