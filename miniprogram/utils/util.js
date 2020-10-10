"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTime = function (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return ([year, month, day].map(formatNumber).join('/') +
        ' ' +
        [hour, minute, second].map(formatNumber).join(':'));
};
var formatNumber = function (n) {
    var s = n.toString();
    return s[1] ? s : '0' + s;
};


//修改成你的appid及appsecret
// var AppConf = { 'appid': 'wx40004b9195754174', 'appsecret':'cb10ea69158ef5c786c9e39cf6ea478f'};

// 请求封装
// exports.req =  function(url, data, cb) {
//     data.appid = AppConf.appid;
//     data.appsecret = AppConf.appsecret; 
//       wx.request({  
//         url: rootDocment + url,  
//         data: data,  
//         method: 'post',  
//         header: {'Content-Type':'application/x-www-form-urlencoded'},  
//         success: function(res){  
//           return typeof cb == "function" && cb(res.data)  
//         },  
//         fail: function(){  
//           return typeof cb == "function" && cb(false)  
//         }  
//       })  
//   }  
    
   
//   exports.getReq =   function (url,data,cb){ 
//     data.appid = AppConf.appid;
//     data.appsecret = AppConf.appsecret;
//     wx.request({  
//       url: rootDocment + url,
//       data: data, 
//       method: 'get',  
//       header: {'Content-Type':'application/x-www-form-urlencoded'},  
//       success: function(res){  
//         return typeof cb == "function" && cb(res.data)  
//       },  
//       fail: function(){  
//         return typeof cb == "function" && cb(false)  
//       }  
//     })  
// } 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBYSxRQUFBLFVBQVUsR0FBRyxVQUFDLElBQVU7SUFDbkMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO0lBQy9CLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDakMsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQzFCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUM1QixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDaEMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO0lBRWhDLE9BQU8sQ0FDTCxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDOUMsR0FBRztRQUNILENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUNuRCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsSUFBTSxZQUFZLEdBQUcsVUFBQyxDQUFTO0lBQzdCLElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUN0QixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO0FBQzNCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBmb3JtYXRUaW1lID0gKGRhdGU6IERhdGUpID0+IHtcbiAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKVxuICBjb25zdCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDFcbiAgY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKClcbiAgY29uc3QgaG91ciA9IGRhdGUuZ2V0SG91cnMoKVxuICBjb25zdCBtaW51dGUgPSBkYXRlLmdldE1pbnV0ZXMoKVxuICBjb25zdCBzZWNvbmQgPSBkYXRlLmdldFNlY29uZHMoKVxuXG4gIHJldHVybiAoXG4gICAgW3llYXIsIG1vbnRoLCBkYXldLm1hcChmb3JtYXROdW1iZXIpLmpvaW4oJy8nKSArXG4gICAgJyAnICtcbiAgICBbaG91ciwgbWludXRlLCBzZWNvbmRdLm1hcChmb3JtYXROdW1iZXIpLmpvaW4oJzonKVxuICApXG59XG5cbmNvbnN0IGZvcm1hdE51bWJlciA9IChuOiBudW1iZXIpID0+IHtcbiAgY29uc3QgcyA9IG4udG9TdHJpbmcoKVxuICByZXR1cm4gc1sxXSA/IHMgOiAnMCcgKyBzXG59XG4iXX0=