// miniprogram/pages/registered/registered.js
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
    ruleCenter: '',
    trueFilter: true,
    show: false,
    phoneTime:'获取验证码',
    isClick: false,
    // 验证码
    phoneCode: '',
    username:'',
    password: '',
    checkboxShape: true,
    // 验证码按钮是否被点击过
    btndisable: false,
  },
  noop(event){
    const { key } = event.currentTarget.dataset;
    this.setData({ [key]: event.detail });
  },
  changeInput(e){
    let changed = {};
    let prop = e.currentTarget.dataset.prop
    changed[prop] = e.detail.value;
    this.setData(changed)
  },
  // 获取验证码
  getCode(){
    let than = this
    let data_than = this.data
    let rgephone = /^1[3,4,5,6,7,8,9][0-9]{1}[0-9]{8}$/
    if(!rgephone.test(data_than.username)){
      Toast.fail('手机号错误')
      return false
    }
    if(!data_than.btndisable){
      than.setData({
        btndisable: true
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
        url: baseUrl_+'/captcha/SIGNIN/'+data_than.username, 
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
  // 弹出注册协议
  rulebox(){
    this.setData({
      show: true
    })
  },
  // 注册
  handleRegister(){
    let than = this
    let data_than = this.data
    let rgephone = /^1[3,4,5,6,7,8,9][0-9]{1}[0-9]{8}$/
    let pasreg = /^[0-9]{6,20}$/
    let phoneCodereg = /^[0-9]{6}$/
    if(!rgephone.test(data_than.username)){
      Toast.fail('手机号错误')
      return false
    }
    if(!phoneCodereg.test(data_than.phoneCode)){
      Toast.fail('验证码错误')
      return false
    }
    if(!pasreg.test(data_than.password)){
      Toast.fail('密码错误')
      return false
    }
    if(!data_than.checkboxShape){
      Toast.fail('没有同意注册协议')
      return false
    }
    if(data_than.isClick){
      return false
    }
    than.setData({
      isClick: true
    })
    let RegisterForm = {
      phone: data_than.username,
      password: data_than.password,
      captcha: data_than.phoneCode,
      platform: 'ANDROID',
      regLat: 0,
      regLng: 0,
    };
    wx.request({
      method:'POST',
      url: baseUrl_+apilst.accountApi, 
      data: RegisterForm,
      success (res) {
        if(res.statusCode != 201){
          Toast.fail(res.data.msg || '网络错误，请稍后再试')
          than.setData({
            isClick: false
          })
        }else{
          wx.redirectTo({
            url: '/pages/successpage/successpage?type=zhuce',
          })
        }
      },fail(err){
        than.setData({
          isClick: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let than = this
    reqlist.getReq(apilst.agreementApi+'/REGISTER',{},function(res){
      // let lastres = res.content.replace(/(\p|\h1)/g,'view')
      let lastres = res.content
      than.setData({
        ruleCenter :lastres
      })
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