"use strict";
// const app = getApp() 
// let baseUrl_ = app.globalData.baseURL
const  baseUrl = 'https://beijingzxj.com/api'


//修改成你的appid及appsecret
var AppConf = { 'appid': 'wx40004b9195754174', 'appsecret':'cb10ea69158ef5c786c9e39cf6ea478f'};
let isinvalid_token = false
// 微信请求
function wxrequestFun(url,data,cb,type){
  if(isinvalid_token){return false}
  let overlogin =  wx.getStorageSync("userToken") || '';
  wx.request({  
    url: baseUrl + url,
    data: data, 
    method: type,  
    header: {
      'Authorization' :  'Bearer ' + overlogin
    },  
    success: function(res){  
      // 如果返回401了 - 则带着userRefresh_Token 再去请求一次
      if(res.statusCode == 401){
        let userRefresh_Token =   wx.getStorageSync("userRefresh_Token") || '';
        let loginForm = {
          scope: 'write',
          grant_type: 'password',
          refresh_token:userRefresh_Token,
          client_secret: 'secretkey',
          client_id: 'app'
        };
        let auth = {
          "username":'app',
          "password":'secretkey'
        };
        wx.request({
          method:'POST',
          url: baseUrl+'/oauth/token',
          header: {
            'Authorization': 'Basic YXBwOnNlY3JldGtleQ==',
            'content-type': 'application/x-www-form-urlencoded', 
          }, 
          data: loginForm,
          success:function(res){
            if(res.statusCode == 400){
                wx.removeStorageSync('userToken')
                wx.removeStorageSync('userRefresh_Token')
                wx.removeStorageSync('moible')
                wx.removeStorageSync('auth')
                wx.removeStorageSync('userDetails')
                wx.showToast({
                  title: '登录超时，请稍后再试',
                  icon: 'none',
                })
                setTimeout(()=>{
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                },1500)
               
                // router.replace({
                //   path: '/login',
                //   query: { redirect: router.currentRoute.fullPath }
                // })
            }
          },
          fail:function(err){
            console.log(err)
          }
        })
      }else{
        return typeof cb == "function" && cb(res.data)  
      }
    },  
    fail: function(err){  
      return typeof cb == "function" && cb(false)  
    }  
  })  
}
// 请求封装-post
exports.req =  function(url, data, cb) {
  wxrequestFun(url,data,cb,'post')
}  
// 请求封装-put
exports.putReq =   function (url,data,cb){
  wxrequestFun(url,data,cb,'put')
} 
// 请求封装-get
exports.getReq =   function (url,data,cb){ 
  wxrequestFun(url,data,cb,'get')
} 
// 请求封装-delete
exports.deleteReq =   function (url,data,cb){ 
  wxrequestFun(url,data,cb,'delete')
} 