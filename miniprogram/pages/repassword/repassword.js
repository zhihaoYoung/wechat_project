// miniprogram/pages/repassword/repassword.js
import Toast from '@vant/weapp/toast/toast';
const app = getApp() 
var apilst = app.globalData.apilist
var reqlist = app.globalData.reqFun
var baseUrl_ = app.globalData.baseURL
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steppass:false,
    phoneTime:'获取验证码',
    // 验证码按钮是否被点击过
    btndisable: false,
    // 是否点击过
    isClick:false,
    // 第二次提交
    secondpost: false,
    form:{
      username: '',
      phoneCode: '',
      password: '',
      secondpassword: '',
    },
  },
  // 提交数据
  postData(){
    let than = this
    if(this.data.secondpost){
      return false
    }
    this.setData({
      secondpost: true
    })
    let postData = {
      captcha: this.data.form.phoneCode,
      password: this.data.form.password,
      phone: this.data.form.username
    }
    reqlist.putReq(apilst.accountApi_repas,postData,function(res){
        wx.removeStorageSync('userToken')
        wx.removeStorageSync('moible')
        wx.removeStorageSync('userRefresh_Token')
        wx.removeStorageSync('addressSelect')
        wx.removeStorageSync('auth')
        wx.redirectTo({
          url: '/pages/successpage/successpage?type=chongzhimima',
        })
    })
  },
  // 输入框双向绑定
  changeInput(e){
    let changed = this.data.form;
    let prop = e.currentTarget.dataset.prop
    changed[prop] = e.detail.value;
    this.setData(changed)
  },
   // 获取验证码
   getCode(){
    let than = this
    let data_than = this.data
    let rgephone = /^1[3,4,5,6,7,8,9][0-9]{1}[0-9]{8}$/
    if(!rgephone.test(data_than.form.username)){
      Toast.fail('手机号错误')
      return false
    }
    if(!data_than.btndisable){
      than.setData({
        btndisable: true,
        isClick: true
      })
      let lastTime = 60;
      let timer = setInterval(function() {
          if(lastTime>0){
            than.setData({
              phoneTime: lastTime + 's'
            })
            lastTime--;
          } else {
              clearInterval(timer);
              than.setData({
                btndisable: false,
                phoneTime:'获取验证码',
              })
          }
      }, 1000);
      // 发送类型 （SIGNIN—注册，FORGET—忘记密码，RESET—重置密码，BIND—微信绑定）
      wx.request({
        method:'POST',
        url: baseUrl_+'/captcha/FORGOT/'+data_than.form.username, 
        success (res) {
          if(res.data.code != 0){
            Toast.fail(res.data.msg)
            clearInterval(timer);
            than.setData({
              phoneTime:'获取验证码',
              btndisable: false
            })
          }
        },fail(err){
          
        }
      })
    }
  },
  // 第一步提交
  nextpost(){
    let than = this
    let regCode = /^[\d]{6}$/
    let rgephone = /^1[3,4,5,6,7,8,9][0-9]{1}[0-9]{8}$/
    if(!rgephone.test(than.data.form.username)){
      Toast.fail('手机号错误')
      return false
    }

    if(!regCode.test(than.data.form.phoneCode)){
      Toast.fail('验证码错误')
      return false
    }
    if(!than.data.isClick){
      Toast.fail('验证码错误')
      return false
    }
    this.setData({
      steppass: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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