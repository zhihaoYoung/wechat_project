// miniprogram/pages/sellGold/sellGold.js
const polyfill = require('../../utils/base64')
import * as echarts from '../../component/ec-canvas/echarts';
const {atob} = polyfill;
var pako = require('pako');
const app = getApp()
var apilst = app.globalData.apilist
var reqlist = app.globalData.reqFun
import {
  Stomp
} from '../../utils/stomp.js'

let computer_echart = ''
// canvas, width, height
function setOption(chart,timebox_,data_arr,ydata) {
  // const chart = echarts.init(canvas, null, {
  //   width: width,
  //   height: height
  // });
  // canvas.setChart(chart);
  var option = {
    tooltip: {
        show:true,
        trigger: 'axis',
        backgroundColor:'rgba(0,0,0,0.8)',
        formatter: function(v){
          // let result = ''
          console.log(v)
          return v[0].axisValue+'    '+v[0].data+'元/克'
        },
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
       xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: timebox_
            }
        ],
    // xAxis: [
    //     {
    //       name: '价格',
    //         type: 'category',
    //         boundaryGap: false,
    //         axisLabel:{
    //           textStyle: {
    //             color: '#656565'
    //           }
    //         },
    //         data: timebox_
    //     }
    // ],
         yAxis: [
              {
                 max:ydata[5],
                 min:ydata[0],
                 interval: Number(ydata[1] - ydata[0]),
                 axisLabel:{
                   formatter: function(v){
                     if(parseInt(v).toString().length >= 3){
                        return Number(v).toFixed(2)
                     }else{
                        return Number(v).toFixed(3)
                     }
                   }
                 }
              }
          ],
    series: [
      {
        data: data_arr,
        type: "line",
        smooth: true,
        areaStyle:{
          normal:{
             //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(255, 194, 105,1)'
              }, {
                  offset: .9,
                  color: 'rgba(255, 194, 105,1)'
              },{
                  offset: 1,
                  color: 'rgba(255, 194, 105,0.00)' 
              }])

          }
      }, //填充区域样式
        lineStyle: {
          color: "#ffc269",
          width: 1
        }, //线条的样式
        itemStyle: {
          color: "rgb(255, 194, 105)",
        } //拐点的样式
      }
    ],
};

  chart.setOption(option);
  // return chart;
}

Page({

  /**
   * 页面的初始数据 
   */
  data: {
    startloading: false,
    ceringModel: false,
    trade_: true,
    ceringModel: false,
    thanIndex: 0,
    productlist: [{name:'黄金9999',code:'huangjin9999'},{name:'铂金9996',code:'bojin9996'},{name:'钯金9996',code:'bajin9996'},{name:'白银9999',code:'baiyin9999'}],
    //y轴自定义事件
    ydataarr: [],
    havadatabox: true,
    ec: { 
      lazyLoad: true,
      // onInit: initChart // 3、将数据放入到里面
    },
    // 当前时间
    timebox: '',
    // 数字实时价格变动
    pricenowbox:[],
    // 价格盒子
    pricebox:'',
    stompClient: null,
    socketConnected: false,
    messageQueue: [],
    reconnect: false,
    // 当前选择的产品
    nowProduct: ''
    // client: this.Stomp.client(''),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onClose(){
    this.setData({
      ceringModel: false
    })
  },
  // 顶部选项卡切换
  tabselect(event){
    let targert = event.currentTarget.dataset
    if(targert.indexbox == this.data.thanIndex){
      return false
    }else{
      if(!this.data.havadatabox){
        return false
      }else{
          this.setData({
            thanIndex: targert.indexbox,
            havadatabox: false,
          })
        }
      this.initProduct(targert.code)
      // 折线图-切换
      this.knowprice(targert.code)
    }
  },  
  timeDown(){
    let than = this
    // 现在的时间
    let nowDate = new Date()
    let mon = nowDate.getMonth()+1
    let day = nowDate.getDate ()
    let hours = nowDate.getHours()
    let min = nowDate.getMinutes()
    let Sec = nowDate.getSeconds()
    let updataTime =  (mon <=9 ? '0'+mon: mon) +'/'+(day <=9 ? '0'+day: day) +' '+hours+":"+(min <=9 ? '0'+min: min)+':'+ (Sec <=9 ? '0'+Sec: Sec)
    this.setData({
      timebox : updataTime
    })
    setTimeout(()=>{
      than.timeDown()
    },1000)
  },
  // 分钟转成小时
  ChangeHourMinutestr(str){
    if (str !== "0" && str !== "" && str !== null) {
       let times = ((Math.floor(str / 60)).toString().length < 2 ? "0" + (Math.floor(str / 60)).toString() : 
       (Math.floor(str / 60)).toString()) + ":" + ((str % 60).toString().length < 2 ? "0" + (str % 60).toString() : (str % 60).toString());
       // console.log(times)
       return times
     }else{
       return "";
     }
 },
  // 折线图
  knowprice(code){
    let than = this
    let nowDate = new Date()
    let year = nowDate.getFullYear()
    let timelistcenter = []
    let huangjin9999 = []
    let timebox_ = []
    // key:金属种类 黄金：huangjin9999  白银：baiyin9999  钯金：bajin9996  铂金：bojin9996
    let code_ = code || 'huangjin9999'
    reqlist.getReq(apilst.queryPriceLineChartData+code_,{},function(res){
      for(let i in res.data){
        let monthtime = than.ChangeHourMinutestr(res.data[i].min)
        // huangjin9999.push({time: || '00:00',price:res.data[i].price})
        huangjin9999.push(res.data[i].price)
        timebox_.push(monthtime ? monthtime: '00:00')
        timelistcenter.push({x: monthtime ? new Date(year+'/'+than.data.timebox.split(' ')[0] + ' '+ monthtime+':00').getTime() : new Date(year+'/'+than.data.timebox.split(' ')[0] + ' '+ '00:00:00').getTime() ,y:+res.data[i].price})
      }
    })
    // console.log(huangjin9999)
    setTimeout(function(){
      than.setData({
        startloading: true
      })
      than.init_one(timebox_,huangjin9999)
    },800)
    
    // this.setData({

    // })
    // setTimeout(function(){
      // console.log(chart)
      // chart.setOption({
      //   xAxis: [
      //       {
      //           type: 'category',
      //           boundaryGap: false,
      //           data: timebox_
      //       }
      //   ],
      //       yAxis: [
      //         {
      //            max:than.data.ydataarr[5],
      //            min:than.data.ydataarr[0],
      //            interval: Number(than.data.ydataarr[1] - than.data.ydataarr[0]),
      //            axisLabel:{
      //              formatter: function(v){
      //                if(parseInt(v).toString().length >= 3){
      //                   return Number(v).toFixed(2)
      //                }else{
      //                   return Number(v).toFixed(3)
      //                }
      //              }
      //            }
      //         }
      //     ],
      //   series: [
      //     {
      //       data:huangjin9999,
      //   }
      //   ],
      // })
      // than.setData({
      //   havadatabox: true
      // })
    // },500)
    setTimeout(function(){
      than.setData({
         havadatabox: true
      })
    },1000)
  },
  initProduct(code){
    let than = this
    let code_ = than.data.nowProduct || code ||  'huangjin9999'
  
    reqlist.getReq(apilst.queryCurrentPriceLineChart,{},function(res){
        if(res.code == 0){
          than.setData({
            pricebox: res.data
          })
          let b;
          for(b in than.data.pricebox){
            if(b == code_){
              than.setData({
                pricenowbox: than.data.pricebox[b]
              })
              // if(than.data.pricenowbox.price > than.data.oldpricenowbox){
              //   this.redup = true
              //   this.greendown = false
              // }else if(than.pricenowbox.price < than.oldpricenowbox){
              //   this.greendown = true
              //   this.redup = false
              // }
              // // 储存旧值
              // than.oldpricenowbox = than.pricenowbox.price
              // this.tabover = true
              // this.isClick = false
              // than.emitdata.push(this.pricebox[b])
            }
          }
          let arr = []
          let maxPrice = than.data.pricenowbox.maxPrice
          let minPrice = than.data.pricenowbox.minPrice
          let fprice = (maxPrice-minPrice)/4
          // // 最高点价格、最低点价格
          let topmaxPrice = Number(maxPrice)+Number(fprice)
          let bottomPrice = Number(minPrice)-Number(fprice)
          // // 每隔一差值
          let dval = (topmaxPrice-bottomPrice)/5
          let numberbox = ''
          for(let i = 0;i<6;i++){
            if(code_ === 'baiyin9999'){
              numberbox = Number(topmaxPrice-i*dval).toFixed(3)
            }else{
              numberbox = Number(topmaxPrice-i*dval).toFixed(2)
            }
            if(numberbox<=0){
              numberbox = 0
            }
            arr.push(+numberbox)
          }
          than.setData({
            ydataarr: arr.sort()
          })
        }
    })
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
    than.setData({
      // 是否开盘中
      trade_: resbody.trade
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    // this.oneComponent  = this.selectComponent('#mychart-one')
    // console.log(this.selectComponent('#mychart-one'))
  },
  init_one: function (timebox_,data_arr) {  
    //初始化表格
    let than = this
    // console.log( computer_echart)
    // console.log(this)
    let oneComponent = this.selectComponent('#mychart-one')
    oneComponent.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
            width: width,
            height: height
        });
        setOption(chart, timebox_,data_arr,than.data.ydataarr)
        // than.setData({
        //   startloading:true
        // })
        // this.chart = chart;
        // return chart;
    });
  },
  sellgoldbtn(){
    if(!this.data.trade_){
      this.setData({
        ceringModel: true
      })
    }else{
      wx.navigateTo({
        url: '/pages/sellGold/sellGoldDeatils/sellGoldDeatils',
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userToken = wx.getStorageSync('userToken')
    if(!userToken){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }else{
      // 当前时间
      this.timeDown()
      // 获取当前行情数据的各种数值
      this.initProduct()
      // ws行情数据
      this.initSocket()
      // 折线图
      this.knowprice()
    }
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