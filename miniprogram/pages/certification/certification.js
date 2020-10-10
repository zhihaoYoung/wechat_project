const polyfill = require('../../utils/base64')
const {atob} = polyfill;
const app = getApp() 
let apilst = app.globalData.apilist
let reqlist = app.globalData.reqFun
import Toast from '@vant/weapp/toast/toast';
Page({
  data: {
    // 是否可以进行下一步
    isnext:false,
    // 身份证
    idcard: '',
    username: '',
    // 百度API
    access_token_baidu:'',
    baiduURL : 'https://aip.baidubce.com',
    img64:'',
    updateimg: false,
    afterimg:'',
    fileList1:[],
    forkpage:true,
    usercenter:false,
    tempFilePaths: '',
    files: [{
        url: '',
    }, {
        loading: true
    }, {
        error: true
    }]
  },
  onLoad() {
    this.getAccess_token()
      this.setData({
        //   selectFile: this.selectFile.bind(this),
        //   uplaodFile: this.uplaodFile.bind(this)
      })
  },
  //第一步（获取上传接口）
  getUploadUrl(path,type){
    var than = this
    reqlist.req(apilst.apiFile,{},function(res){
        wx.setStorageSync(type, res[0].key)
        than.uploadFile(path,res[0].url);
    })
  },
  uploadFile(imgpath,url){
    let than = this
    let imgarr = this.base64ToUint8Array()
    wx.request({
        method : 'PUT',
        header:{
            'Content-Type': 'application/octet-stream',
        },
        url: url,
        data: imgarr,
        success(){
          than.baiduAi()
        }
    })
  },
  base64ToUint8Array() {
    let than = this
    let base64clear = than.data.img64.substring(than.data.img64.indexOf(',') + 1)
　　　const padding = '='.repeat((4 - base64clear.length % 4) % 4);
      const base64 = (base64clear + padding)
                  .replace(/\-/g, '+')
                  .replace(/_/g, '/');
      const rawData = atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
  },
  // 百度获取token
  getAccess_token() {
    let than = this;
    let than_data = this.data
    // 百度识别API
    wx.request({
      url: than_data.baiduURL+'/oauth/2.0/token?grant_type=client_credentials&client_id=be6w7r4WpAbC3PD9uZXNjcIG&client_secret=gdNytEvMm3hoaoGenkYA87O7rrAI9BO2',
      success(res){
        let {access_token} = res.data
        than.setData({
          access_token_baidu :access_token
        })
      }
    })
  },
  // 下一步
  nextpage(){
    let than = this
    if(!than.data.isnext){
      wx.showToast({
        title: '请上传身份证照片',
        icon: 'none',
        duration: 1500
      })
      return false
    }else{
      wx.navigateTo({
        url: '/pages/certification/backIdcard/backIdcard',
      })
    }
    
  },
  // 百度api身份证识别
  baiduAi(){
    let that = this
    let than_data = this.data
    let token = that.data.access_token_baidu
    let data_ = {
      image: encodeURI(than_data.img64).slice(22),
      id_card_side: "front"
    }
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=' + token,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data_,
      success(_res) {
        let image_status = _res.data.image_status;
        let IdCard = _res.data.words_result.公民身份号码.words || '';
        let userName = _res.data.words_result.姓名.words;
        wx.setStorageSync('idcrad', IdCard)
        wx.setStorageSync('id_card_userName', userName)
        if (image_status == "normal") {
          that.setData({
            username:userName,
            idcard: IdCard,
            usercenter: true,
            isnext: true,
          })
          wx.hideLoading()
          // 校验成功可以进行下一步
        } else if(image_status == "reversed_side"){
           wx.showToast({
            title:  '身份证正反面颠倒',
            mask: true,
            icon:'none',
            duration: 3500
          });
          // that.isloading = false
        }else if(image_status == "non_idcard"){
           wx.showToast({
            title:  '上传的图片中不包含身份证',
            mask: true,
            icon:'none',
            duration: 3500
          });
          // that.isloading = false
        }else if(image_status == "blurred"){
           wx.showToast({
            title:  '身份证模糊',
            mask: true,
            icon:'none',
            duration: 3500
          });
          // that.isloading = false
        }else if(image_status == "other_type_card"){
           wx.showToast({
            title:  '其他类型证照',
            mask: true,
            icon:'none',
            duration: 3500
          });
          // that.isloading = false
        }else if(image_status == "over_exposure"){
           wx.showToast({
            title:  '身份证关键字段反光或过曝',
            mask: true,
            icon:'none',
            duration: 3500
          });
          // that.isloading = false
        }else if(image_status == "over_dark"){
           wx.showToast({
            title:  '身份证欠曝（亮度过低）',
            mask: true,
            icon:'none',
            duration: 3500
          });
          // that.isloading = false
        }else if(image_status == "unknown"){
           wx.showToast({
            title:  '未知状态',
            mask: true,
            icon:'none',
            duration: 3500
          });
          this.isloading = false
        }else{
           wx.showToast({
            title:  '图片上传错误',
            mask: true,
            icon:'none',
            duration: 3500
          });
        }
      }, fail(_res) {
        wx.hideLoading();
        wx.showToast({
          title: '请求出错',
        })
      }
    })
  },
   chooseimage(){
    var _this = this;
    wx.chooseImage({
        count: 1, // 默认9  
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
        success: function success(res) {
          wx.showLoading({
            mask:true,
            title: '正在上传...',
          })
          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[0], //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
                _this.setData({ img64:'data:image/png;base64,' + res.data })
                _this.getUploadUrl('data:image/png;base64,' + res.data , 'positive')
            }
          })
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
          _this.setData({
            tempFilePaths: res.tempFilePaths,
            updateimg:true
          });
        }
      });
  },
});