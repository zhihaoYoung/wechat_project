const app = getApp() 
let apilst = app.globalData.apilist
let reqlist = app.globalData.reqFun
import Toast from '@vant/weapp/toast/toast';
// map.js
Page({
  data: {
    isloading: true,
    havefont: false,
    havatip:false,
    // 收获人ID
    userId:'',
    // 备注
    beizhu:'',
    // 运费
    moneybox: 0,
    // 城市是跨区还是市还是省
    kuaiditype_:0,
    addressCode: '',
    formdataId: '',
    haveDate: false,
    preAddr:'',
    name:'',
    phone:'',
    address:'',
    price: {
        'city': {
            'base': 12, 
            'step': 2
        }, 
        'province': {
            'base': 13, 
            'step': 2
        }, 
        'country': {
            'base': 23, 
            'step': 14
        }
    },
    markers: [{
      iconPath: "/assets/images/address.png",
      id: 0,
      latitude: 39.943634,
      longitude: 116.371782,
      width: 39,
      height: 58
    }],
  },
  onLoad: function (options) {
    let than = this
    wx.getStorage({
      key: 'addressSelect',
      success:function(res){
        than.setData({
          haveDate: true,
          preAddr:res.data.preAddr,
          userId:res.data.id,
          name:res.data.name,
          phone:res.data.phone,
          address:res.data.address,
          addressCode: res.data.code
        })
      }
    })
     // 获取平台默认收货地址
     reqlist.getReq(apilst.querySysAddressList,{},function(res){
      let resdata  = res.data
      setTimeout(()=>{
        than.setData({
          isloading: false
        })
      },1500)
      resdata.forEach(element => {
        if(element.defAddr){
          than.setData({
            formdataId: element
          })
         // 判断是否跨区，跨市，跨省
          than.codeCompare(element.code)
        }
      });
    })
  },
  computeExpressPrice(gram, type) {
    const computePrice = this.data.price[type];
    const extKg = (Math.round((gram/100-10))/10);
    return computePrice.base + Math.round((extKg<=0)?0:extKg*computePrice.step);
  },
   // 跨省比较
   codeCompare(shouhuoID){
    if(this.data.addressCode){
    let shouhuoarr = shouhuoID.replace(/\d{1,2}(?=(\d{2})+(\.\d*)?$)/g,'$&,').split(',')
    let fahuoarr = this.data.addressCode.replace(/\d{1,2}(?=(\d{2})+(\.\d*)?$)/g,'$&,').split(',')
    let kuaiditype = ''
      if(fahuoarr[0] != shouhuoarr[0]){
        // 跨省
        kuaiditype = 'country'
      }else if(fahuoarr[1] != shouhuoarr[1]){
        // 跨市
        kuaiditype = 'province'
      }else if(fahuoarr[2] != shouhuoarr[2]){
        // 跨区
        kuaiditype = 'city'
      }
      this.setData({
        kuaiditype_: kuaiditype
      })
    }
  },
  weightinput(event){
    let val =  event.detail.value
    if(this.data.kuaiditype_ == 0){
      Toast.fail('发货地址为空');
      this.setData({
        content: "0.00"
      })
    }else{
      let moneybox = this.computeExpressPrice(val,this.data.kuaiditype_)
      this.setData({
        havatip: true,
        moneybox: moneybox,
        content: val
      })
    }
    
  },
  // 备注输入框获取值
  addressInput(event){
    let val =  event.detail.value
    this.setData({
      beizhu: val
    })
  },
  Pickupbtn(){
   let than_data = this.data
   if(than_data.content == '' || than_data.content == undefined || than_data.content == '0.00'){
      Toast.fail('请输入重量');
      return false
   }
   let postdata = {
      // 收货人地址
      receiveAddrId: String(than_data.formdataId.id),
      // 发货人地址id
      sendAddrId:String(than_data.userId),
      // 预估克重
      totalWeightGram: than_data.content,
      // 预估金额
      expressMoney:String(than_data.moneybox),
      // 备注
      remark: than_data.beizhu,
    }
    reqlist.req(apilst.express,postdata,function(res){
      if(res.status == 'SUCCESS'){
        wx.redirectTo({
          url: '/pages/successpage/successpage?type=shangmen',
        })
      }
    })
  },
  // 显示弹窗
  showtip(){
    let than = this
    than.setData({
      havefont: true
    })
    setTimeout(function(){
      than.setData({
        havefont: false
      })
    },2000)
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.detail.markerId)
  },
  controltap(e) {
    console.log(e.detail.controlId)
  }
})
