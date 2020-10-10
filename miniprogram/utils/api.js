
// 注册提交以及获取验证码
export let accountApi  = '/account'


// 查询系统银行卡
export let banklist  = '/sys/bank'

// 登录
export let loginApi  = '/oauth/token'

// 获取当前用户的客服
export let queryContactInfo ='/sys/queryContactInfo'

// 获取用户消息
export let gettrade ='/user/msg'

// 获取用户消息-详情页面
export let msgdetails  = `/user/msg/`


//  用户获取自己的地址
export let getAddress  ='/address '



//  用户添加自己的地址
export let addAddress = '/address'

// 常见问题
export let queryFrequentlyQuestionList  = '/order/queryFrequentlyQuestionList'

//  用户删除自己的地址
export let deleteAddress =`/address/`



//  用户修改自己的地址
export let edditAddress  = `/address/`


//  卖出结算记录
export let queryJieSuanOrderList  = `/order/queryJieSuanOrderList`
  // orderType结算类型：0 卖出结算 1压盘结算


//  卖出结算-电子单据
export let queryJieSuanOrderElecSaleNew = `/order/queryJieSuanOrderElecSaleNew`



//  卖出结算详情
export let queryJieSuanOrderDetail = `/order/queryJieSuanOrderDetail`
  // orderType结算类型：0 卖出结算 1压盘结算
  // orderId  订单id
  


//  卖出结算确认
export let sureJieSuanOrder = `/order/sureJieSuanOrder`
  // orderId  订单id

// 各种协议
export let agreementApi = `/sys/user/agreement`



//  查询保险列表
export let queryInsuranceList =`/order/queryInsuranceList`


//  查询我的保单详情
export let queryInsuranceDetail = `/order/queryInsuranceDetail`



//  用户物流请求列表
export let myexpress = `/order/express?status=`


// 获取文件上传地址
export let apiFile =`/file?size=1`

//  金价实时更新
export let queryCurrentPriceLineChart = `/order/queryCurrentPriceLineChart`


//  金价K线图实时更新
export let queryPriceLineChartData = `/order/queryPriceLineChartData?key=`
  // key:金属种类 黄金：huangjin9999  白银：baiyin9999  钯金：bajin9996  铂金：bojin9996
  


//  个人中心待确认金额
export let queryJieSureWattingMoney = `/order/queryJieSureWattingMoney`
  
//  获取ws的Url
export let settingSys = `/setting/sys`


// 用户进行身份认证
export let authUser = `/user/authUser`

// 获取实名信息
export let getUser = `/user`

// 修改密码
export let accountApi_repas = `/account`


// 上传文件
// export let fileup (data) {
//   `/file?method=POST&contentType=multipart/form-data`,data)
// 


// 物流叫快递申请
export let express = `/order/express`


// 物流详情
export let expressdetails = `/order/express/`


// 上传文件地址




//  用户创建卖出订单
export let sellgold = '/order/sell'


// 获取用户信息
// export let getuser ='/user'


// 获取用户信息-待发货克重
export let getundeliveredcount ='/order/sell/undelivered/count'


// 新增投保信息
export let addInsurance = '/order/addInsurance'


// 获取平台默认的收件人地址id
export let querySysAddressList ='/sys/querySysAddressList'



// 定价记录列表
export let mortgageApi  = `/order/sell/list?`
  // page=0&status=
  // status => ALL 全部数据  SUSPENSE 待审核 UNDELIVERED 待发货  TRANSIT 运送中  FAIL 未通过 CANCEL 已取消  DONE 已完成
  // `/order/mortgage/list?page=${page_&type=1&status=${status`
  

