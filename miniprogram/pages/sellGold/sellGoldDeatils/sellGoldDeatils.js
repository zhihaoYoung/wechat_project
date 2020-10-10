// miniprogram/pages/sellGold/sellGoldDeatils/sellGoldDeatils.js
const polyfill = require('../../../utils/base64')
import Toast from '@vant/weapp/toast/toast';

const {atob} = polyfill;
const app = getApp()
var apilst = app.globalData.apilist
var reqlist = app.globalData.reqFun
var pako = require('pako');
import {
  Stomp
} from '../../../utils/stomp.js'


Page({

  /**
   * 页面的初始数据 
   */
  data: {
    comfirbox: false,
    typename:'huangjin9999',
    pricebox: '-.--',
    weight: '',
    initCity:'黄金金条9999',
    show: false,
    issslect: true,
    productselse:{
      province_list: {
        110000: '黄金',
        120000: '铂金',
        130000: '钯金',
        140000: '白银',
      },
      city_list: {
        110100: '',
        110200: '',
        120100: '',
        120200: '',
        130100: '',
        130100: '',
        140100: '',
        140200: '',
      },
      county_list: {
        110101: '黄金金条9999',
        110102: '黄金金条999',
        110103: '黄金首饰999',
        110104: '黄金18K 750',
        110105: '黄金(无法确定)',
        // 铂金
        120101: '铂金板料9996',
        120102: '铂金首饰999',
        120103: '铂金首饰990',
        120104: '铂金首饰950',
        120105: '铂金(无法确定)',
        // 钯金
        130101: '钯金板料9996',
        130102: '钯金首饰999',
        130103: '钯金首饰990',
        130104: '钯金首饰950',
        130105: '钯金(无法确定)',
        // 白银
        140101: '白银板料9999',
        140102: '白银首饰999',
        140103: '白银首饰990',
        140104: '白银首饰925',
        140105: '白银(无法确定)',
      },
    },
    // 当前选择的产品key
    productkey: 'huangjin9999',
    allpro_: [],
    firstres_data: [],
    firstdata:true,
    thanIndex: 0,
    havadatabox: true,
    // 当前时间
    timebox: '',
    // 价格盒子
    stompClient: null,
    socketConnected: false,
    messageQueue: [],
    reconnect: false,
    // 停盘的提示
    ceringModel:false,
    // 是否属于停盘中
    trade_:false,
    isclick: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // ws行情数据
    this.initSocket()
  },
  // 初始化ws链接
  initSocket() {
    var than = this
    var url =  app.globalData.wsurl
    var ws = {
      send: (msg) => {
        // 如果socket已连接则发送消息
        if (than.data.socketConnected) {
          wx.sendSocketMessage({
            data: msg
          })
        } else {
          // socket没有连接将消息放入队列中
          this.messageQueue.push(msg)
        }
      },
      close: () => {
        if (than.data.socketConnected) {
          wx.closeSocket()
        }
      },
      connect: () => {
        wx.connectSocket({
          url: url
        })
      },
    }
    console.log("执行init");
    Stomp.setInterval = function (interval, f) {
      return setInterval(f, interval);
    }
    Stomp.clearInterval = function (id) {
      return clearInterval(id);
    }
    var stompClient = Stomp.over(ws);
    var headers = {
      'login': 'username',
      'passcode': 'password',
    }
    stompClient.connect(headers, function succes(callback) {
      console.log('回调成功')
      let postdata =  '/price/all'
      stompClient.subscribe(postdata,than.resbody)
    },function error(error) {
      console.log(error)
    })
    than.setData({
      stompClient: stompClient
    })
    this.setListener(ws)
  },
  // 立即定价
  postData(event) {
    let than = this
    if(!than.data.trade_){
      than.setData({
        ceringModel: true
      })
      return false
    }
    let type = event.currentTarget.dataset.type
    if(type == 'lastpost'){
      if(than.data.isclick){
        return false
      }
      than.setData({
        isclick: true
      })
      let postData = {
        "addr": '',
        "lat": 0,
        "lng": 0,
        "order": [
          {
            "key": than.data.productkey,
            "weight": than.data.weight
          }
        ],
        "time": than.data.postTime
      }
      reqlist.req(apilst.sellgold,postData,function(res){
          if(res.code){
            than.setData({
              isclick: false
            })
            return Toast(res.msg),!1
          }else{
            wx.navigateTo({
              url: '/pages/successpage/successpage?type=sell'
            })
          }
      })
    }else{
      if(!than.data.weight){
        Toast("克重不能为空")
        return !1
      }
      this.setData({
        comfirbox: true,
      })
    }
    
    
   
    // PriceLineChart.sellgold(postData).then(res=>{
    //   this.$router.push({name:'successpage',query:{type:'sell'}})
    //   return false
    // }).catch(err=>{
    //    this.isclick = false
    // })
  },
  // 监听输入值
  handleInput2(event){
    let than = this
    let numberlast = event.detail.value.match(/^\d*(\.?\d{0,2})/g)[0]
    let countlast = ((+than.data.pricebox)*(+numberlast)).toFixed(2)
    this.setData({
      isinput:true,
      weight: numberlast,
      countMumber: countlast
    })
  },
  setListener(ws){
    let than = this
    ws.connect()
    // 监听 WebSocket 连接打开事件
    wx.onSocketOpen(function () {
      console.log("WebSocket 连接成功")
      than.setData({
        socketConnected: true
      })
      ws.onopen()
       // 连接成功后，将队列中的消息发送出去
       let queueLength = than.data.messageQueue.length
       for (let i = 0; i < queueLength; i++) {
         const messageQueueElement = than.data.messageQueue.shift();
         wx.sendSocketMessage({
           data: messageQueueElement
         })
       }
    })
    // 监听 WebSocket 接受到服务器的消息事件
    wx.onSocketMessage(function (res) {
      ws.onmessage(res)
    })
    // 监听 WebSocket 错误事件
    wx.onSocketError(function (res) {
      console.log("WebSocket 错误事件")
    })
    // 监听 WebSocket 连接关闭事件
    wx.onSocketClose(function (res) {
        console.log("WebSocket 连接关闭")
        ws.socketConnected = false
        // ws.onclose()
        // 断线重连
        if (ws.reconnect) {
          ws.connect()
        }
      })
  },
  unzip(b64Data){
      var strData   = atob(b64Data);
      var charData  = strData.split('').map(function(x){return x.charCodeAt(0);});
      var binData   = new Uint8Array(charData);
      var data    = pako.inflate(binData);
      strData   = String.fromCharCode.apply(null, new Uint16Array(data));
      return decodeURIComponent(escape(strData));
  },
  resbody(res){
    let than = this
    let frame = res
    let resbody_ = this.unzip(frame.body)
    let resbody = JSON.parse(resbody_);
    let allpro = []
    // 首次加载
    if(than.data.firstdata){
      than.setData({
        firstdata: false,
        firstres_data : resbody,
        // 是否开盘中
        trade_: resbody.trade
      })
      for(let i in resbody){
        if(resbody[i]['prices'] != undefined){
          allpro.push(resbody[i]['prices'])
        }
      }
      than.setData({
        allpro_:allpro,
        // 当前的时间段
        postTime: resbody.time,
        // 是否开盘中
        trade_: resbody.trade
      })
      than.pricenew()
    // 增量推送
    }else{
      let secondlastData = this.deepMerge(than.data.firstres_data,resbody)
      for(let i in secondlastData){
        if(secondlastData[i]['prices'] != undefined){
          allpro.push(secondlastData[i]['prices'])
        }
      }
      than.setData({
        // 当前的时间段
        postTime: resbody.time,
        allpro_:allpro
      })
      than.pricenew()
    }
  },
  // 价格变动更新视图
  pricenew(){
    let than = this
    let name_ = than.data.productkey
    than.data.allpro_.find((x)=>{
      if(x[name_]){
        than.setData({
          pricebox: x[name_]['huigou']
        })
      }
    })
  },
  // 更新数组
  updatearr(name){
    let productkey_ = ''
    if(name == '黄金金条9999'){
      this.pricenew('huangjin9999')
      productkey_ = 'huangjin9999'
    }else if(name == '黄金金条999'){
      this.pricenew('huangjin999jt')
      productkey_ = 'huangjin999jt'
    }else if(name == '黄金首饰999'){
       this.pricenew('huangjin999ss')
       productkey_ = 'huangjin999ss'
    }else if(name == '黄金18K 750'){
       this.pricenew('huangjin750')
       productkey_ = 'huangjin750'
    }else if(name == '黄金(无法确定)'){
       this.pricenew('huangjin9999')
       productkey_ = 'huangjin9999'
    }else if(name == '铂金板料9996'){
       this.pricenew('bojin9996')
       productkey_ = 'bojin9996'
    }else if(name == '铂金首饰999'){
       this.pricenew('bojin999')
       productkey_ = 'bojin999'
    }else if(name == '铂金首饰990'){
       this.pricenew('bojin900')
       productkey_ = 'bojin900'
    }else if(name == '铂金首饰950'){
       this.pricenew('bojin950')
       productkey_ = 'bojin950'
    }else if(name == '铂金(无法确定)'){
       this.pricenew('bojin9996')
       productkey_ = 'bojin9996'
    }else if(name == '钯金板料9996'){
       this.pricenew('bajin9996')
       productkey_ = 'bajin9996'
    }else if(name == '钯金首饰999'){
       this.pricenew('bajin999')
       productkey_ = 'bajin999'
       this.pricenew('bajin990')
       productkey_ = 'bajin990'
    }else if(name == '钯金首饰950'){
       this.pricenew('bajin950')
       productkey_ = 'bajin950'
       this.pricenew('bajin9996')
       productkey_ = 'bajin9996'
    }else if(name == '白银板料9999'){
       this.pricenew('baiyin9999')
       productkey_ = 'baiyin9999'
    }else if(name == '白银首饰999'){
       this.pricenew('baiyin999')
       productkey_ = 'baiyin999'
    }else if(name == '白银首饰990'){
       this.pricenew('baiyin990')
       productkey_ = 'baiyin990'
    }else if(name == '白银首饰925'){
       this.pricenew('baiyin925')
       productkey_ = 'baiyin925'
    }else if(name == '白银(无法确定)'){
       this.pricenew('baiyin9999')
       productkey_ = 'baiyin9999'
    }
    this.setData({
      productkey: productkey_
    })
  },
  showPopup(){
    this.setData({
      show: true
    })
  },
  confirmF(picker){
    let initlist = picker.detail.values
    this.setData({
       show: false,
       weight: '',
       initCity: initlist[1].name +''+initlist[2].name,
       productkey: initlist[2].name
      });
      this.countMumber = '0.00'
    this.updatearr(initlist[2].name)
  },
  onClose(){
    this.setData({
      isclick: false,
      comfirbox: false,
      show: false,
      ceringModel: false
    })
  },
  isPlainObject(val) {
    const toString = Object.prototype.toString
    return toString.call(val) === '[object Object]'
  },
  deepMerge(...objs) {
    let than = this
    const result = Object.create(null)
    objs.forEach(obj => {
      if (obj) {
        Object.keys(obj).forEach(key => {
          const val = obj[key]
          if (than.isPlainObject(val)) {
            // 递归
            if (than.isPlainObject(result[key])) {
              result[key] = than.deepMerge(result[key], val)
            } else {
              result[key] = than.deepMerge(val)
            }
          } else {
              //  数组也要重新赋值  不然依然会引用到其他的
            if (Array.isArray(val)) {
              result[key] = [...val]
            } else {
              result[key] = val
            }
          }
        })
      }
    })
    return result
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
    wx.closeSocket()
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