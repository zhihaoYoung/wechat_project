// miniprogram/pages/person/person.js
const app = getApp() 
var reqlist = require('../../utils/request.js');
let apilst = app.globalData.apilist
// let reqlist = app.globalData.reqFun
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'/assets/images/people.png',
    cershow_ing: false,
    cershow: false,
    haveLogin: false,
    // 手机
    moible:'',
    // 待确认金额
    user_money: '0.00',
    // 是否已经获取到用户的微信信息
    haveDate: false,
    // 用户数据
    userdetials: {},
    // 待发货克重
    count: '0.00',
    realName:'',
    // 是否已经认证
    auth: 'UNPOST',
    // 用户手机号
    ueserMoible:'',
  },
  // 用户设置信息
  uesrsetting(){
    console.log("1234")
  },
  // 关闭弹窗
  hideDialog(){
    this.setData({
      cershow: false,
      cershow_ing: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let token = wx.getStorageSync("userToken");
    // console.log(token)
    
    // let userInfo_ = wx.getStorage({
    //   key: 'userInfo',
    //   success:function(res){
    //     than.setData({
    //       haveDate : true,
    //       userdetials : res.data
    //     })
    //   }
    // })
    
    // 判断是否登录
   
  },
  // 认证中或者未认证提示
  return_tap(event){
    if(!this.data.haveLogin){
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false
    }else{
        try {
          let value_token = wx.getStorageSync('userToken')
          if(value_token){
            const { type } = event.currentTarget.dataset;
              // 未认证
              if(type == 'UNPOST'){
                this.setData({
                  cershow: true
                })
              }else{
              // 认证中
                this.setData({
                  cershow_ing: true
                })
          
              }
          }else{
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        } catch (err) {
        }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  initData(){
    let than = this
    reqlist.getReq(apilst.getUser,{},function(res){
      // 过期了
      if(res.error == 'invalid_token'){
        return false
      }
      wx.setStorageSync('auth', res.auth)
      // 已经实名认证通过了
      if(res.auth == 'DONE'){
        wx.setStorageSync('userDetails', res)
        // 待确认金额
        reqlist.getReq(apilst.queryJieSureWattingMoney,{},function(res){
          than.setData({
            user_money: res.data.money || '0.00'
          })
        })
        // 待发克重
        reqlist.getReq(apilst.getundeliveredcount,{},function(res){
          than.setData({
            count: res.data || '0.00'
          })
        })
        than.setData({
          avatar: res.avatar || '/assets/images/people.png',
          realName: res.realName,
          ueserMoible: res.phone,
          //认证状态，UNPOST(未提交)，POST(待审核),FAIL(拒绝),DONE(通过)
          auth: res.auth,
        })
      }else{
        than.setData({
          //认证状态，UNPOST(未提交)，POST(待审核),FAIL(拒绝),DONE(通过)
          auth: res.auth,
        })
      }
      than.setData({
        haveLogin: true
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let than = this
    than.setData({
      user_money: '0.00',
      count: '0.00'
    })
    let token_ = wx.getStorageSync('userToken')
    if(token_ != ''){
      than.initData()
    }else{
      if(than.data.haveLogin){
        than.setData({
          auth: 'UNPOST',
          avatar:'/assets/images/people.png',
          haveLogin: false
        })
      }
    }
    // console.log(wx.getStorageSync('userToken'))
    // try {
    //   var value = wx.getStorageSync('userToken')
    //   if (value) {
        
    //   }
    // } catch (e) {
    // }
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