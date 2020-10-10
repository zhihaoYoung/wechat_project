// miniprogram/pages/home/home.js
const polyfill = require('../../utils/base64')
import * as echarts from '../../component/ec-canvas/echarts';
const {atob} = polyfill;
var pako = require('pako');
const app = getApp()
let timebox = new Date()
let years_ =  timebox.getFullYear()
let Month_ =  timebox.getMonth()+1
let date_ =  timebox.getDate()

import {
  Stomp
} from '../../utils/stomp.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isloading: true,
    trade_: false,
    timebox:'',
    new_tuisong_val_before: [],
    sendmsg: false,
    wsPrice: [],
    // 分别对应的产品数组
    product_huangjin_arr: [],
    product_bojin_arr:[],
    product_bajin_arr:[],
    product_baiyin_arr: [],
    product_shangjiaosuo_arr: [],
    product_guojingxianhuo_arr: [],

    firstdata : true,
    stompClient: null,
    socketConnected: false,
    messageQueue: [],
    reconnect: false,
    secondLoadData: [],
    nameInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setWatcher(this);
    this.timeDown()
  },
  timeDown(){
    let than = this
    // 现在的时间
    let nowDate = new Date()
    let years = nowDate.getFullYear()
    let mon = nowDate.getMonth()+1
    let day = nowDate.getDate ()
    let hours = nowDate.getHours()
    let min = nowDate.getMinutes()
    let Sec = nowDate.getSeconds()
    let updataTime =  years+'-'+(mon <=9 ? '0'+mon: mon) +'-'+(day <=9 ? '0'+day: day) +' '+hours+":"+(min <=9 ? '0'+min: min)+':'+ (Sec <=9 ? '0'+Sec: Sec)
    this.setData({
      timebox : updataTime
    })
    setTimeout(()=>{
      than.timeDown()
    },1000)
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
      than.setData({
        isloading: false
      })
      stompClient.subscribe(postdata,than.resbody)
    },function error(error) {
      console.log(error)
    })
    than.setData({
      stompClient: stompClient
    })
    this.setListener(ws)
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
  resbody(res){
    let than = this
    let frame = res
    let resbody_ = this.unzip(frame.body)
    let resbody = JSON.parse(resbody_);
    if(!than.data.firstdata){
      // 第二次推的数据
      let secondLoadData = than.deepMerge(than.data.wsPrice,resbody)
      than.setData({
        trade_: resbody.trade,
        secondLoadData:secondLoadData
      })
    }
    if(than.data.firstdata){
      // 首次推的数据
      than.newlistsort(resbody)
      than.setData({
        firstdata: false,
        trade_: resbody.trade,
        wsPrice: resbody
      })
    }
  },
  // 排序
  compare(property){ 
    return function(a,b){
        var value1 = a[property]; 
        var value2 = b[property]; 
        return value1 - value2; 
      } 
  },
  newlistsort(data){
    let huangjin_arr = []
    let bojin_arr = []
    let bajin_arr = []
    let baiyin_arr = []
    let shangjinsuo_arr = []
    let guojixianhuo_arr = []
    let resbody = data
    for(let i in resbody){
        if(resbody[i].name === '黄金'){
          for(let b in resbody[i].prices){
            if(resbody[i].prices[b]['display'] =='SHOW'){
              huangjin_arr.push({'engname':b,'sort':resbody[i].prices[b].sort,'productData':resbody[i].prices[b]})
            }
          }
          huangjin_arr.sort(this.compare('sort'))
        }
        if(resbody[i].name === '铂金'){
          for(let b in resbody[i].prices){
            if(resbody[i].prices[b]['display'] =='SHOW'){
              bojin_arr.push({'engname':b,'sort':resbody[i].prices[b].sort,'productData':resbody[i].prices[b]})
            }
          }
            bojin_arr.sort(this.compare('sort'))
        }
        if(resbody[i].name === '钯金'){
          for(let b in resbody[i].prices){
            if(resbody[i].prices[b]['display'] =='SHOW'){
              bajin_arr.push({'engname':b,'sort':resbody[i].prices[b].sort,'productData':resbody[i].prices[b]})
            }
          }
          bajin_arr.sort(this.compare('sort'))
        }
        if(resbody[i].name === '白银'){
          for(let b in resbody[i].prices){
            if(resbody[i].prices[b]['display'] =='SHOW'){
              baiyin_arr.push({'engname':b,'sort':resbody[i].prices[b].sort,'productData':resbody[i].prices[b],time:resbody.time})
            }
          }
          baiyin_arr.sort(this.compare('sort'))
        }
        if(resbody[i].name === '上金所'){
          for(let b in resbody[i].prices){
            if(resbody[i].prices[b]['display'] =='SHOW'){
              shangjinsuo_arr.push({'engname':b,'sort':resbody[i].prices[b].sort,'productData':resbody[i].prices[b]})
            }
          }
          shangjinsuo_arr.sort(this.compare('sort'))
        }
        if(resbody[i].name === '国际现货'){
          for(let b in resbody[i].prices){
            if(resbody[i].prices[b]['display'] =='SHOW'){
              guojixianhuo_arr.push({'engname':b,'sort':resbody[i].prices[b].sort,'productData':resbody[i].prices[b]})
            }
          }
          guojixianhuo_arr.sort(this.compare('sort'))
        }
      }
    this.setData({
      product_huangjin_arr:huangjin_arr,
      product_bojin_arr:bojin_arr,
      product_bajin_arr:bajin_arr,
      product_baiyin_arr:baiyin_arr,
      product_shangjiaosuo_arr:shangjinsuo_arr,
      product_guojingxianhuo_arr:guojixianhuo_arr,
    })
  },
  watch:{
    secondLoadData:{
      handler(newValue,old) { 
        if(old instanceof Array){

        }else{
          this.setData({
            new_tuisong_val_before: old,
            sendmsg: true
          })
        }
        this.newlistsort(newValue)
      },
      deep:true
      }
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
    let than = this
     // ws行情数据
    than.initSocket()
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