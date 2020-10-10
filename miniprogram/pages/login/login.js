// miniprogram/pages/login/login.js
const app = getApp() 
let apilst = app.globalData.apilist
let baseUrl_ = app.globalData.baseURL
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否已经点击过了
    isClick: false,
    // 敏感数据
    encryptedData:'',
    iv: '',
    // 表单数据
    username: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.removeStorageSync('moible')
    wx.removeStorageSync('userToken')
  },
  loginbox(){
   
    let than = this
    let data_than = this.data
    let rgephone = /^1[3,4,5,6,7,8,9][0-9]{1}[0-9]{8}$/
    let pasreg = /^[0-9]{6,20}$/
    if(!rgephone.test(data_than.username)){
      Toast.fail('手机号错误')
      return false
    }
    if(!pasreg.test(data_than.password)){
      Toast.fail('密码错误')
      return false
    }
    if(data_than.isClick){
      return false
    }
    than.setData({
      isClick: true
    })
    
    let postData = {
      username: data_than.username,
      password: data_than.password,
      scope: 'write',
      grant_type: 'password',
      client_secret: 'secretkey',
      client_id: 'app'
    };
    
    let ret = ''
    for (let it in postData) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(postData[it]) + '&'
    }
    let auth = {
      "username":'app',
      "password":'secretkey'
    };
    wx.request({
      method:'POST',
      url: baseUrl_+apilst.loginApi, 
      data: postData,
      header: {
        'content-type': 'application/x-www-form-urlencoded', 
        'Authorization': 'Basic '+'YXBwOnNlY3JldGtleQ=='
      },
      success (res) {
        if(res.statusCode == 400){
          Toast.fail('账户名或密码错误')
          than.setData({
            isClick: false
          })
        }else{
          wx.setStorageSync('userToken', res.data.access_token)
          wx.setStorageSync('userRefresh_Token', res.data.refresh_token)
          wx.setStorageSync('moible', data_than.username)
          wx.switchTab({
            url: '/pages/person/person',
            success() {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        }
      },fail(err){
        than.setData({
          isClick: false
        })
      }
    })
  },
  changeInput(e){
    let changed = {};
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

  },
  wechatlogin:function(){
   
    let that = this
    // 获取账户的信息
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        that.setData({encryptedData: res.encryptedData})
        that.setData({iv: res.iv})
        // console.log(res.iv)
        // console.log(res.encryptedData)
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        app.setUserInfo(userInfo)
        // wx.switchTab({
        //   url:'/pages/person/person'
        // })
      }
    })
  },
  bindGetUserInfo (e) {
    console.log(e.detail.userInfo)
  }
})