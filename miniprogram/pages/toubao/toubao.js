// miniprogram/pages/toubao/toubao.js
const app = getApp() 
let apilst = app.globalData.apilist
let reqlist = app.globalData.reqFun
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // comfirtip: true,
    comfirtip: false,
    toubaotip: true,
    initType:'黄金',
    keyEg_: 'huangjin',
    productselse:{
      province_list: {
        110000: '',
        120000: '',
        130000: '',
        140000: '',
      },
      city_list: {
        110100: '黄金',
        110200: '铂金',
        110300: '钯金',
        110400: '白银',
      },
      county_list: {
        110101: '',
        110102: '',
        110103: '',
        110104: '',
      }
    },
    show: false,
    addressCode: '',
    bxfei: '0',
    // 收货人Code
    addressid:'',
    // 用户信息
    ueserInfo:'',
    // 起运地
    startaddress:'请选择起运地',
    // 是否已经点击
    isclick: false,
    value: '',
    value2: '',
    value3: '',
    checkboxShape: true,
    formData:{
      // 运单号
      yundanhao:'',
      // 货物重量
      weight:'',
      // 投保额度
      money:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let than = this
    try {
      let formdata =  wx.getStorageSync('toubaodetails')
      if (formdata){
        let form_data = this.data.formData
        than.setData({
          value : formdata.yundanhao,
          'formData.yundanhao': formdata.yundanhao,
          'formData.weight': formdata.weight,
          value2: formdata.weight,
          'formData.money': formdata.money,
          value3: formdata.money,
        })
      }
      var value = wx.getStorageSync('userDetails')
      if (value) {
        than.setData({
          ueserInfo: value
        })
      }
    } catch (e) {
    }
   
    // reqlist.getReq(apilst.user,{},function(res){
    //   console.log(res)
   
    // })
    // setTimeout(function(){
      // console.log(than.data.ueserInfo)

    // },5000)
    // 获取默认收件人地址id
    reqlist.getReq(apilst.querySysAddressList,{},function(res){
      let resdata = res.data
      resdata.forEach(element => {
      if(element.defAddr){
          than.setData({
            addressid : element.code
          })
        }
      });
    })
    
    wx.getStorage({
      key: 'addressSelect',
      success:function(res){
        than.setData({
          startaddress: res.data.preAddr,
          addressCode: res.data.code
        })
      }
    })
  },
  // 投保须知关闭
  onClosetoubaotip(){
    this.setData({
      toubaotip: false,
      isclick: false,
      comfirtip: false
    })
  },
  // 弹窗确认
  confirmF(picker){
    let initlist = picker.detail.values
    let keyEg = ''
    if(initlist[1].name == '黄金'){
      keyEg = 'huangjin'
    }
    if(initlist[1].name == '铂金'){
      keyEg = 'bojin'
    }
    if(initlist[1].name == '钯金'){
      keyEg = 'bajin'
    }
    if(initlist[1].name == '白银'){
      keyEg = 'baiyin'
    }
    this.setData({
       show: false,
       initType: initlist[1].name,
       keyEg_ :keyEg
      });
  },
  showpopProduct(){
    this.setData({
      show: true
    })
  },
  // 弹窗关闭
  onClose(){
    this.setData({
      show: false
    })
  },
  noop(event){
    const { key } = event.currentTarget.dataset;
    this.setData({ [key]: event.detail });
  },
  // 立即投保
  toubaobtn(event){
    let than = this
    let { type } = event.currentTarget.dataset;

    // 最后提交
    if(type == 'lastpost'){
      if(this.data.isclick){return false}
      this.setData({
        isclick: true,
      })
      let postdata = {
        "expreceNo":than.data.formData.yundanhao,//快递单号
        "name":than.data.ueserInfo.realName,//投标人姓名
        "identificationCard":than.data.ueserInfo.identificationCard,//投保人身份证号码
        "receiveAddrId":than.data.addressid,//收货人地址code
        "sendAddrId": than.data.addressCode, //发货人地址code
        "goodName":than.data.initType,//投保货品种类
        "key":than.data.keyEg_,//商品key，多选时，已逗号隔开（黄金-huangjin，白银-baiyin，铂金-bojin，钯金-bajin，钻石-zuanshi）
        "weight":than.data.formData.weight,//货品重量
        "insuranceMoney":than.data.formData.money,//投保额度
        "insuranceFee":than.data.bxfei,//保险费
      }
      reqlist.req(apilst.addInsurance,postdata,function(res){
        if(res.code != 0){
          Toast(res.msg,)
          than.setData({
            isclick: false
          })
        }else{
          wx.removeStorageSync('toubaodetails')
          wx.reLaunch({
            url: '/pages/successpage/successpage?type=toubao',
          })
        }
      })
    // 弹出确认提交框
    }else if(type == 'btntype'){
      let shunfenR = /^(\d{12}|SF\d{13})$/
      let jineR = /^[1-9]\d*$/
      let weightR = /^\d+(\.\d+)?$/
      if(!shunfenR.test(than.data.formData.yundanhao)){
        Toast('顺丰单号格式错误')
        return false
      }
      if(than.data.addressCode == ''){
        Toast('起运地不能为空')
        return false
      }
      if(!jineR.test(than.data.formData.money)){
          Toast('投保额度格式错误')
          return false
      }
      if(!weightR.test(than.data.formData.weight)){
        Toast('重量格式错误')
        return false
      }
      if(!than.data.checkboxShape){
        Toast('未同意条款')
        return false
      }
      this.setData({
        comfirtip: true
      })
    }
  },
  // 获取顺丰单号的值
  onChange(event){
    let than = this
    let typebox = event.target.dataset.type
    if(typebox == 'yunliuhao'){
      let formData = 'formData.yundanhao'
      than.setData({
        [formData]:event.detail
      })
    }
    if(typebox == 'weight'){
      let formData = 'formData.weight'
      than.setData({
        [formData]:event.detail
      })
    }
    if(typebox == 'money'){
      let formData = 'formData.money'
      than.setData({
        [formData]:event.detail
      })
    }
  },
  // 保险额度
  getbaoxian(val){
    if(val<=12500){
      this.setData({
        bxfei: 5
      })
    }else{
      let lastNumber = Number(val*0.0004).toFixed()
      this.setData({
        bxfei: lastNumber
      })
    }
  },
  // 获取保险费
  getbaoxinf(event){
   this.getbaoxian(event.detail)
  },
  // 起运地
  hrefaddress(){
    wx.navigateTo({
      url: '/pages/address/addresslist?type=toubao',
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
    wx.setStorageSync('toubaodetails', this.data.formData)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.removeStorageSync('toubaodetails')
    let toubaoform = wx.getStorageSync('toubaodetails')
    console.log(toubaoform)
    // {"yundanhao":"","weight":"","money":""}
    if(toubaoform.yundanhao){
      wx.switchTab({
        url: '/pages/person/person'
      })
    }
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