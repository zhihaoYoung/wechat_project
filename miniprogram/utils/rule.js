export const rule = {
	phone   :/^1[3,4,5,6,7,8,9][0-9]{1}[0-9]{8}$/,  
	email 	:/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
	pas  	  :/^[a-zA-Z\d_*0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{8,32}$/,
	imgCode :/^[\d|\w]{4}$/,                
  cn      :/^[\u4e00-\u9fa5]{0,}$/, 
	n_e		  :/^[\d|\w]{6,12}$/,   			          //数字和英文 6-12位
  number  :/^\d$/,               
	codeReg :/^[\<\>]$/gm,						            //大于号小于号
	NoZn    :/^[1-9]\d*$/,					              //非零数字
	p_c		  :/^[\d]{6}$/, 					              //手机验证码 6位
	e_c   	:/^[\d]{6}$/, 					              //邮箱验证码 6位
	GoogleC :/^[\d]{6}$/, 					              //谷歌验证码 6位
	n_Int 	:/^[0-9]+([.]{1}[0-9]+){0,1}$/,       //小数或者整数
  int     :/^[0-9]*[1-9][0-9]*$/,               //整数
  gtzeros :/^\d+(\.\d+)?$/,                     //大于0的数（包含小数点）
  otherZero :/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,  
  cne     : /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,    //数字英文中文
	c_e     : /^[a-zA-Z0-9]+$/,	                //数字英文
  otherNumber :/^\d+(\.\d+)?$/,
  bank     :/^([1-9]{1})(\d{14}|\d{15}|\d{18})$/,   //银行卡账号
  // ([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])
}